"use client";

import { useEffect, useState } from "react";
import { getToken, onAuthChange, clearToken as clearTokenStore } from "@/lib/auth-store";

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setToken(getToken());
    setReady(true);
    return onAuthChange((next) => setToken(next));
  }, []);

  const logout = () => {
    clearTokenStore();
  };

  return { token, ready, logout };
}
