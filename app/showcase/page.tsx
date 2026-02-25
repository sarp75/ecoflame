"use client";

import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loading from "@/app/loading";
import { initLangCookie, Lang, setLangCookie } from "@/lib/lang";
import { CometCard } from "@/components/ui/comet-card";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { NumberTicker } from "@/components/ui/number-ticker";
import { PartnersSection } from "@/components/ui/partners";
import { useSearchParams } from "next/navigation";

let georgeMode = false;

type Copy = { tr: string; en: string };

const features = [
  {
    icon: "🤖",
    title: { tr: "AI Doğrulama", en: "AI Verification" },
    text: {
      tr: "Hile yok, sadece gerçek etki.",
      en: "No cheats, only real impact.",
    },
  },
  {
    icon: "🐉",
    title: { tr: "Adaptif Avatar", en: "Adaptive Avatar" },
    text: { tr: "Ne yaparsan O'sun.", en: "What you do, you become." },
  },
  {
    icon: "🏆",
    title: { tr: "Belediye Ödülleri", en: "City Rewards" },
    text: {
      tr: "Puanlarını otobüs biletine dönüştür.",
      en: "Turn points into transit tickets.",
    },
  },
];

const roadmap = [
  {
    label: { tr: "Q1 2025", en: "Q1 2025" },
    detail: {
      tr: "MVP Yayını (Buradasınız).",
      en: "MVP launch (you are here).",
    },
  },
  {
    label: { tr: "Q3 2025", en: "Q3 2025" },
    detail: { tr: "Belediye Entegrasyonu.", en: "Municipality integration." },
  },
  {
    label: { tr: "2026", en: "2026" },
    detail: { tr: "Bio-Bin Pilot Tesisi.", en: "Bio-Bin pilot facility." },
  },
];

type StatKey = "pilots" | "accuracy" | "breakdown";

type Stat = {
  key: StatKey;
  label: Copy;
  suffix?: string;
  target: number;
};

const stats: Stat[] = [
  {
    key: "pilots",
    label: { tr: "Pilot Kullanıcı", en: "Pilot Users" },
    target: 20,
    suffix: "+",
  },
  {
    key: "accuracy",
    label: { tr: "AI Doğruluğu", en: "AI Accuracy" },
    target: 96,
    suffix: "%",
  },
  {
    key: "breakdown",
    label: { tr: "Plastik Ayrışımı", en: "Plastic Breakdown" },
    target: 90,
    suffix: "%",
  },
];

export default function ShowcasePage() {
  const [lang, setLang] = useState<Lang>("en");
  const params = useSearchParams();
  georgeMode = params.get("george") === "true";
  const team = [
    {
      name: "Can Hoşkal",
      role: { tr: "Lider Bilimci", en: "Lead Scientist" },
      image: georgeMode ? "/images/george.jpg" : "/images/can.jpg",
    },
    {
      name: "Sarp Pamuk",
      role: { tr: "Lider Geliştirici", en: "Lead Developer" },
      image: georgeMode ? "/images/george.jpg" : "/images/sarp.jpg",
    },
    {
      name: "Nisa Nur Güneş",
      role: { tr: "Lider Sanatçı", en: "Lead Artist" },
      image: georgeMode ? "/images/george.jpg" : "/images/nisa.jpg",
    },
  ];
  useEffect(() => {
    const current = initLangCookie();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLang(current);
  }, []);

  function changeLang(newLang: Lang) {
    setLangCookie(newLang);
    setLang(newLang);
  }

  return (
    <div className="bg-slate-950 text-white">
      <section className="relative isolate min-h-screen overflow-hidden">
        <BackgroundRippleEffect cellSize={64} fixed={false} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/30 to-slate-950" />
        <button
          onClick={() => changeLang(lang === "tr" ? "en" : "tr")}
          className="fixed top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md text-2xl shadow-lg shadow-black/30 transition-all duration-200 hover:scale-110 hover:bg-zinc-700 active:scale-95 select-none z-50"
        >
          {lang === "tr" ? "🇹🇷" : "🇬🇧"}
        </button>

        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 opacity-90 pointer-events-none">
          <div className="relative flex items-center justify-center">
            <div className="relative h-48 w-48 -rotate-90">
              <div className="absolute -left-24 -top-24 h-96 w-96">
                <Suspense fallback={<Loading />}>
                  <Image
                    src={"/images/dragons/" + 1 + ".png"}
                    alt="visual"
                    fill
                    className="absolute inset-0 z-30"
                  />
                  <Image
                    src={"/images/dragons/" + 1 + ".png"}
                    alt="visual"
                    fill
                    className="absolute inset-0 z-10"
                  />
                  <Image
                    src={"/images/dragons/" + 1 + ".png"}
                    alt="visual"
                    fill
                    className="absolute inset-0 z-20"
                  />
                  <Image
                    src={"/images/dragons/" + 1 + ".png"}
                    alt="visual"
                    fill
                    className="absolute inset-0 z-20"
                  />
                </Suspense>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <Image
              src="/images/green-thing.png"
              alt="enzyme art"
              width={420}
              height={420}
              className="mix-blend-screen drop-shadow-[0_25px_55px_rgba(56,189,248,0.4)]"
              priority
            />
          </div>
        </div>

        <div className="relative pointer-events-none mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-8 px-6 py-20 text-center">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/80">
              ECHO-FLAME
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
              {sarpTr("Oyunla Topluyoruz.", "Gamified Collection.")}
              <br />
              {sarpTr("Bilimle Yok Ediyoruz.", "Enzymatic Destruction.")}
            </h1>
            <p className="mx-auto max-w-2xl text-base text-slate-200/80 sm:text-lg">
              {sarpTr(
                "İki ekosistem, tek döngü: oyuncular atığı toplar, enzimler yok eder.",
                "Two engines, one loop: players collect the waste, enzymes erase it.",
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-emerald-500 pointer-events-auto hover:bg-emerald-400 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(16,185,129,0.35)]"
            >
              <Link
                href="https://youtu.be/5YQTDYE_5f4"
                target="_blank"
                rel="noreferrer"
              >
                {sarpTr("Projeyi İzle 🎥", "Watch the Project 🎥")}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white/10 text-white pointer-events-auto hover:bg-white/20 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(255,255,255,0.18)]"
            >
              <Link href="/savas">
                {sarpTr("Oyunu Oyna 📱", "Play the Game 📱")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-slate-950 to-slate-900 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl space-y-10 px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                {sarpTr("Döngüsel Çözüm", "The Loop")}
              </h2>
              <p className="mt-2 max-w-3xl text-slate-200/80">
                {sarpTr(
                  "Eco-Guardians oyunu atığı kaynağında yakalar; enzim reaktörü plastik polimerleri monomerlere indirger.",
                  "The game captures waste at the source; the enzyme reactor cracks polymers down to monomers.",
                )}
              </p>
            </div>
            <div className="hidden text-sm font-medium text-emerald-200 lg:block">
              ♻︎
            </div>
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_auto_1.1fr]">
            <Card className="border border-emerald-500/30 bg-emerald-500/5 transition duration-200 hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-[0_18px_40px_rgba(16,185,129,0.2)]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-emerald-200">
                  {sarpTr("Faz 1: Toplama", "Phase 1: Collection")}
                </CardTitle>
                <CardDescription className="text-slate-200/80">
                  {sarpTr(
                    "Yapay zekalı oyun atığı kaynağında toplar.",
                    "An AI-powered game collects waste at the source.",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center gap-3 rounded-xl bg-slate-900/60 p-4">
                  <Image
                    src="/images/i-15.png"
                    alt="phone"
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                  <div>
                    <p className="text-base font-semibold">
                      {sarpTr("Eco-Guardians", "Eco-Guardians")}
                    </p>
                    <p className="text-sm text-slate-300/80">
                      {sarpTr(
                        "Oyun içi kanıt, gerçek dünya atıkları.",
                        "In-game proof, real-world waste.",
                      )}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-slate-900/50 p-4">
                  <p className="font-semibold text-emerald-200">
                    {sarpTr("Kanıt", "Proof")}
                  </p>
                  <p className="text-sm text-slate-200/80">
                    {sarpTr(
                      "Fatura, fotoğraf, konum verisi; yapay zeka doğrular.",
                      "Receipts, photos, location; AI verifies it all.",
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="relative flex h-full w-full items-center justify-center">
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-emerald-400/80 bg-emerald-500/10 shadow-[0_0_60px_rgba(52,211,153,0.35)] animate-[spin_14s_linear_infinite] hover:animate-[spin_9s_linear_infinite]" />
              <div className="absolute h-40 w-40 rounded-full bg-slate-950/70 backdrop-blur flex items-center justify-center text-emerald-200 font-semibold">
                {sarpTr("Döngü", "THE LOOP")}
              </div>
            </div>

            <Card className="border border-sky-400/30 bg-sky-500/5 transition duration-200 hover:-translate-y-1 hover:border-sky-300/60 hover:shadow-[0_18px_40px_rgba(56,189,248,0.18)]">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-sky-200">
                  {sarpTr("Faz 2: İmha", "Phase 2: Destruction")}
                </CardTitle>
                <CardDescription className="text-slate-200/80">
                  {sarpTr(
                    "Biyobozunma bazlı sistemimiz yüksek verimle, çevreyi incitmeden geri dönüşüm sağlar.",
                    "Our biodegradation-driven system recycles with high efficiency and zero harm.",
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center gap-3 rounded-xl bg-slate-900/60 p-4">
                  <Image
                    src="/images/i-17.png"
                    alt="reactor"
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                  <div>
                    <p className="text-base font-semibold">
                      {sarpTr("Bio-Reactör", "Bio-Reactor")}
                    </p>
                    <p className="text-sm text-slate-300/80">
                      {sarpTr(
                        "Termofilik enzim tankı, düşük enerji profili.",
                        "Thermophilic enzyme tank with a low energy profile.",
                      )}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-sky-400/30 bg-slate-900/50 p-4">
                  <p className="font-semibold text-sky-200">
                    {sarpTr("Dönüşüm", "Conversion")}
                  </p>
                  <p className="text-sm text-slate-200/80">
                    {sarpTr(
                      "PET → monomer; tedarik zinciri geri dönüşüme hazır.",
                      "PET → monomer; supply chain ready for reuse.",
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl space-y-12 px-6">
          <div className="flex flex-col gap-3 text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              {sarpTr(
                "Hareketsizliği harekete çevir.",
                "Turn inaction into action.",
              )}
            </h2>
            <p className="mx-auto max-w-3xl text-slate-200/80">
              {sarpTr(
                "Atık toplama oyunlaştırılıyor: her görev, gerçek dünya etkisi ile ödüllenir.",
                "Waste collection becomes play: every quest pays back with real-world impact.",
              )}
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <Card className="overflow-visible border-emerald-500/20 bg-slate-950 transition duration-200 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-[0_16px_36px_rgba(16,185,129,0.2)]">
              <CardContent className="relative aspect-[3/4] h-full w-full">
                <Image
                  src="/images/ss.png"
                  alt="app screen"
                  fill
                  className="h-full w-full object-cover"
                />
              </CardContent>
            </Card>
            <div className="grid content-center gap-6">
              <h3 className="text-2xl font-semibold">
                {sarpTr("Eco-Guardians", "Eco-Guardians")}
              </h3>
              <div className="grid gap-4">
                {features.map((item) => (
                  <Card
                    key={item.title.en}
                    className="border border-white/5 bg-white/5 transition duration-200 hover:-translate-y-1 hover:border-white/15 hover:bg-white/10"
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="text-2xl">{item.icon}</div>
                      <div>
                        <p className="font-semibold">
                          {sarpTr(item.title.tr, item.title.en)}
                        </p>
                        <p className="text-sm text-slate-200/80">
                          {sarpTr(item.text.tr, item.text.en)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/">
                    {sarpTr("Uygulamayı İndir", "Early Access")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 text-slate-900 sm:py-24">
        <div className="mx-auto max-w-6xl space-y-12 px-6">
          <div className="text-center">
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              {sarpTr(
                "Doğanın Gücü, Mühendisliğin Hassasiyeti.",
                "The Power of Nature, the Precision of Engineering.",
              )}
            </h2>
            <p className="mt-3 max-w-3xl mx-auto text-slate-600">
              {sarpTr(
                "Termofilik rekombinant esterase enzimimiz PET plastiği monomerlere parçalar; kuantum modelleme ile optimize edildi.",
                "Our thermophilic recombinant esterase enzyme breaks down PET plastic into monomers, optimized via quantum modeling.",
              )}
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <Card className="bg-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/somethingreallyscientific.png"
                  alt="enzyme 3d"
                  fill
                  className="object-contain"
                />
              </div>
            </Card>
            <div className="grid gap-4 content-center">
              <p className="text-lg text-slate-700">
                {sarpTr(
                  "Isıya dayanıklı enzimimiz PET zincirlerini hedef alıyor, düşük enerji ile yüksek verim sağlıyor.",
                  "A thermostable esterase targets PET chains, maximizing efficiency while staying gentle on the grid.",
                )}
              </p>
              <ul className="grid gap-3 text-slate-700">
                <li>
                  {sarpTr(
                    "• Kuantum destekli mutasyon taraması",
                    "• Quantum-guided mutation scanning",
                  )}
                </li>
                <li>
                  {sarpTr(
                    "• LCA ile doğrulanmış düşük karbon ayak izi",
                    "• LCA-verified low carbon footprint",
                  )}
                </li>
                <li>
                  {sarpTr(
                    "• Modüler reaktör, sahaya taşınabilir",
                    "• Modular reactor, field-ready",
                  )}
                </li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  className="bg-emerald-600 hover:bg-emerald-500 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(16,185,129,0.2)]"
                >
                  <Link href="/science.pdf" target="_blank" rel="noreferrer">
                    {sarpTr(
                      "Bilimsel Raporu İncele (PDF)",
                      "View Scientific Report (PDF)",
                    )}
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="mailto:canhoskal@gmail.com">
                    {sarpTr("Demo Talep Et", "Request a Demo")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl space-y-10 px-6">
          <div className="flex flex-col gap-3 text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              {sarpTr("Etkimiz ve Yol Haritası", "Impact & Roadmap")}
            </h2>
            <p className="mx-auto max-w-3xl text-slate-200/80">
              {sarpTr(
                "Erken pilotlarla sahadayız; doğruluk ve ayrıştırma oranları büyüyor.",
                "Early pilots are in motion; accuracy and breakdown rates keep climbing.",
              )}
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 sm:grid-cols-3 sm:gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.key}
                  className="flex flex-col items-center justify-center rounded-xl bg-slate-950/60 p-4 shadow-inner transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(0,0,0,0.32)]"
                >
                  <p className="text-4xl font-bold text-emerald-300">
                    <NumberTicker value={stat.target} />
                    {stat.suffix}
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-wide text-slate-200/80">
                    {sarpTr(stat.label.tr, stat.label.en)}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(0,0,0,0.26)]">
              <h3 className="text-xl font-semibold">
                {sarpTr("Yol Haritası", "Roadmap")}
              </h3>
              <div className="mt-6 space-y-6">
                {roadmap.map((item, idx) => (
                  <div key={item.label.en} className="relative pl-8">
                    <div className="absolute left-0 top-1 h-3 w-3 rounded-full bg-emerald-400" />
                    {idx < roadmap.length - 1 && (
                      <div className="absolute left-[5px] top-4 h-full w-px bg-emerald-400/50" />
                    )}
                    <p className="text-sm font-semibold text-emerald-200">
                      {sarpTr(item.label.tr, item.label.en)}
                    </p>
                    <p className="text-slate-200/80">
                      {sarpTr(item.detail.tr, item.detail.en)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl space-y-10 px-6">
          <div className="flex flex-col gap-3 text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              {sarpTr("Beraber Büyüyoruz", "Team & Partners")}
            </h2>
            <p className="mx-auto max-w-3xl text-slate-200/80">
              {sarpTr(
                "Bilim, yazılım ve sahadaki paydaşlar bir arada; ortaklığa açığız.",
                "Science, software, and city partners together; partnerships welcome.",
              )}
            </p>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex justify-center gap-4 overflow-x-auto p-4 overflow-visible overscroll-y-none">
                {team.map((member) => (
                  <CometCard key={member.name}>
                    <div
                      className="my-4 flex w-72 flex-col rounded-[16px] border border-white/10 bg-[#1F2121] p-3 text-white"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[12px] bg-black/40">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          sizes="(min-width: 1024px) 18rem, 14rem"
                          className="absolute inset-0 h-full w-full object-cover contrast-90"
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-wide text-emerald-100">
                        <span>{member.name}</span>
                        <span className="text-gray-300 opacity-70">
                          {sarpTr(member.role.tr, member.role.en)}
                        </span>
                      </div>
                    </div>
                  </CometCard>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                {sarpTr("Partnerler", "Partners")}
              </h3>
              <PartnersSection lang={lang} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
  function sarpTr(tr: string, en: string): string {
    if (lang === "tr") return tr;
    return en;
  }
}
