"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLang } from "@/components/lang-provider";

type Task = {
  id: string;
  name: string;
  proof_type: string;
  xp: number;
  desc: string;
  active: boolean;
};

type UploadResult = {
  id: string;
  proof_url: string;
  created_at: string;
  status?: string;
  reward?: { xp: number; coins: number } | null;
  validation?: {
    verdict?: string;
    reason?: string;
    confidence?: number;
  } | null;
};

export default function UploadPage() {
  const { t } = useLang();
  const sarpTr = (tr: string, en: string) => t({ tr, en });
  const params = useSearchParams();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskId, setTaskId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);

  useEffect(() => {
    const initial = params?.get("task_id");
    if (initial) setTaskId(initial);
  }, [params]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await fetch("/api/task", { cache: "force-cache" });
        if (!res.ok) throw new Error();
        const json = await res.json();
        setTasks(json);
      } catch {
        setMessage(sarpTr("Görev listesi yüklenemedi.", "Task list could not load."));
      }
    };
    loadTasks();
  }, []);

  const selectedTask = tasks.find((task) => task.id === taskId) || null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setMessage(sarpTr("Lütfen önce fotoğraf çek.", "Please capture a photo first."));
      return;
    }
    setStatus("uploading");
    setMessage("");
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", file);
    if (taskId) {
      formData.append("task_id", taskId);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error || sarpTr("Yükleme başarısız.", "Upload failed."));
      setStatus("success");
      setUploadResult(payload as UploadResult);
      setMessage(sarpTr("Yükleme tamamlandı.", "Upload completed."));
      setFile(null);
      setCapturedUrl(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || sarpTr("Yükleme başarısız.", "Upload failed."));
      setUploadResult(null);
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      return;
    }
    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) {
      setMessage(sarpTr("Kamera hazır değil.", "Camera not ready."));
      return;
    }
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      setMessage(sarpTr("Kayıt oluşturulamadı.", "Could not create capture."));
      return;
    }
    context.drawImage(video, 0, 0, width, height);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setMessage(sarpTr("Fotoğraf kaydedilemedi.", "Photo could not be saved."));
          return;
        }
        if (capturedUrl) {
          URL.revokeObjectURL(capturedUrl);
        }
        const proofFile = new File([blob], `proof-${Date.now()}.jpg`, {
          type: blob.type,
        });
        setFile(proofFile);
        setCapturedUrl(URL.createObjectURL(blob));
      },
      "image/jpeg",
      0.92,
    );
  };

  const handleRetake = () => {
    if (capturedUrl) {
      URL.revokeObjectURL(capturedUrl);
    }
    setCapturedUrl(null);
    setFile(null);
    setMessage("");
  };

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        if (
          typeof navigator === "undefined" ||
          !navigator.mediaDevices?.getUserMedia
        ) {
          setCameraError(sarpTr("Cihaz kameraya erişimi desteklemiyor.", "Device does not support camera access."));
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        activeStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraReady(true);
        setCameraError(null);
      } catch {
        setCameraError(sarpTr("Kameraya erişilemedi, izinleri kontrol et.", "Could not access camera, check permissions."));
      }
    };

    initCamera();

    return () => {
      activeStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    return () => {
      if (capturedUrl) {
        URL.revokeObjectURL(capturedUrl);
      }
    };
  }, [capturedUrl]);

  return (
    <main className="min-h-screen w-full flex flex-col space-y-6 bg-gradient-to-b from-[#041306] via-[#0c2412] to-[#163b25] px-4 py-6 text-emerald-50 sm:px-10 sm:py-10">
      <div className="flex items-center justify-between rounded-2xl border border-emerald-700/30 bg-emerald-900/20 px-4 py-3 shadow-lg shadow-black/50">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="text-emerald-100">
            <Link href="/">{sarpTr("← Ana Sayfa", "← Home")}</Link>
          </Button>
          <span className="text-sm text-emerald-100/80">{sarpTr("Kanıt Yükle", "Upload Proof")}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-100/80">
          <Badge variant="secondary" className="border-emerald-500/40 bg-emerald-500/15 text-emerald-50">
            {sarpTr("Kamera", "Camera")}
          </Badge>
          <Badge variant={cameraReady ? "default" : "outline"} className="border-emerald-500/40 bg-emerald-500/15 text-emerald-50">
            {cameraReady ? sarpTr("Hazır", "Ready") : sarpTr("Bekleniyor", "Waiting")}
          </Badge>
        </div>
      </div>
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold dark:text-white">{sarpTr("Kanıt yükle", "Upload Proof")}</h1>
        <p className="text-sm text-muted-foreground">
          {sarpTr("Görevi seç, kanıtını ekle ve ödülünü al.", "Select a task, add your proof, and receive your reward.")}
        </p>
      </section>
      {selectedTask ? (
        <div className="rounded-3xl border border-emerald-600/40 bg-[#0c2414]/60 p-5 text-sm shadow-inner shadow-black/40">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-300/80">
            {sarpTr("aktif görev", "active task")}
          </p>
          <div className="mt-2 flex flex-col gap-1">
            <span className="text-lg font-semibold">{selectedTask.name}</span>
            <span className="text-xs text-emerald-200/80">
              {selectedTask.desc || sarpTr("Kanıt fotoğrafı yükleyerek tamamla.", "Complete by uploading proof photo.")}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-emerald-200/80">
            <Badge className="border border-lime-300/40 bg-lime-400/10 text-lime-50">
              +{selectedTask.xp} xp
            </Badge>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-emerald-600/40 bg-[#08180d]/80 p-5 text-sm text-emerald-200/70">
          {sarpTr("Bir hata oluştu, lütfen bir görev seçin.", "An error occurred, please select a task.")}
        </div>
      )}

      {uploadResult ? (
        <div className="space-y-3 rounded-3xl border border-emerald-600/40 bg-[#0b1e12]/85 p-5 shadow-lg shadow-black/60">
          <h2 className="text-lg font-semibold dark:text-white">{sarpTr("Son yükleme", "Last upload")}</h2>
          <p className="text-sm text-muted-foreground">
            {sarpTr("Tarih", "Date")}: {new Date(uploadResult.created_at).toLocaleString()}
          </p>
          {uploadResult.status && (
            <Badge
              variant="outline"
              className="border border-emerald-400/50 bg-emerald-400/10 text-emerald-50"
            >
              {humanizeLabel(uploadResult.status) || uploadResult.status}
            </Badge>
          )}
          {uploadResult.reward && (
            <p className="text-sm text-muted-foreground">
              {sarpTr("Ödül", "Reward")}: +{uploadResult.reward.xp} XP, +{uploadResult.reward.coins}{" "}
              Coin
            </p>
          )}
          {uploadResult.validation && (
            <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1">
              <p>
                AI kararı:{" "}
                <span className="font-semibold">
                  {humanizeLabel(uploadResult.validation.verdict) ||
                    uploadResult.validation.verdict ||
                    "Bilinmiyor"}
                </span>
              </p>
              {typeof uploadResult.validation.confidence === "number" && (
                <p className="text-xs text-muted-foreground">
                  {sarpTr("Güven", "Confidence")}: {formatConfidence(uploadResult.validation.confidence)}
                </p>
              )}
              {uploadResult.validation.reason && (
                <p className="text-xs text-muted-foreground">
                  {uploadResult.validation.reason}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-emerald-600/40 bg-[#07140b]/70 p-6 shadow-[0_0_45px_rgba(0,0,0,0.7)] backdrop-blur"
        >
          <div className="space-y-3">
            <label className="text-sm font-medium text-emerald-100">
              {sarpTr("Kanıt Fotoğrafı", "Proof Photo")}
            </label>
            <div className="relative aspect-[1/1] overflow-hidden rounded-2xl border border-emerald-700/40 bg-[#0f2515]">
              {cameraError ? (
                <p className="p-6 text-center text-sm text-rose-200">
                  {cameraError}
                </p>
              ) : capturedUrl ? (
                <img
                  src={capturedUrl}
                  alt="Çekilen kanıt"
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1 rounded-2xl"
                onClick={capturedUrl ? handleRetake : handleCapture}
                disabled={
                  !!cameraError ||
                  status === "uploading" ||
                  (!cameraReady && !capturedUrl)
                }
              >
                {capturedUrl ? sarpTr("Tekrar çek", "Retake") : sarpTr("Fotoğraf çek", "Capture photo")}
              </Button>
              {!capturedUrl && (
                <Button
                  type="button"
                  className="flex-1 rounded-2xl"
                  onClick={handleCapture}
                  disabled={
                    !!cameraError || status === "uploading" || !cameraReady
                  }
                >
                  {sarpTr("Çek ve Onayla", "Capture and Confirm")}
                </Button>
              )}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 py-4 text-lg font-semibold text-zinc-900 shadow-lg shadow-emerald-900/60 transition-transform hover:scale-[1.02]"
            disabled={status === "uploading" || !file}
          >
            {status === "uploading"
              ? sarpTr("Yükleniyor...", "Uploading...")
              : sarpTr("Gönder", "Submit")}
          </Button>
          {message && <p className="text-sm text-amber-200/80">{message}</p>}
        </form>
      )}

      <Separator className="border-emerald-800/60" />
      <p className="text-xs text-emerald-200/70">
        {sarpTr("Kanıtın 3 saat içinde incelenecek ve onaylanacaktır. Herhangi bir sorun yaşarsanız bizle iletişime geç.", "Your proof will be reviewed and approved within 3 hours. Contact us if you have any issues.")}
      </p>
    </main>
  );
}

function cnStatusClass(status: "idle" | "uploading" | "success" | "error") {
  if (status === "success") return "text-sm text-emerald-300";
  if (status === "error") return "text-sm text-rose-300";
  return "text-sm text-emerald-200/70";
}

function humanizeLabel(value?: string | null) {
  if (!value) {
    return "";
  }
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatConfidence(value?: number | null) {
  if (typeof value !== "number") {
    return null;
  }
  const normalized = value > 1 ? Math.min(value, 100) : value * 100;
  return `${Math.round(normalized)}%`;
}
