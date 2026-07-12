"use client";

import React, { useEffect, useState } from "react";
import { getTransportAll,deleteTransport} from "@/app/services/tripService";
import styles from "./transportList.module.css";
import TransportEntryForm from "@/app/components/trip/tripEntryForm";
import { useRouter } from "next/navigation";
import button from "../../css/button.module.css"
import clsx from "clsx"
import { FaEdit,FaTrash } from "react-icons/fa";
import {deleteDriver,getDrivers} from "@/app/services/driverService";

export default function TransportList() {
  const [transportList, setTransportList] = useState<any[]>([]);
  const [transportFilteredList, setTransportFilteredList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [driverList, setDriverList] = useState<any[]>([]);
  const [selectedTransport, setSelectedTransport] = useState<any | null>(null);
  const router = useRouter();
  useEffect(() => {
    async function fetchTransportList() {
      try {
        const response = await getTransportAll(1,100);
        if (response.ok) {
          const data = await response.json();
          setTransportList(data);
          setTransportFilteredList(data);
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
useEffect(() => {
  const fetchDriverList = async () => {
    try {
      const response = await getDrivers();
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setDriverList(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching driver list:", error.message);
      } else {
        console.error("Unknown error fetching driver     list");
      }
    }
  };

  fetchDriverList();
}, []);
const handleEdit = (transport: any) => {
  console.log('Editing transport:', transport);
  setSelectedTransport(transport);
  setIsModalOpen(true);
};
  const closeModal = ()=>
  {
  setIsModalOpen(false);
  setSelectedTransport(null);
  window.location.reload(); // Refresh the page to reflect changes
  }
const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this transport?")) return;

  const { ok } = await deleteTransport(id);

  if (!ok) return;

  const removeTransport = (list: typeof transportList) =>
    list.filter((transport) => transport.id !== id);

  setTransportList(removeTransport);
  setTransportFilteredList(removeTransport);
};

const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
  const { name, value } = e.target;
  console.log('handleChange called with name:', name, 'and value:', value);
  if(name === 'fromDate' && value !== '') {
    setFromDate(value);
  }
  else if(name === 'toDate' && value !== '') {
    setToDate(value);
  }
  else if(name === 'driverId' && value !== '') {
    setSelectedDriverId(value);
  }
 };

const handleFilter = () => {
  let filteredList = transportList;
console.log('Filtering transport list with selectedDriverId:', selectedDriverId, 'fromDate:', fromDate, 'toDate:', toDate);
  if (selectedDriverId) {
    filteredList = filteredList.filter(x => x.driverId === parseInt(selectedDriverId));
  }

  if (fromDate) {
    filteredList = filteredList.filter(x => new Date(x.transactionDate) >= new Date(fromDate));
  }

  if (toDate) {
    filteredList = filteredList.filter(x => new Date(x.transactionDate) <= new Date(toDate));
  }

  setTransportFilteredList(filteredList);
};



const handleClearFilter = () => {
  setSelectedDriverId('');
  setFromDate('');
  setToDate('');
  setTransportFilteredList(transportList);
};              





  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Transport List</h1>

      <div className={styles.tableWrapper}>
        <button className={clsx(styles.addBtn,button.primaryBtn)} onClick={handleAdd}>
  + Add Location
</button>
  <button className={clsx(styles.addBtn,button.secondaryBtn)} onClick={()=>router.push("/")}>
  Home
</button>
   <label className={clsx(styles.label)}>Driver</label>
        <select
          name="driverId"
          value={selectedDriverId}
          onChange={handleChange}
          required
          className={clsx(styles.selectInput)}
        >
        <option value="">-- Select Driver --</option>

    {driverList.map((driver) => (
      <option key={driver.value} value={driver.value}>
        {driver.label}
      </option>
    ))}
</select>

<label className={clsx(styles.label)}>From Date</label><input type="date" name="fromDate" value={''} className={clsx(styles.dateInput)} onChange={handleChange} />
<label className={clsx(styles.label)}>To Date</label><input type="date" name="toDate" value={''} className={clsx(styles.dateInput)} onChange={handleChange} />
<button className={clsx(styles.addBtn,button.secondaryBtn)} onClick={handleFilter}>
  Filter
</button>
<button className={clsx(styles.addBtn,button.secondaryBtn)} onClick={handleClearFilter}>

  Clear Filter
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
            {transportFilteredList.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  No transport records found
                </td>
              </tr>
            ) : (
              transportFilteredList.map((transport) => (
                <tr key={transport.id}>
                  <td>{transport.id}</td>
                  <td>{new Date(transport.date).toLocaleDateString()}</td>
                  <td>{transport.vehicle?.model}</td>
                  <td>
                    <span className={styles.badge}>
                      {transport.vehicle?.registration}
                    </span>
                  </td>
                  <td>{transport.fromText}</td>
                  <td>{transport.toText}</td>
                  <td>{transport.total}</td>
                  <td className={styles.amount}>₹ {transport.rent}</td>
                  <td>
     
    <div className={button.actionIcons}>
     <button className={button.actionEdit} onClick={() => handleEdit(transport)}>
        <FaEdit />
      </button>

      <button className={button.btnDelete} onClick={() => handleDelete(transport.id)}>
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
  <TransportEntryForm
    transport={selectedTransport}
    closeModal={closeModal}
  />
)}





      </div>
    </div>
  );
}
