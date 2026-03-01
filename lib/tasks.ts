export type BaseTask = {
  id: string;
  proof_type: string;
  xp: number;
  active: boolean;
  name: { tr: string; en: string };
  desc: { tr: string; en: string };
};

export type LocalizedTask = {
  id: string;
  proof_type: string;
  xp: number;
  active: boolean;
  name: string;
  desc: string;
};

export const baseTasks: BaseTask[] = [
  {
    id: "recycle-plastic",
    name: { tr: "Plastik Geri Dönüşümü", en: "Recycle Plastic" },
    proof_type: "photo",
    xp: 120,
    desc: {
      tr: "Plastik atıklarını geri dönüşüm kutusuna at ve fotoğrafla.",
      en: "Throw your plastic waste into the recycling bin and take a photo.",
    },
    active: true,
  },
  {
    id: "recycle-paper",
    name: { tr: "Kağıt Geri Dönüşümü", en: "Recycle Paper" },
    proof_type: "photo",
    xp: 90,
    desc: {
      tr: "Kağıt atıklarını geri dönüşüm kutusuna bırak.",
      en: "Drop your paper waste into the recycling bin.",
    },
    active: true,
  },
  {
    id: "recycle-glass",
    name: { tr: "Cam Geri Dönüşümü", en: "Recycle Glass" },
    proof_type: "photo",
    xp: 80,
    desc: {
      tr: "Cam şişe veya kavanozu geri dönüşüm kutusuna at.",
      en: "Toss a glass bottle or jar into the recycling bin.",
    },
    active: true,
  },
];

export function localizeTasks(
  tasks: BaseTask[],
  translate: (input: { tr: string; en: string }) => string,
): LocalizedTask[] {
  return tasks.map((task) => ({
    id: task.id,
    proof_type: task.proof_type,
    xp: task.xp,
    active: task.active,
    name: translate(task.name),
    desc: translate(task.desc),
  }));
}

