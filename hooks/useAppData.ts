"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppData } from "@/lib/types";
import { getData } from "@/lib/store";

export function useAppData() {
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    setData(getData());
  }, []);

  const refresh = useCallback(() => {
    setData(getData());
  }, []);

  const update = useCallback((next: AppData) => {
    setData(next);
  }, []);

  return { data, refresh, update, ready: data !== null };
}
