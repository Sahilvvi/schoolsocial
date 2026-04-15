/**
 * localStorage persistence for demo user data.
 * All demo changes are saved to localStorage so they survive page refresh and sign-out/sign-in cycles.
 */

const PREFIX = "demo_data_";

export function getDemoData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setDemoData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export function removeDemoData(key: string): void {
  localStorage.removeItem(PREFIX + key);
}

/** Clear ALL demo data (useful for a full reset) */
export function clearAllDemoData(): void {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}
