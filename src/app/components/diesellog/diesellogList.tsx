'use client'

import React, { useEffect, useState } from "react";
import { getDieselLogs, deleteDieselLog } from "@/app/services/diesellogService";
import { getVehicles } from "@/app/services/vehicleService";
import styles from "./dieselLogList.module.css";
import DieselLogEntry from "@/app/components/diesellog/diesellogEntry";
import { DieselLogFormData } from "@/app/types/types";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import button from "../../css/button.module.css";

export default function DieselLogList() {

  const [dieselLogs, setDieselLogs] = useState<any[]>([]);
  const [dieselLogsFilteredList, setDieselLogsFilteredList] = useState<any[]>([]);
  const [vehicleSelectList, setVehicleSelectList] = useState<any[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<DieselLogFormData>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operationMode, setOperationMode] = useState("");

  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    async function fetchVehicleList() {
      try {
        const response = await getVehicles();
        if (response.ok) {
          const data = await response.json();
          setVehicleSelectList(data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchVehicleList();
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
        setDieselLogsFilteredList(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "vehicleId") {
      setSelectedVehicleId(value);
    }
  };

  const handleFilter = () => {
    let filteredList = dieselLogs;
    if (selectedVehicleId) {
      filteredList = filteredList.filter(x => String(x.vehicleId) === String(selectedVehicleId));
    }
    setDieselLogsFilteredList(filteredList);
  };

  const handleClearFilter = () => {
    setSelectedVehicleId(null);
    setDieselLogsFilteredList(dieselLogs);
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

      setDieselLogs(prev => prev.filter(x => x.id !== id));
      setDieselLogsFilteredList(prev => prev.filter(x => x.id !== id));

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

        <label className={clsx(styles.label)}>Vehicle</label>
        <select
          name="vehicleId"
          value={selectedVehicleId?.toString() ?? ""}
          onChange={handleChange}
          className={clsx(styles.selectInput)}
        >
          <option value="">-- Select Vehicle --</option>

          {vehicleSelectList.map((vehicle) => (
            <option key={vehicle.value} value={vehicle.value}>
              {vehicle.label}
            </option>
          ))}
        </select>
        <button className={clsx(styles.addBtn, button.secondaryBtn)} onClick={handleFilter}>
          Filter
        </button>
        <button className={clsx(styles.addBtn, button.secondaryBtn)} onClick={handleClearFilter}>
          Clear
        </button>

        <table className={styles.table}>

          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle No</th>
              <th>Date</th>
              <th style={{ textAlign: "right" }}>Odometer</th>
              <th style={{ textAlign: "right" }}>Litres</th>
              <th style={{ textAlign: "right" }}>Rate</th>
              <th style={{ textAlign: "right" }}>Amount</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>

            {dieselLogsFilteredList.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  No diesel records found
                </td>
              </tr>
            ) : (
              dieselLogsFilteredList.map(log => (
                <tr key={log.id}>

                  <td>{log.id}</td>
                  <td>{log.vehicle.registration}</td>
                  <td>{new Date(log.date).toLocaleDateString()}</td>
                  <td style={{ textAlign: "right" }}>{Number(log.odometerReading).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>{Number(log.quantity).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>{Number(log.pricePerUnit).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>{Number(log.totalCost).toFixed(2)}</td>

                  <td style={{ textAlign: "right" }}>
                    <div className={button.actionIcons} style={{ justifyContent: "flex-end" }}>

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