"use client";

import { User } from "@/types";

import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/user");

        if (res.ok) {
          const userData = await res.json();

          if (userData.id) {
            setUser(userData);
            return;
          }
        }

        setUser(null);
      } catch (error) {
        console.error("Failed to load user: ", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return { user, loading };
}
