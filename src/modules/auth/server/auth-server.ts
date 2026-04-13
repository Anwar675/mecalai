// lib/services/auth.service.ts

import { authClient } from "@/lib/auth-client";

export const authService = {
  login: (email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      authClient.signIn.email(
        { email, password },
        {
          onSuccess: () => resolve(), 
          onError: (err) => reject(err),
        },
      );
    });
  },

  register: (name: string, email: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      authClient.signUp.email(
        { name, email, password },
        {
          onSuccess: () => resolve(),
          onError: (err) => reject(err),
        },
      );
    });
  },

  social: (provider: "github" | "google") => {
    return authClient.signIn.social({ provider, callbackURL: "/" }, );
  },
};
