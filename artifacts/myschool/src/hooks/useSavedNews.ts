import { useState, useEffect } from "react";

const KEY = "myschool_saved_news";

function getIds(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || "[]")); }
  catch { return new Set(); }
}

function saveIds(ids: Set<string>) {
  localStorage.setItem(KEY, JSON.stringify([...ids]));
}

export function useSavedNews() {
  const [savedIds, setSavedIds] = useState<Set<string>>(getIds);

  useEffect(() => { saveIds(savedIds); }, [savedIds]);

  const toggle = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return { savedIds, toggle };
}
