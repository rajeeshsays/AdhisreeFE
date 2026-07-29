"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthUser } from "@/app/types/types";
import { login as loginApi } from "@/app/services/authService";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export const STORAGE_KEY = "authUser";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: AuthUser = JSON.parse(stored);
        if (new Date(parsed.expiresAt) > new Date()) {
          setUser(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await loginApi(username, password);
      if (!res.ok) {
        const message = res.status === 401 ? "Invalid username or password." : "Login failed. Please try again.";
        return { ok: false, message };
      }
      const data = await res.json();
      const authUser: AuthUser = {
        username: data.username,
        role: data.role,
        token: data.token,
        expiresAt: data.expiresAt,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return { ok: true };
    } catch (error) {
      console.error(error);
      return { ok: false, message: "Unable to reach the server." };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
