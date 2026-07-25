"use client";

import React, { useEffect, useState } from "react";
import { getTripAll,getTrip,deleteTrip} from "@/app/services/tripService";
import styles from "@/app/components/trip/triptList.module.css";
import TripEntryForm from "@/app/components/trip/tripEntryForm";
import { useRouter } from "next/navigation";
import button from "../../css/button.module.css"
import clsx from "clsx"
import { FaEdit,FaTrash } from "react-icons/fa";
import {getDrivers} from "@/app/services/driverService";
import { TripEntryFormData } from "@/app/types/types";

export default function TripList() {
  const [tripList, setTripList] = useState<any[]>([]);
  const [tripFilteredList, setTripFilteredList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [driverList, setDriverList] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<TripEntryFormData | null>(null);
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
const handleEdit = async (trip: any) => {
  console.log('Editing trip:', trip);
  try {
    const response = await getTrip(trip.id);
    if (!response.ok) {
      alert("Failed to load trip details");
      return;
    }
    const data = await response.json();

    const rent = data.rent != null ? String(data.rent) : "";
    const commission = data.commission != null ? String(data.commission) : "";
    const payabletoThirdParty =
      data.rent != null ? String(Number(data.rent) - Number(data.commission ?? 0)) : "";

    const mappedTrip: TripEntryFormData = {
      id: data.id,
      date: data.date ? String(data.date).substring(0, 10) : "",
      vehicleId: data.vehicleId != null ? String(data.vehicleId) : "",
      vehicleTypeId: data.vehicleTypeId != null ? String(data.vehicleTypeId) : "",
      driverId: data.driverId != null ? String(data.driverId) : "",
      party1: data.party1 != null ? String(data.party1) : "",
      destinationGroup: (data.destinationGroups ?? []).map((d: number) => String(d)),
      from: data.from != null ? String(data.from) : "",
      to: data.to != null ? String(data.to) : "",
      fromText: "",
      toText: "",
      startKM: data.startKM != null ? String(data.startKM) : "",
      closeKM: data.closeKM != null ? String(data.closeKM) : "",
      total: data.total != null ? String(data.total) : "",
      rent,
      payabletoThirdParty,
      commission,
      invoiceDetails: (data.invoices ?? []).map((inv: any) => ({
        invoiceNo: inv.invoiceNo,
        date: inv.date,
        amount: String(inv.amount),
      })),
      unloadingCharges: (data.unloadingCharges ?? []).map((uc: any) => ({
        tripId: String(uc.tripId),
        destinationId: String(uc.destinationId),
        amount: uc.amount,
      })),
      returnTrip: data.returnTrip ?? "",
      haltDays: data.haltDays != null ? String(data.haltDays) : "",
      remark: data.remark ?? "",
      voucherId: data.voucherId ?? null,
    };

    setSelectedTrip(mappedTrip);
    setIsModalOpen(true);
  } catch (error) {
    console.error(error);
    alert("Failed to load trip details");
  }
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
  + Add Trip
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
