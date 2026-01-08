"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
<motion.div
  animate={{ rotate: [0, 360] }}
  transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatType: "loop" }}
>
  <Image
    src="/images/green-thing.png"
    width={100}
    height={100}
    alt="who cares anyway, wait the judges do, this is the loading green icon thingy idk either"
  />
</motion.div>
    </div>
  );
}
