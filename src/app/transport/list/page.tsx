"use client";

import React, { useEffect, useState } from "react";
import { getTransportAll, createTransport, updateTransport,deleteTransport} from "@/app/services/transportService";
import styles from "./transportListPage.module.css";


export default function TransportListPage() {
  const [transportList, setTransportList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<any | null>(null);


  useEffect(() => {
    async function fetchTransportList() {
      try {
        const response = await getTransportAll();
        if (response.ok) {
          const data = await response.json();
          setTransportList(data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchTransportList();
  }, []);

const handleAdd = () => {
  setSelectedTransport(null);
  setIsModalOpen(true);
};

const handleEdit = (transport: any) => {
  setSelectedTransport(transport);
  setIsModalOpen(true);
};

const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this transport?")) return;

  await deleteTransport(id);
  setTransportList(prev => prev.filter(t => t.id !== id));
};


  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Transport List</h1>

      <div className={styles.tableWrapper}>
        <button className={styles.addBtn} onClick={handleAdd}>
  + Add Transport
</button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Vehicle</th>
              <th>Registration</th>
              <th>From</th>
              <th>To</th>
              <th>Total KM</th>
              <th>Rent</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {transportList.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  No transport records found
                </td>
              </tr>
            ) : (
              transportList.map((transport) => (
                <tr key={transport.id}>
                  <td>{transport.id}</td>
                  <td>{new Date(transport.date).toLocaleDateString()}</td>
                  <td>{transport.vehicle?.model}</td>
                  <td>
                    <span className={styles.badge}>
                      {transport.vehicle?.registration}
                    </span>
                  </td>
                  <td>{transport.from}</td>
                  <td>{transport.to}</td>
                  <td>{transport.total}</td>
                  <td className={styles.amount}>₹ {transport.rent}</td>
                  <td>
  <button
    className={styles.editBtn}
    onClick={() => handleEdit(transport)}
  >
    Edit
  </button>

  <button
    className={styles.deleteBtn}
    onClick={() => handleDelete(transport.id)}
  >
    Delete
  </button>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
