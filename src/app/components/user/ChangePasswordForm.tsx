'use client'

import React, { useState } from "react";
import styles from "./user.module.css";
import { changePassword } from "@/app/services/userService";
import { UserAccountData } from "@/app/types/types";

export default function ChangePasswordForm({ user, closeModal }: { user: UserAccountData, closeModal: () => void }) {

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const res = await changePassword(user.id, newPassword);
      if (res.ok) {
        alert("Password changed successfully.");
        closeModal();
      } else {
        const contentType = res.headers.get("content-type");
        const message = contentType?.includes("application/json")
          ? (await res.json())?.message ?? "Failed to change password."
          : await res.text();
        alert(message || "Failed to change password.");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to change password.");
      console.error(error);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <form onSubmit={handleSave} className="user-form">
          <h2>Change Password for {user.username}</h2>

          <div className="form-grid">
            <div>
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                autoFocus
              />
            </div>

            <div>
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
