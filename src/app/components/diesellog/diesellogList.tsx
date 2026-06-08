'use client'

import React, { useEffect, useState } from "react";
import { getDieselLogs, deleteDieselLog } from "@/app/services/diesellogService";
import styles from "./dieselLogList.module.css";
import DieselLogEntry from "@/app/components/diesellog/diesellogEntry";
import { DieselLogFormData } from "@/app/types/types";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import button from "../../css/button.module.css";

export default function DieselLogList() {

  const [dieselLogs, setDieselLogs] = useState<any[]>([]);
  const [selectedLog, setSelectedLog] = useState<DieselLogFormData>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operationMode, setOperationMode] = useState("");

  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(()=>{
  if(operationMode=='Edit' && selectedLog)
  {
   setIsModalOpen(true);
  }
  },[selectedLog,operationMode])

  const loadData = async () => {
    try {
      const response = await getDieselLogs();

      if (response.ok) {
        const data = await response.json();
        setDieselLogs(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = () => {
    setSelectedLog(undefined);
    setOperationMode("Add");
    setIsModalOpen(true);
  };

  const handleEdit = (log: DieselLogFormData) => {
    setSelectedLog(log);
    setOperationMode("Edit");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {

    if (!confirm("Are you sure you want to delete this diesel entry?"))
      return;

    try {

      await deleteDieselLog(id);

      setDieselLogs(prev =>
        prev.filter(x => x.id !== id)
      );

    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLog(undefined);
    loadData();
  };

  return (
    <div className={styles.page}>

      <h1 className={styles.title}>⛽ Diesel Log List</h1>

      <div className={styles.tableWrapper}>

        <button
          className={clsx(styles.addBtn, button.primaryBtn)}
          onClick={handleAdd}
        >
          + Add Diesel Entry
        </button>

        <button
          className={clsx(styles.addBtn, button.secondaryBtn)}
          onClick={() => router.push("/")}
        >
          Home
        </button>

        <table className={styles.table}>

          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle No</th>
              <th>Date</th>
              <th>Litres</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Odometer</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {dieselLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  No diesel records found
                </td>
              </tr>
            ) : (
              dieselLogs.map(log => (
                <tr key={log.id}>

                  <td>{log.id}</td>
                  <td>{log.vehicleId}</td>
                  <td>{new Date(log.date).toLocaleDateString()}</td>
                  <td>{log.quantity}</td>
                  <td>{log.pricePerUnit}</td>
                  <td>{log.totalCost}</td>
                  <td>{log.odometerReading}</td>

                  <td>
                    <div className={button.actionIcons}>

                      <button
                        className={button.actionEdit}
                        onClick={() => handleEdit(log)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className={button.btnDelete}
                        onClick={() => handleDelete(log.id)}
                      >
                        <FaTrash />
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

        {isModalOpen && (
          <DieselLogEntry
            dieselLog={selectedLog}
            closeModal={closeModal}
          />
        )}

      </div>

    </div>
  );
}