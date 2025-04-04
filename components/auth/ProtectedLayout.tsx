"use client";

import { useInitializeAuth } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthorized } = useInitializeAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthorized) {
      router.push("/login"); 
    }
  }, [isAuthorized, router]);

  return isAuthorized ? <>{children}</> : null;
}
