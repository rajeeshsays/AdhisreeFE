"use client";

import React, { useEffect, useState } from "react";
import styles from "./userList.module.css";
import { getUsers } from "@/app/services/userService";
import UserEntryForm from "@/app/components/user/UserEntryForm";
import ChangePasswordForm from "@/app/components/user/ChangePasswordForm";
import { UserAccountData } from "@/app/types/types";
import { useAuth } from "@/app/context/AuthContext";
import { clsx } from 'clsx';
import button from "../../css/button.module.css";
import { useRouter } from "next/navigation";
import { FaKey } from "react-icons/fa";

export default function UserList() {
  const { user } = useAuth();
  const router = useRouter();
  const [userList, setUserList] = useState<UserAccountData[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [passwordTarget, setPasswordTarget] = useState<UserAccountData | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      if (response.ok) {
        const data = await response.json();
        setUserList(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.role === "Admin") {
      fetchUsers();
    }
  }, [user]);

  if (user?.role !== "Admin") {
    return (
      <div className={styles.page}>
        <div className={styles.denied}>You must be an Admin to view this page.</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Users</h1>

      <div className={styles.tableWrapper}>
        <button className={clsx(styles.addBtn, button.primaryBtn)} onClick={() => setIsAddModalOpen(true)}>
          + Add User
        </button>
        <button className={clsx(styles.addBtn, button.secondaryBtn)} onClick={() => router.push("/")}>
          Home
        </button>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {userList.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No users found
                </td>
              </tr>
            ) : (
              userList.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.fullName}</td>
                  <td>{u.role}</td>
                  <td className={u.isActive ? styles.active : styles.inactive}>
                    {u.isActive ? "Active" : "Inactive"}
                  </td>
                  <td>
                    <div className={button.actionIcons}>
                      <button className={button.actionEdit} onClick={() => setPasswordTarget(u)} title="Change Password">
                        <FaKey />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {isAddModalOpen && (
          <UserEntryForm
            closeModal={() => setIsAddModalOpen(false)}
            onCreated={fetchUsers}
          />
        )}

        {passwordTarget && (
          <ChangePasswordForm
            user={passwordTarget}
            closeModal={() => setPasswordTarget(null)}
          />
        )}
      </div>
    </div>
  );
}
