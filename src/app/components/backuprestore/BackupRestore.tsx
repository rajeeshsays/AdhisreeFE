"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import styles from "../../css/list.module.css";
import button from "../../css/button.module.css";
import ownStyles from "./backupRestore.module.css";
import { useAuth } from "@/app/context/AuthContext";
import { downloadBackup, restoreBackup } from "@/app/services/backupService";

function formatDateTime(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export default function BackupRestore() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const canAccess = user?.role === "Admin" || user?.role === "Manager";

  if (!canAccess) {
    return (
      <div className={styles.page}>
        <div className={ownStyles.denied}>You must be an Admin or Manager to view this page.</div>
      </div>
    );
  }

  const handleBackup = async () => {
    setMessage(null);
    setBackingUp(true);
    try {
      const res = await downloadBackup();
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setMessage({ type: "error", text: text || "Backup failed." });
        return;
      }

      const blob = await res.blob();
      const disposition = res.headers.get("content-disposition");
      const match = disposition?.match(/filename="?([^"]+)"?/);
      const fileName = match?.[1] ?? `adhisreebakup${formatDateTime(new Date())}.sql`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage({ type: "success", text: `Backup downloaded: ${fileName}` });
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Unable to reach the server." });
    } finally {
      setBackingUp(false);
    }
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const confirmed = window.confirm(
      `This will overwrite all current data with the contents of "${file.name}". This cannot be undone. Continue?`
    );
    if (!confirmed) return;

    setMessage(null);
    setRestoring(true);
    try {
      const res = await restoreBackup(file);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setMessage({ type: "error", text: text || "Restore failed." });
        return;
      }
      setMessage({ type: "success", text: "Database restored successfully." });
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Unable to reach the server." });
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>💾 Backup & Restore</h1>
        <div className={styles.headerActions}>
          <button className={clsx(button.secondaryBtn)} onClick={() => router.push("/")}>
            Home
          </button>
        </div>
      </div>

      <div className={ownStyles.card}>
        <p className={ownStyles.description}>
          Backup downloads a full database dump to your computer. Restore uploads a previously
          downloaded backup file and overwrites the current database with its contents.
        </p>

        <div className={button.buttonGroup}>
          <button className={clsx(button.primaryBtn)} onClick={handleBackup} disabled={backingUp}>
            {backingUp ? "Backing up..." : "Backup"}
          </button>
          <button className={clsx(button.primaryBtn)} onClick={handleRestoreClick} disabled={restoring}>
            {restoring ? "Restoring..." : "Restore"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".sql"
            style={{ display: "none" }}
            onChange={handleFileSelected}
          />
        </div>

        {message && (
          <div className={clsx(ownStyles.message, message.type === "success" ? ownStyles.success : ownStyles.error)}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
