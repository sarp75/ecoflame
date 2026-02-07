"use client"
import { Button } from "@/components/ui/button";
import React from "react";

export default function ShowcasePage() {
  const [randText, setRandText] = React.useState("texty");
  // generate new random text every second
  React.useEffect(() => {
    const generateString = (length = 1000) => {
      let result = '';
      while (result.length < length) {
        result += Math.random().toString(36).slice(2);
      }
      return result.slice(0, length);
    };

    const interval = setInterval(() => {
      setRandText(generateString(100000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="h-screen text-center flex flex-col justify-center items-center">
        <p className="absolute h-screen w-screen inset-0 font-mono wrap-anywhere -z-50 text-muted">
          {randText}
        </p>
        <h1 className="text-7xl font-bold">ECOFLAME</h1>
        <h2 className="text-2xl mt-4">
          {sarpTr(
            "Gamified Collection. Enzymatic Destruction.",
            "Oyunla Topluyoruz. Bilimle Yok Ediyoruz.",
          )}
        </h2>
        <div className="mt-4 flex gap-4">
          <Button className="h-10 bg-zinc-800 text-white hover:scale-105 transition ">
            {sarpTr("Watch us", "Projeyi İzle")}
          </Button>
          <Button className="h-10 bg-zinc-800 text-white hover:scale-105 transition ">
            {sarpTr("Play the game", "Oyunu oyna")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function sarpTr(english: string, turkish: string): string {
  // stub
  return english;
}
