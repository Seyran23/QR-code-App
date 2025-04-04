"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { AuthState } from "@/types";
import { logoutAction } from "@/actions/auth-actions";

const cookieConfig = {
  maxAge: 60 * 30,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthorized: false,
      user: null,

      setAuth: (user) => {
        set({ isAuthorized: true, user });
        setCookie("auth", JSON.stringify(user), cookieConfig);
      },

      clearAuth: async () => {
        set({ isAuthorized: false, user: null });
        await logoutAction()
        deleteCookie("auth", cookieConfig);
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const cookieValue = getCookie(name) as string | null;
          return cookieValue;
        },
        setItem: (name, value) => {
          setCookie(name, value, cookieConfig);
        },
        removeItem: (name) => {
          deleteCookie(name, cookieConfig);
        },
      })),
    }
  )
);


export const useInitializeAuth = () => {
  const { isAuthorized, user, setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      setInitialized(true); 

      const storedAuth = getCookie("auth");

      if (storedAuth) {
        try {
          const parsedUser = JSON.parse(storedAuth);
          setAuth(parsedUser);
        } catch (error) {
          console.error("Error parsing auth cookie:", error);
        }
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  }, [initialized, setAuth]); 

  return { isLoading, isAuthorized, user };
};


