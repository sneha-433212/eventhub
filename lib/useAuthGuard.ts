"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser } from "./auth";

export function useAuthGuard(requiredRole?: "attendee" | "organizer") {
  const router = useRouter();

  useEffect(() => {
    const user = getAuthUser();

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.replace("/");
    }
  }, [router, requiredRole]);
}