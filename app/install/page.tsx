"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [status, setStatus] = useState<
    "idle" | "prompted" | "accepted" | "dismissed"
  >("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handlePrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setMessage("hazırsın, aşağıdaki butonla ana ekrana ekle");
    };
    // @ts-expect-error nigga
    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () =>
      // @ts-expect-error nigga
      window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  const triggerInstall = useCallback(async () => {
    if (!deferredPrompt) {
      setMessage("destekleyen bir tarayıcıda deneyip yeniden gel shit");
      return;
    }
    setStatus("prompted");
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (choice.outcome === "accepted") {
      setStatus("accepted");
      setMessage("kurulum kabul edildi, ana ekrana bak");
    } else {
      setStatus("dismissed");
      setMessage("kurulumu reddettin, istediğinde tekrar tıklayabilirsin");
    }
  }, [deferredPrompt]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b  from-emerald-500 to-emerald-600 px-4 py-10 text-emerald-50">
      <div className="w-full max-w-sm space-y-4 rounded-3xl border border-emerald-600/40 bg-[#081c10]/85 p-6 text-center shadow-[0_0_45px_rgba(5,30,15,0.7)] backdrop-blur">
        <h1 className="text-2xl font-semibold text-white">Ecoflame Kurulum</h1>
        <p className="text-sm text-emerald-200/80">
          Uygulamayı indir
        </p>
        <Button
          onClick={triggerInstall}
          disabled={!deferredPrompt}
          className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 py-4 text-lg font-semibold text-zinc-900 shadow-lg shadow-emerald-900/60 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deferredPrompt ? "ana ekrana ekle" : "tarayıcı sinyali bekleniyor"}
        </Button>
        {message && <p className="text-sm text-emerald-200/80">{message}</p>}
        {status === "accepted" && (
          <div className="rounded-2xl border border-lime-400/50 bg-lime-400/10 px-4 py-3 text-sm text-lime-50">
            tamamlandığında ana ekranda ikon tufanı göreceksin
          </div>
        )}
        {status === "dismissed" && (
          <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            yanlışlıkla kapattıysan butona tekrar bas yeter
          </div>
        )}
      </div>
    </main>
  );
}
