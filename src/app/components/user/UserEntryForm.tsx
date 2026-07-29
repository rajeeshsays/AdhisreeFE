'use client'

import React, { useState } from "react";
import Select from 'react-select';
import { UserAccountFormData, USER_ROLES } from "@/app/types/types";
import styles from "./user.module.css";
import { createUser } from "@/app/services/userService";

export default function UserEntryForm({ closeModal, onCreated }: { closeModal: () => void, onCreated: () => void }) {

  const emptyUser: UserAccountFormData = {
    username: "",
    password: "",
    fullName: "",
    role: 3,
  };

  const [formData, setFormData] = useState<UserAccountFormData>(emptyUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleChange = (selected: any) => {
    setFormData((prev) => ({
      ...prev,
      role: selected?.value,
    }));
  };

  const handleClose = () => {
    closeModal();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createUser(formData);
      if (res.ok) {
        alert("User created successfully.");
        onCreated();
        closeModal();
      } else {
        const contentType = res.headers.get("content-type");
        const message = contentType?.includes("application/json")
          ? (await res.json())?.message ?? "Failed to create user."
          : await res.text();
        alert(message || "Failed to create user.");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create user.");
      console.error(error);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <form onSubmit={handleSave} className="user-form">
          <h2>New User</h2>

          <div className="form-grid">
            <div>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                autoFocus
              />
            </div>

            <div>
              <label>Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div>
              <label>Role:</label>
              <Select
                name="role"
                value={USER_ROLES.find(option => option.value === formData.role)}
                onChange={handleRoleChange}
                options={USER_ROLES}
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleClose}>
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
