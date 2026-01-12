import { UserProfile, xpToLevel } from "@/app/page";
import { Suspense } from "react";
import Loading from "@/app/loading";
import Image from "next/image";

export interface RequestProfileProps {
  me: UserProfile;
  sad?: boolean;
}
export default function DragonVisuals(props: RequestProfileProps) {
  const { me , sad} = props;

  const stage = 3; // placeholder
  const { head, body, wing, tail } = xpToVisuals(me.total_xp);

  return (
    <div className="overflow-visible h-48 w-48">
      <div className="relative h-48 w-48">
        <Suspense fallback={<Loading />}>
          <Image
            src={!sad ? ("/images/dragons/"+head+".png") : ("/images/dragons/sad1.png")}
            alt="visual"
            fill
            className="absolute inset-0 z-30"
          />
          <Image
            src={"/images/dragons/"+body+".png"}
            alt="visual"
            fill
            className="absolute inset-0 z-10"
          />
          <Image
            src={"/images/dragons/"+wing+".png"}
            alt="visual"
            fill
            className="absolute inset-0 z-20"
          />
          <Image
            src={"/images/dragons/"+tail+".png"}
            alt="visual"
            fill
            className="absolute inset-0 z-20"
          />
        </Suspense>
      </div>
    </div>
  );
}

function xpToVisuals(xp: number): {
  head: string;
  body: string;
  wing: string;
  tail: string;
} {
  /*
   * numbaz
   *
   * head: 4
   * body: 1
   * wing: 4
   * tail: 3
   * * we go from 1-n, not 0-(n-1)
   *
   * weon got big-body visuals numbered yet
   * progress rotation every 5 levels
   * */

  const level = xpToLevel(xp);

  const steps = Math.floor(level / 5);

  // base visuals (we start at 1, not 0)
  let head = 1;
  let wing = 1;
  let tail = 1;
  const body = 1;

  // max caps
  const MAX = {
    head: 4,
    wing: 3,
    tail: 3,
  };

  // rotation order
  const rotation: Array<"head" | "wing" | "tail"> = ["head", "wing", "tail"];

  for (let i = 0; i < steps; i++) {
    const limb = rotation[i % rotation.length];

    if (limb === "head" && head < MAX.head) head++;
    if (limb === "wing" && wing < MAX.wing) wing++;
    if (limb === "tail" && tail < MAX.tail) tail++;
  }

  return {
    head: `head${head}`,
    body: `body${body}`,
    wing: `wing${wing}`,
    tail: `tail${tail}`,
  };
}
