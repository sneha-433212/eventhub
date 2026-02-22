"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function usePublicGuard() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/attendee/home");
    }
  }, [router]);
}