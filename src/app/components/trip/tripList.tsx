"use client";

import React, { useEffect, useState } from "react";
import { getTripAll,deleteTrip} from "@/app/services/tripService";
import styles from "@/app/components/trip/triptList.module.css";
import TripEntryForm from "@/app/components/trip/tripEntryForm";
import { useRouter } from "next/navigation";
import button from "../../css/button.module.css"
import clsx from "clsx"
import { FaEdit,FaTrash } from "react-icons/fa";
import {getDrivers} from "@/app/services/driverService";

export default function TripList() {
  const [tripList, setTripList] = useState<any[]>([]);
  const [tripFilteredList, setTripFilteredList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [driverList, setDriverList] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);
  const router = useRouter();
  useEffect(() => {
    async function fetchTripList() {
      try {
        const response = await getTripAll(1,100);
        if (response.ok) {
          const data = await response.json();
          setTripList(data);
          setTripFilteredList(data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchTripList();
  }, []);

const handleAdd = () => {
  setSelectedTrip(null);
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
const handleEdit = (trip: any) => {
  console.log('Editing trip:', trip);
  setSelectedTrip(trip);
  setIsModalOpen(true);
};
  const closeModal = ()=>
  {
  setIsModalOpen(false);
  setSelectedTrip(null);
  window.location.reload(); // Refresh the page to reflect changes
  }
const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this trip?")) return;

  const { ok } = await deleteTrip(id);

  if (!ok) return;

  const removeTrip = (list: typeof tripList) =>
    list.filter((trip) => trip.id !== id);

  setTripList(removeTrip);
  setTripFilteredList(removeTrip);
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
  let filteredList = tripList;
console.log('Filtering trip list with selectedDriverId:', selectedDriverId, 'fromDate:', fromDate, 'toDate:', toDate);
  if (selectedDriverId) {
    filteredList = filteredList.filter(x => x.driverId === parseInt(selectedDriverId));
  }

  if (fromDate) {
    filteredList = filteredList.filter(x => new Date(x.transactionDate) >= new Date(fromDate));
  }

  if (toDate) {
    filteredList = filteredList.filter(x => new Date(x.transactionDate) <= new Date(toDate));
  }

  setTripFilteredList(filteredList);
};



const handleClearFilter = () => {
  setSelectedDriverId('');
  setFromDate('');
  setToDate('');
  setTripFilteredList(tripList);
};              





  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Trip List</h1>

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

<label className={clsx(styles.label)}>From Date</label><input type="date" name="fromDate" value={fromDate} className={clsx(styles.dateInput)} onChange={handleChange} />
<label className={clsx(styles.label)}>To Date</label><input type="date" name="toDate" value={toDate} className={clsx(styles.dateInput)} onChange={handleChange} />
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
            {tripFilteredList.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  No trip records found
                </td>
              </tr>
            ) : (
              tripFilteredList.map((trip) => (
                <tr key={trip.id}>
                  <td>{trip.id}</td>
                  <td>{new Date(trip.date).toLocaleDateString()}</td>
                  <td>{trip.vehicle?.model}</td>
                  <td>
                    <span className={styles.badge}>
                      {trip.vehicle?.registration}
                    </span>
                  </td>
                  <td>{trip.fromText}</td>
                  <td>{trip.toText}</td>
                  <td>{trip.total}</td>
                  <td className={styles.amount}>₹ {trip.rent}</td>
                  <td>
     
    <div className={button.actionIcons}>
     <button className={button.actionEdit} onClick={() => handleEdit(trip)}>
        <FaEdit />
      </button>

      <button className={button.btnDelete} onClick={() => handleDelete(trip.id)}>
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
  <TripEntryForm
    trip={selectedTrip}
    closeModal={closeModal}
  />
)}





      </div>
    </div>
  );
}
