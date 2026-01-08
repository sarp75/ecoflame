import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapClassToLabel(classValue: string) {
  const classObj = classes.find((c) => c.value === classValue);
  return classObj ? classObj.label : classValue;
}
export const classes = [
  { value: "ial-haza", label: "İAL Hazırlık A" },
  { value: "ial-hazb", label: "İAL Hazırlık B" },
  { value: "ial-hazc", label: "İAL Hazırlık C" },
  { value: "ial-hazd", label: "İAL Hazırlık D" },
  { value: "ial-haze", label: "İAL Hazırlık E" },
  { value: "ial-hazf", label: "İAL Hazırlık F" },
  { value: "ial-hazg", label: "İAL Hazırlık G" },
  { value: "ial-hazh", label: "İAL Hazırlık H" },
  { value: "ial-9a", label: "İAL 9A" },
  { value: "ial-9b", label: "İAL 9B" },
  { value: "ial-9c", label: "İAL 9C" },
  { value: "ial-9d", label: "İAL 9D" },
  { value: "ial-9e", label: "İAL 9E" },
  { value: "ial-9f", label: "İAL 9F" },
  { value: "ial-9g", label: "İAL 9G" },
  { value: "ial-9h", label: "İAL 9H" },
  { value: "ial-9i", label: "İAL 9İ" },
  { value: "ial-10a", label: "İAL 10A" },
  { value: "ial-10b", label: "İAL 10B" },
  { value: "ial-10c", label: "İAL 10C" },
  { value: "ial-10d", label: "İAL 10D" },
  { value: "ial-10e", label: "İAL 10E" },
  { value: "ial-10f", label: "İAL 10F" },
  { value: "ial-10g", label: "İAL 10G" },
  { value: "ial-11a", label: "İAL 11A" },
  { value: "ial-11b", label: "İAL 11B" },
  { value: "ial-11c", label: "İAL 11C" },
  { value: "ial-11d", label: "İAL 11D" },
  { value: "ial-11e", label: "İAL 11E" },
  { value: "ial-11f", label: "İAL 11F" },
  { value: "ial-11g", label: "İAL 11G" },
  { value: "ial-11h", label: "İAL 11H" },
  { value: "ial-11i", label: "İAL 11İ" },
  { value: "ial-11j", label: "İAL 11J" },
  { value: "ial-11k", label: "İAL 11K" },
];
