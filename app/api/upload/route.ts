/*
 * Upload route for task submissions.
 * Accepts multipart/form-data, stores files on uguu.se, and writes DB rows.
 * Adds Gemini-based validation details to proof metadata.
 *
 * @return JSON { id, proof_url, created_at, status, validation }
 */

import { Pool, PoolClient } from "pg";
import { createClient } from "@/lib/supabase/server"; // this is the upload endpoint for task submissions

// this is the upload endpoint for task submissions
// it accepts a file and an optional task_id
// the user must be authenticated, and their id should be passed in the x-user-id header

export async function POST(req: Request) {
  // this endpoint expects a multipart/form-data body
  // and a header "x-user-id" containing the authenticated user's id.
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  const userId = authData?.claims.sub;
  if (!userId) {
    // user must be authenticated
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  // parse the form data if you couldn't tell from allat ts generics
  let form: FormData;
  try {
    form = await req.formData();
  } catch (err) {
    return new Response(JSON.stringify({ error: "invalid form data" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const file = form.get("file") as File | null;
  const taskIdField = form.get("task_id");
  const taskId = taskIdField ? String(taskIdField) : null;

  if (!file) {
    return new Response(JSON.stringify({ error: "missing file" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // enforce 128 MiB max size (134217728 bytes)
  const MAX_BYTES = 128 * 1024 * 1024;
  // file.size should be available on the File/Blob
  if (typeof file.size === "number" && file.size > MAX_BYTES) {
    // file too big
    return new Response(JSON.stringify({ error: "file too large" }), {
      status: 413,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    // read file data
    const buffer = await file.arrayBuffer();

    // prepare form-data for uguu.se
    const uploadForm = new FormData();
    uploadForm.append("MAX_FILE_SIZE", String(MAX_BYTES));
    const filename = (file as any).name || "upload.bin";
    uploadForm.append("files[]", new Blob([buffer]), filename);

    // send to uguu
    const res = await fetch("https://uguu.se/upload", {
      method: "POST",
      body: uploadForm,
    });

    if (!res.ok) {
      console.error("uguu upload failed", res.status, await res.text());
      return new Response(
        JSON.stringify({ error: "failed to upload to remote host" }),
        {
          status: 502,
          headers: { "content-type": "application/json" },
        },
      );
    }

    const rawBody = await res.text();
    const proofUrl = extractUguuUrl(rawBody);

    // insert into db
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return new Response(
        JSON.stringify({ error: "database not configured" }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        },
      );
    }

    const pool = new Pool({ connectionString: dbUrl });
    const client = await pool.connect();

    try {
      let taskMeta: {
        name?: string | null;
        desc?: string | null;
        xp?: number | null;
      } | null = null;
      if (taskId) {
        const taskLookup = await client.query(
          `SELECT name, "desc", xp FROM public.tasks WHERE id = $1 LIMIT 1`,
          [taskId],
        );
        taskMeta = taskLookup.rows[0] ?? null;
      }

      // gemini shiiiii might be slow but we keep it inline for now
      const geminiDecision = await validateProofWithGemini({
        proofUrl,
        taskId: taskId ?? undefined,
        taskMeta,
        userId,
      });
      const statusFromDecision = mapVerdictToStatus(geminiDecision.verdict);
      const aiReason = geminiDecision.reason || null;
      const reward = computeReward(taskMeta?.xp, statusFromDecision);
      if (reward) {
        await applyReward(client, userId, reward);
      }

      const insertSql = `
        INSERT INTO public.task_submissions (user_id, task_id, proof_url, proof_meta, status, ai_reason)
          VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, created_at
      `;
      // stash this shit inside proof meta for observability
      const proofMeta = {
        source: "uguu.se",
        raw_response: rawBody,
        filename,
        gemini: geminiDecision,
      };
      const values = [
        userId,
        taskId,
        proofUrl,
        JSON.stringify(proofMeta),
        statusFromDecision,
        aiReason,
      ];
      const r = await client.query(insertSql, values);
      const row = r.rows[0];

      return new Response(
        JSON.stringify({
          id: row.id,
          proof_url: proofUrl,
          created_at: row.created_at,
          status: statusFromDecision,
          validation: geminiDecision,
          reward,
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      );
    } finally {
      client.release();
      // do not call pool.end() here; let process reuse connections
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "internal server error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

type GeminiDecision = {
  verdict: "valid" | "invalid" | "needs_review" | "unknown";
  confidence?: number;
  reason?: string;
  model?: string;
  raw?: string;
};

type GeminiValidationInput = {
  proofUrl: string;
  taskId?: string;
  taskMeta?: { name?: string | null; desc?: string | null } | null;
  userId: string;
};

type GeminiModelResponse = {
  verdict?: string;
  reason?: string;
  confidence?: number;
};

const GEMINI_IMAGE_MAX_BYTES = 12 * 1024 * 1024;

async function validateProofWithGemini(
  input: GeminiValidationInput,
): Promise<GeminiDecision> {
  const apiKey =
    process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    return {
      verdict: "unknown",
      reason: "gemini api key missing",
    };
  }

  const modelId = process.env.GEMINI_MODEL_ID || "gemini-2.5-flash-lite";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
  const taskDetails = [
    input.taskMeta?.name ? `Task: ${input.taskMeta.name}` : null,
    input.taskMeta?.desc ? `Task description: ${input.taskMeta.desc}` : null,
    input.taskId ? `Task ID: ${input.taskId}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const instructions = [
    "You validate sustainability challenge proofs.",
    'Return strict JSON: { "verdict": "valid|invalid|needs_review", "reason": string, "confidence": number }.',
    "Use needs_review when unsure.",
  ].join(" ");

  const inlineProof = await buildInlineProofPart(input.proofUrl);
  const parts: any[] = [
    {
      text: `${instructions}\n\nUser ID: ${input.userId}\nProof URL: ${input.proofUrl}\n${taskDetails}`,
    },
  ];
  if (inlineProof) {
    parts.push({ inline_data: inlineProof });
  }
  const payload = {
    contents: [
      {
        role: "user",
        parts,
      },
    ],
  };

  const requestBody = JSON.stringify(payload);
  const attemptLimit = 1;
  let lastProblem: string | undefined;

  // retrying shiiiii when gemini screams 429
  for (let attempt = 1; attempt <= attemptLimit; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: requestBody,
      });

      if (response.status === 429 && attempt < attemptLimit) {
        console.log(`gemini rate limited, retrying attempt ${attempt}`);
        lastProblem = `gemini error ${response.status}`;
        await wait(600 * attempt);
        continue;
      }

      if (!response.ok) {
        console.error(response);
        return {
          verdict: "unknown",
          reason: `gemini error ${response.status}`,
          model: modelId,
        };
      }

      const data = await response.json();
      const rawText = (data?.candidates?.[0]?.content?.parts ?? [])
        .map((part: any) => part?.text || "")
        .join("")
        .trim();
      const parsed =
        safeJsonParse<GeminiModelResponse>(rawText) ??
        parseGeminiTextVerdict(rawText);

      if (!parsed) {
        return {
          verdict: "unknown",
          reason: "gemini response not json",
          model: modelId,
          raw: rawText,
        };
      }

      return {
        verdict: normalizeVerdict(parsed.verdict),
        confidence:
          typeof parsed.confidence === "number" ? parsed.confidence : undefined,
        reason: parsed.reason || undefined,
        model: modelId,
        raw: rawText,
      };
    } catch (error: any) {
      lastProblem = error?.message || "gemini request failed";
      console.error(error);
      if (attempt < attemptLimit) {
        await wait(600 * attempt);
        continue;
      }
      return {
        verdict: "unknown",
        reason: lastProblem,
      };
    }
  }

  return {
    verdict: "unknown",
    reason: lastProblem || "gemini request failed",
  };
}

function normalizeVerdict(
  verdict: string | undefined,
): GeminiDecision["verdict"] {
  const lowered = verdict?.toLowerCase() || "";
  if (lowered.includes("valid") || lowered.includes("approve")) {
    return "valid";
  }
  if (lowered.includes("invalid") || lowered.includes("reject")) {
    return "invalid";
  }
  if (lowered.includes("review") || lowered.includes("pending")) {
    return "needs_review";
  }
  return "unknown";
}

function safeJsonParse<T>(payload: string | undefined): T | null {
  if (!payload) {
    return null;
  }
  try {
    return JSON.parse(payload);
  } catch {
    // fallback to braces when gemini sends markdown shiiiii
    const start = payload.indexOf("{");
    const end = payload.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(payload.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

// fallback parser shiiiii when gemini sends plain text
function parseGeminiTextVerdict(
  rawText: string,
): GeminiModelResponse | null {
  if (!rawText?.trim()) {
    return null;
  }
  const cleaned = rawText.trim();
  const verdictHint =
    cleaned.match(/(?:ai kararı|verdict)\s*[:\-]\s*([a-z_\s]+)/i)?.[1];
  const normalizedHint =
    verdictHint && verdictHint.trim()
      ? normalizeVerdict(verdictHint)
      : "unknown";
  const fallbackVerdict = inferVerdictFromFreeText(cleaned);
  let verdict =
    normalizedHint !== "unknown" ? normalizedHint : fallbackVerdict || "unknown";
  if (verdict !== "invalid" && containsStrongNegativeSignals(cleaned)) {
    verdict = "invalid";
  }
  if (verdict === "unknown") {
    return null;
  }
  const confidenceMatch = cleaned.match(
    /(?:güven|confidence)\s*[:\-]\s*(\d+(?:\.\d+)?)/i,
  );
  const percentBased = confidenceMatch?.[0]?.includes("%");
  let confidence: number | undefined;
  if (confidenceMatch) {
    const parsedValue = Number(confidenceMatch[1]);
    if (!Number.isNaN(parsedValue)) {
      const scaled = percentBased
        ? Math.min(parsedValue, 100)
        : parsedValue > 1
          ? parsedValue / 100
          : parsedValue;
      confidence = scaled;
    }
  }
  return {
    verdict,
    confidence,
    reason: cleaned,
  };
}

function inferVerdictFromFreeText(
  text: string,
): GeminiDecision["verdict"] | undefined {
  const lowered = text.toLowerCase();
  if (containsStrongNegativeSignals(lowered)) {
    return "invalid";
  }
  if (/(valid|approve|uygun)/.test(lowered)) {
    return "valid";
  }
  if (/(review|incele|unsure|belirsiz)/.test(lowered)) {
    return "needs_review";
  }
  return undefined;
}

function containsStrongNegativeSignals(text: string): boolean {
  const lowered = text.toLowerCase();
  return [
    "does not",
    "no evidence",
    "not evidence",
    "unrelated",
    "irrelevant",
    "cannot see",
    "missing proof",
    "fails to",
  ].some((phrase) => lowered.includes(phrase));
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractUguuUrl(payload: string): string {
  // this shit first tries json because uguu loves info dumps
  const parsed = safeJsonParse<{ files?: { url?: string }[]; url?: string }>(
    payload,
  );
  if (parsed) {
    const candidate = parsed.files?.[0]?.url || parsed.url || "";
    if (candidate) {
      return candidate;
    }
  }
  // fallback to sniffing the first url because shiiiii
  const urlMatch = payload.match(/https?:\/\/\S+/);
  return urlMatch ? urlMatch[0] : payload.trim();
}

function mapVerdictToStatus(verdict: GeminiDecision["verdict"]): string {
  if (verdict === "valid") return "approved";
  if (verdict === "invalid") return "rejected";
  if (verdict === "needs_review") return "pending_review";
  return "submitted";
}

type RewardPayload = { xp: number; coins: number };

function computeReward(
  taskXp?: number | null,
  status?: string,
): RewardPayload | null {
  if (!taskXp || status !== "approved") {
    return null;
  }
  const coins = Math.max(1, Math.round(taskXp / 10));
  return { xp: taskXp, coins };
}

async function applyReward(
  client: PoolClient,
  userId: string,
  reward: RewardPayload,
) {
  // reward shiiiii only fires when xp exists
  await client.query(
    `
      UPDATE public.profiles
        SET total_xp = total_xp + $1,
            coins = coins + $2
        WHERE user_id = $3
    `,
    [reward.xp, reward.coins, userId],
  );
}

async function buildInlineProofPart(proofUrl: string) {
  // download inline proof shiiiii
  try {
    const res = await fetch(proofUrl);
    if (!res.ok) {
      console.error("proof fetch failed", res.status);
      return null;
    }
    const mimeType =
      res.headers.get("content-type")?.split(";")?.[0]?.trim() ||
      "application/octet-stream";
    const supported =
      mimeType.startsWith("image/") || mimeType === "application/pdf";
    if (!supported) {
      // unsupported mime shit, bail
      return null;
    }
    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength > GEMINI_IMAGE_MAX_BYTES) {
      console.warn("proof too big for gemini inline pass");
      return null;
    }
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return { mime_type: mimeType, data: base64 };
  } catch (error) {
    console.error("inline proof fetch error", error);
    return null;
  }
}
