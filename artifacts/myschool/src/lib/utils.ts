import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeClassName(name?: string | null): string {
  return name?.replace(/^(?:\s*(?:Class|Grade)\s*)+/i, "").trim() || "";
}

export function formatClass(className?: string | null, section?: string | null): string {
  const base = normalizeClassName(className);
  if (!base) return "—";
  return section ? `Class ${base}-${section}` : `Class ${base}`;
}
