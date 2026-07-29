"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import styles from "./authGate.module.css";

const PUBLIC_PATHS = ["/login"];

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (loading) return;
    if (!user && !isPublicPath) {
      router.replace("/login");
    }
  }, [user, loading, isPublicPath, router]);

  if (loading) return null;
  if (!user && !isPublicPath) return null;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <>
      {user && !isPublicPath && (
        <div className={styles.topbar}>
          <span className={styles.userInfo}>
            {user.username} ({user.role})
          </span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
      {children}
    </>
  );
}
