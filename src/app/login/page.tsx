"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import styles from "./login.module.css";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(username, password);
    setSubmitting(false);
    if (result.ok) {
      router.replace("/");
    } else {
      setError(result.message ?? "Login failed.");
    }
  };

  return (
    <div className={styles.overlay}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>🚚 AdhiSree Transport Service</h1>
        <p className={styles.subtitle}>Sign in to continue</p>

        <label className={styles.label} htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
          required
          autoFocus
        />

        <label className={styles.label} htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" className={styles.submitBtn} disabled={submitting}>
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
