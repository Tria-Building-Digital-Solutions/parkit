import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const INPUT_CLASSES =
  "w-full rounded-xl border border-border-color/60 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 transition-all duration-200 focus:border-company-primary focus:outline-none focus:ring-1 focus:ring-company-primary/20";

export const BUTTON_CLASSES =
  "w-full rounded-full bg-company-primary py-2.5 text-sm font-medium text-white shadow-sm hover:brightness-110 focus:outline-none focus:ring-1 focus:ring-company-primary focus:ring-offset-2 transition-all";

export const LABEL_CLASSES = "block text-sm font-medium text-text-primary mb-1.5";
