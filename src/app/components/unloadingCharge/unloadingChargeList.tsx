'use client'
import React, { useEffect, useState } from "react";
import { getUnloadingChargeAll } from "@/app/services/unloadingChargeService";
import { getDrivers } from "@/app/services/driverService";
import { getPartyAll } from "@/app/services/partyService";
import styles from "./unloadingChargeList.module.css";
import { UnloadingChargeData } from "@/app/types/types";
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import button from "../../css/button.module.css"

export default function UnloadingChargeList() {
  const [unloadingChargeList, setUnloadingChargeList] = useState<UnloadingChargeData[]>([]);
  const [unloadingChargeFilteredList, setUnloadingChargeFilteredList] = useState<UnloadingChargeData[]>([]);
  const [driverList, setDriverList] = useState<any[]>([]);
  const [partyList, setPartyList] = useState<any[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedPartyId, setSelectedPartyId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchUnloadingChargeList = async () => {
      try {
        const response = await getUnloadingChargeAll();
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        setUnloadingChargeList(data);
        setUnloadingChargeFilteredList(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching unloading charge list:", error.message);
        } else {
          console.error("Unknown error fetching unloading charge list");
        }
      }
    };

    fetchUnloadingChargeList();
  }, []);

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
          console.error("Unknown error fetching driver list");
        }
      }
    };

    fetchDriverList();
  }, []);

  useEffect(() => {
    const fetchPartyList = async () => {
      try {
        const response = await getPartyAll(1, 100);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        setPartyList(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching party list:", error.message);
        } else {
          console.error("Unknown error fetching party list");
        }
      }
    };

    fetchPartyList();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'fromDate') {
      setFromDate(value);
    }
    else if (name === 'toDate') {
      setToDate(value);
    }
    else if (name === 'driverId') {
      setSelectedDriverId(value);
    }
    else if (name === 'partyId') {
      setSelectedPartyId(value);
    }
  };

  const handleFilter = () => {
    let filteredList = unloadingChargeList;

    if (selectedDriverId) {
      filteredList = filteredList.filter(x => x.tripEntry?.driverId === parseInt(selectedDriverId));
    }

    if (selectedPartyId) {
      filteredList = filteredList.filter(x => x.destinationId === parseInt(selectedPartyId));
    }

    if (fromDate) {
      filteredList = filteredList.filter(x => x.tripEntry?.date && new Date(x.tripEntry.date) >= new Date(fromDate));
    }

    if (toDate) {
      filteredList = filteredList.filter(x => x.tripEntry?.date && new Date(x.tripEntry.date) <= new Date(toDate));
    }

    setUnloadingChargeFilteredList(filteredList);
  };

  const handleClearFilter = () => {
    setSelectedDriverId('');
    setSelectedPartyId('');
    setFromDate('');
    setToDate('');
    setUnloadingChargeFilteredList(unloadingChargeList);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Unloading Charges</h1>

      <div className={styles.tableWrapper}>
        <div className={clsx(styles.noPrint)}>
        <button className={clsx(styles.addBtn, button.secondaryBtn)} onClick={() => router.push("/")}>
          Home
        </button>

        <label className={clsx(styles.label)}>Driver</label>
        <select
          name="driverId"
          value={selectedDriverId}
          onChange={handleChange}
          className={clsx(styles.selectInput)}
        >
          <option value="">-- Select Driver --</option>
          {driverList.map((driver) => (
            <option key={driver.value} value={driver.value}>
              {driver.label}
            </option>
          ))}
        </select>

        <label className={clsx(styles.label)}>Party</label>
        <select
          name="partyId"
          value={selectedPartyId}
          onChange={handleChange}
          className={clsx(styles.selectInput)}
        >
          <option value="">-- Select Party --</option>
          {partyList.map((party) => (
            <option key={party.id} value={party.id}>
              {party.name}
            </option>
          ))}
        </select>

        <label className={clsx(styles.label)}>From Date</label>
        <input type="date" name="fromDate" value={fromDate} className={clsx(styles.dateInput)} onChange={handleChange} />
        <label className={clsx(styles.label)}>To Date</label>
        <input type="date" name="toDate" value={toDate} className={clsx(styles.dateInput)} onChange={handleChange} />

        <button className={clsx(styles.addBtn, button.secondaryBtn)} onClick={handleFilter}>
          Filter
        </button>
        <button className={clsx(styles.addBtn, button.secondaryBtn)} onClick={handleClearFilter}>
          Clear Filter
        </button>
        <button className={clsx(styles.addBtn, button.primaryBtn)} onClick={handlePrint}>
          Print
        </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Trip Date</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Destination</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {unloadingChargeFilteredList.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No unloading charge records found
                </td>
              </tr>
            ) : (
              unloadingChargeFilteredList.map((unloadingCharge) => (
                <tr key={unloadingCharge.id}>
                  <td>{unloadingCharge.id}</td>
                  <td>{unloadingCharge.tripEntry?.date ? new Date(unloadingCharge.tripEntry.date).toLocaleDateString() : '-'}</td>
                  <td>
                    <span className={styles.badge}>
                      {unloadingCharge.tripEntry?.vehicle?.registration || '-'}
                    </span>
                  </td>
                  <td>{unloadingCharge.tripEntry?.driver?.name || '-'}</td>
                  <td>{unloadingCharge.destination?.name || '-'}</td>
                  <td className={styles.amount}>₹ {unloadingCharge.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
