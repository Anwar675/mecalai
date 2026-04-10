
"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { authService } from "@/modules/auth/server/auth-server";
import { useRouter } from "next/navigation";
import { useState } from "react";


export const useAuth = () => {
  const [isPending, setIsPending] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      setIsPending(true);
      await authService.login(email, password);
    } finally {
      setIsPending(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsPending(true);
      await authService.register(name, email, password);
    } finally {
      setIsPending(false);
    }
  };

  const social = (provider: "github" | "google") => {
    authService.social(provider);
  };

  return { isPending, login, register, social };
};

export const ButtonAuth = () => {
    const router = useRouter()
    return (
        <Button onClick={() => authClient.signOut({fetchOptions: {
            onSuccess: () => {
                router.push("/sign-in")
            }
        }})} >
            Sign Out
        </Button>
    )
}