"use client";

import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
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

const team = [
  {
    name: "Can Doe",
    role: "Lead Chemistry",
    image: "/images/dragons/head2.png",
  },
  { name: "Sarp Pamuk", role: "Lead Developer", image: "/images/i-32.png" },
  { name: "Nisa Doe", role: "Lead Artist", image: "/images/i-14.png" },
];

const partners = [
  { name: "Okulunuz", image: "/images/i-22.png" },
  { name: "Belediye Adayı", image: "/images/i-23.png" },
  { name: "Open for Partnership", image: "/images/i-3.png" },
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
  const [counts, setCounts] = React.useState<Record<StatKey, number>>({
    pilots: 0,
    accuracy: 0,
    breakdown: 0,
  });
  const [lang, setLang] = useState<Lang>("en");

  React.useEffect(() => {
    const targets: Record<StatKey, number> = {
      pilots: 20,
      accuracy: 92,
      breakdown: 90,
    };

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1400, 1);
      setCounts({
        pilots: Math.round(targets.pilots * progress),
        accuracy: Math.round(targets.accuracy * progress),
        breakdown: Math.round(targets.breakdown * progress),
      });
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

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
        <div
          className="absolute top-15 right-15 text-3xl z-50 select-none hover:scale-110 transition cursor-pointer"
          onClick={() => changeLang(lang === "tr" ? "en" : "tr")}
        >
          {lang === "tr" ? "🇹🇷" : "🇬🇧"}
        </div>
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 opacity-80">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-slate-950 to-sky-900" />
            <div className="absolute inset-0 [background-image:linear-gradient(rgba(16,185,129,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.14)_1px,transparent_1px)] [background-size:18px_18px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent" />
            <div className="relative mx-auto flex h-full max-w-3xl items-center justify-center">
              <div className="overflow-visible -rotate-90 h-48 w-48">
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
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-900 via-slate-950 to-emerald-900" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(52,211,153,0.3),transparent_35%)] blur-3xl" />
            <div className="absolute inset-0 [background-image:linear-gradient(rgba(56,189,248,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.2)_1px,transparent_1px)] [background-size:22px_22px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent" />
            <div className="relative mx-auto flex h-full max-w-3xl items-center justify-center">
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
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-8 px-6 py-20 text-center">
          <Badge
            variant="secondary"
            className="bg-white/10 text-white backdrop-blur"
          >
            {sarpTr("Bölüm 1: Giriş Ekranı", "Section 1: Intro")}
          </Badge>
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/80">
              ECOFLAME
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
              className="bg-emerald-500 hover:bg-emerald-400"
            >
              <Link
                href="https://youtu.be/dQw4w9WgXcQ"
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
              className="bg-white/10 text-white hover:bg-white/20"
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
              <Badge
                variant="secondary"
                className="bg-emerald-500/15 text-emerald-200"
              >
                {sarpTr("Döngü", "THE LOOP")}
              </Badge>
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
            <Card className="border border-emerald-500/30 bg-emerald-500/5">
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
                    <p className="text-base font-semibold">Eco-Guardians</p>
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
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-emerald-400/80 bg-emerald-500/10 shadow-[0_0_60px_rgba(52,211,153,0.35)] animate-[spin_14s_linear_infinite]" />
              <div className="absolute h-40 w-40 rounded-full bg-slate-950/70 backdrop-blur flex items-center justify-center text-emerald-200 font-semibold">
                {sarpTr("Döngü", "THE LOOP")}
              </div>
            </div>

            <Card className="border border-sky-400/30 bg-sky-500/5">
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
                    <p className="text-base font-semibold">Bio-Reactör</p>
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
            <Badge
              variant="secondary"
              className="mx-auto bg-white/10 text-white"
            >
              {sarpTr("UYGULAMA VİTRİNİ", "APP SHOWCASE")}
            </Badge>
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
            <Card className="overflow-hidden border-emerald-500/20 bg-slate-950">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/images/i-42.png"
                  alt="app screen"
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
            <div className="grid content-center gap-6">
              <h3 className="text-2xl font-semibold">Eco-Guardians</h3>
              <div className="grid gap-4">
                {features.map((item) => (
                  <Card
                    key={item.title.en}
                    className="border border-white/5 bg-white/5"
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
                  <Link href="/install">
                    {sarpTr("Uygulamayı İndir", "Install App")}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  <Link href="/auth/sign-up">
                    {sarpTr("Erken Erişim", "Early Access")}
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
            <Badge
              variant="secondary"
              className="mx-auto bg-emerald-100 text-emerald-700"
            >
              {sarpTr("BİLİM", "THE SCIENCE")}
            </Badge>
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
            <Card className="bg-white">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/i-112.png"
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
                <Button asChild className="bg-emerald-600 hover:bg-emerald-500">
                  <Link href="/science.pdf" target="_blank" rel="noreferrer">
                    {sarpTr(
                      "Bilimsel Raporu İncele (PDF)",
                      "View Scientific Report (PDF)",
                    )}
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/contact">
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
            <Badge
              variant="secondary"
              className="mx-auto bg-white/10 text-white"
            >
              {sarpTr("ETKİ VE YOL HARİTASI", "IMPACT & ROADMAP")}
            </Badge>
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
                  className="flex flex-col items-center justify-center rounded-xl bg-slate-950/60 p-4 shadow-inner"
                >
                  <p className="text-4xl font-bold text-emerald-300">
                    {counts[stat.key]}
                    {stat.suffix}
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-wide text-slate-200/80">
                    {sarpTr(stat.label.tr, stat.label.en)}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
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
            <Badge
              variant="secondary"
              className="mx-auto bg-white/10 text-white"
            >
              {sarpTr("EKİP VE PARTNERLER", "TEAM & PARTNERS")}
            </Badge>
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

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                {sarpTr("Ekip", "Team")}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {team.map((member) => (
                  <Card
                    key={member.name}
                    className="border border-white/10 bg-white/5"
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="relative h-14 w-14 overflow-hidden rounded-full bg-emerald-500/20">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-sm text-slate-200/80">
                          {member.role}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                {sarpTr("Partnerler", "Partners")}
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {partners.map((partner) => (
                  <Card
                    key={partner.name}
                    className="border border-white/10 bg-white/5"
                  >
                    <CardContent className="flex h-28 items-center justify-center p-4">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="relative h-14 w-14 overflow-hidden rounded-full bg-slate-800">
                          <Image
                            src={partner.image}
                            alt={partner.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className="text-xs text-slate-200/80">
                          {partner.name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-500">
                <Link href="/contact">
                  {sarpTr("Bizimle Ortak Ol", "Partner with Us")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
  function sarpTr(tr: string, en: string): string {
    // translation stub shiiiii
    if (lang === "tr") return tr;
    return en;
  }
}
