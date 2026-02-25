"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useClickOutside } from "@/hooks/useOutsideClick";
import { Lang } from "@/lib/lang";

type Copy = { tr: string; en: string };

type PartnerCard = {
  title: Copy;
  description: Copy;
  src: string;
  ctaText: Copy;
  ctaLink: string;
  content: Copy;
};

const partnerData: PartnerCard[] = [
  {
    title: { tr: "İzmir Atatürk Lisesi", en: "Izmir Atatürk High School" },
    description: {
      tr: "Türkiye'nin en köklü okullarından; çevre kulübüyle sahadayız.",
      en: "One of Türkiye's oldest schools; we pilot with their climate club.",
    },
    src: "/images/partners/ial.jpg",
    ctaText: { tr: "Ziyaret et", en: "Visit site" },
    ctaLink: "https://izmirataturklisesi.meb.k12.tr",
    content: {
      tr: "Öğrenciler atık toplama görevlerini yürütüyor, saha veri doğrulaması sağlıyor ve şehir içi pilotlarımız için gönüllü oluyor.",
      en: "Students run waste quests, supply validated field data, and volunteer for our city pilots.",
    },
  },
  {
    title: { tr: "İZSU", en: "IZSU" },
    description: {
      tr: "İzmir'in su ve kanalizasyon idaresi; veri ve altyapı ortağımız.",
      en: "Izmir's water authority; our data and infrastructure partner.",
    },
    src: "/images/partners/izsu.png",
    ctaText: { tr: "Projeyi gör", en: "See project" },
    ctaLink: "https://www.izsu.gov.tr",
    content: {
      tr: "Şebeke noktalarında plastik yoğunluğu haritalaması yapıyor, arıtma istasyonlarında enzim tabanlı testleri birlikte tasarlıyoruz.",
      en: "Helps us map plastic density around the network and co-design enzyme tests at treatment hubs.",
    },
  },
  {
    title: {
      tr: "İzmir Büyükşehir Belediyesi",
      en: "Izmir Metropolitan Municipality",
    },
    description: {
      tr: "Toplu ulaşım ödül entegrasyonu ve saha pilotu planlanıyor.",
      en: "Planned pilots with transit rewards and field deployments.",
    },
    src: "/images/partners/ibb.png",
    ctaText: { tr: "Takip et", en: "Follow" },
    ctaLink: "https://www.izmir.bel.tr",
    content: {
      tr: "Toplanan puanların otobüs ve metro biletlerine dönüşmesi için açık ödeme platformlarıyla çalışıyoruz; Bio-Bin sahası için rota belirleniyor.",
      en: "Coordinating open-pay integrations so in-game points become bus and metro rides; routing a Bio-Bin field site next.",
    },
  },
];

export function PartnersSection({ lang }: { lang: Lang }) {
  const sarpTr = (tr: string, en: string) => (lang === "tr" ? tr : en);
  const [active, setActive] = useState<PartnerCard | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  // @ts-expect-error if it works, it works
  useClickOutside(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-10 h-full w-full bg-black/40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 z-[100] grid place-items-center p-4">
            <motion.button
              key={`button-${active.title.en}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-md lg:hidden"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title.en}-${id}`}
              ref={ref}
              initial={{ opacity: 0.85, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0.85, scale: 0.96, y: 10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex h-full w-full max-w-[520px] flex-col overflow-hidden rounded-3xl bg-white/95 text-neutral-900 shadow-2xl backdrop-blur dark:bg-neutral-900/95 dark:text-neutral-100 md:h-fit md:max-h-[90%]"
            >
              <motion.div layoutId={`image-${active.title.en}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={sarpTr(active.title.tr, active.title.en)}
                  className="h-80 w-full object-cover object-top sm:rounded-tr-lg sm:rounded-tl-lg"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title.en}-${id}`}
                      className="font-bold text-neutral-800 dark:text-neutral-100"
                    >
                      {sarpTr(active.title.tr, active.title.en)}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description.en}-${id}`}
                      className="text-neutral-600 dark:text-neutral-300"
                    >
                      {sarpTr(active.description.tr, active.description.en)}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title.en}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="rounded-full bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow hover:bg-emerald-400"
                  >
                    {sarpTr(active.ctaText.tr, active.ctaText.en)}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-40 flex-col items-start gap-4 overflow-auto pb-10 text-xs text-neutral-700 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] md:h-fit md:text-sm lg:text-base dark:text-neutral-300"
                  >
                    <p>{sarpTr(active.content.tr, active.content.en)}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partnerData.map((card) => (
          <motion.div
            layoutId={`card-${card.title.en}-${id}`}
            key={`card-${card.title.en}-${id}`}
            onClick={() => setActive(card)}
            className="flex cursor-pointer flex-col items-start gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 transition duration-300 ease-out hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/10 hover:shadow-[0_16px_36px_rgba(16,185,129,0.16)]"
          >
            <motion.div layoutId={`image-${card.title.en}-${id}`}>
              <img
                width={100}
                height={100}
                src={card.src}
                alt={sarpTr(card.title.tr, card.title.en)}
                className="h-16 w-16 rounded-lg object-cover object-top shadow"
              />
            </motion.div>
            <div className="space-y-1">
              <motion.h3
                layoutId={`title-${card.title.en}-${id}`}
                className="text-base font-semibold text-white transition-colors duration-200"
              >
                {sarpTr(card.title.tr, card.title.en)}
              </motion.h3>
              <motion.p
                layoutId={`description-${card.description.en}-${id}`}
                className="text-sm text-slate-200/80 transition-colors duration-200"
              >
                {sarpTr(card.description.tr, card.description.en)}
              </motion.p>
            </div>
            <motion.button
              layoutId={`button-${card.title.en}-${id}`}
              className="mt-2 rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-400"
            >
              {sarpTr(card.ctaText.tr, card.ctaText.en)}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

