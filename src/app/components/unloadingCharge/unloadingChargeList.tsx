'use client'
import React, { useEffect, useState } from "react";
import { getUnloadingChargeAll } from "@/app/services/unloadingChargeService";
import { getDrivers } from "@/app/services/driverService";
import { getPartyAll } from "@/app/services/partyService";
import { getInvoiceAll } from "@/app/services/invoiceService";
import styles from "../../css/list.module.css";
import printStyles from "./unloadingChargeList.module.css";
import { InvoiceData, UnloadingChargeData } from "@/app/types/types";
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import button from "../../css/button.module.css"

export default function UnloadingChargeList() {
  const [unloadingChargeList, setUnloadingChargeList] = useState<UnloadingChargeData[]>([]);
  const [unloadingChargeFilteredList, setUnloadingChargeFilteredList] = useState<UnloadingChargeData[]>([]);
  const [driverList, setDriverList] = useState<any[]>([]);
  const [partyList, setPartyList] = useState<any[]>([]);
  const [invoiceNosByTrip, setInvoiceNosByTrip] = useState<Record<number, string>>({});
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

  useEffect(() => {
    const fetchInvoiceList = async () => {
      try {
        const response = await getInvoiceAll();
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data: InvoiceData[] = await response.json();
        const map: Record<number, string[]> = {};
        data.forEach((invoice) => {
          if (!invoice.invoiceNo) return;
          (map[invoice.tripId] ??= []).push(invoice.invoiceNo);
        });
        const joined: Record<number, string> = {};
        Object.entries(map).forEach(([tripId, nos]) => {
          joined[Number(tripId)] = nos.join(', ');
        });
        setInvoiceNosByTrip(joined);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching invoice list:", error.message);
        } else {
          console.error("Unknown error fetching invoice list");
        }
      }
    };

    fetchInvoiceList();
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
      filteredList = filteredList.filter(x => x.driverId === parseInt(selectedDriverId));
    }

    if (selectedPartyId) {
      filteredList = filteredList.filter(x => x.destinationId === parseInt(selectedPartyId));
    }

    if (fromDate) {
      filteredList = filteredList.filter(x => x.tripDate && new Date(x.tripDate) >= new Date(fromDate));
    }

    if (toDate) {
      filteredList = filteredList.filter(x => x.tripDate && new Date(x.tripDate) <= new Date(toDate));
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

  const totalAmount = unloadingChargeFilteredList.reduce((sum, x) => sum + (Number(x.amount) || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={clsx(styles.page, printStyles.page)}>
      <div className={clsx(styles.pageHeader, printStyles.noPrint)}>
        <h1 className={styles.title}>🚚 Unloading Charges</h1>
        <div className={styles.headerActions}>
          <button className={clsx(button.secondaryBtn)} onClick={() => router.push("/")}>
            Home
          </button>
          <button className={clsx(button.primaryBtn)} onClick={handlePrint}>
            Print
          </button>
        </div>
      </div>

      <div className={clsx(styles.filterBar, printStyles.noPrint)}>
        <div className={styles.filterField}>
          <label className={styles.filterLabel}>Driver</label>
          <select
            name="driverId"
            value={selectedDriverId}
            onChange={handleChange}
            className={styles.selectInput}
          >
            <option value="">-- Select Driver --</option>
            {driverList.map((driver) => (
              <option key={driver.value} value={driver.value}>
                {driver.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterField}>
          <label className={styles.filterLabel}>Party</label>
          <select
            name="partyId"
            value={selectedPartyId}
            onChange={handleChange}
            className={styles.selectInput}
          >
            <option value="">-- Select Party --</option>
            {partyList.map((party) => (
              <option key={party.id} value={party.id}>
                {party.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterField}>
          <label className={styles.filterLabel}>From Date</label>
          <input type="date" name="fromDate" value={fromDate} className={styles.dateInput} onChange={handleChange} />
        </div>
        <div className={styles.filterField}>
          <label className={styles.filterLabel}>To Date</label>
          <input type="date" name="toDate" value={toDate} className={styles.dateInput} onChange={handleChange} />
        </div>

        <div className={styles.filterActions}>
          <button className={clsx(button.primaryBtn)} onClick={handleFilter}>
            Filter
          </button>
          <button className={clsx(button.secondaryBtn)} onClick={handleClearFilter}>
            Clear
          </button>
        </div>
      </div>

      <div className={clsx(styles.tableWrapper, printStyles.tableWrapper)}>
        <table className={clsx(styles.table, printStyles.table)}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Trip Code</th>
              <th>Trip Date</th>
              <th>Party</th>
              <th>Invoice No</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Destination</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {unloadingChargeFilteredList.length === 0 ? (
              <tr>
                <td colSpan={9} className={styles.empty}>
                  No unloading charge records found
                </td>
              </tr>
            ) : (
              unloadingChargeFilteredList.map((unloadingCharge) => (
                <tr key={unloadingCharge.id}>
                  <td>{unloadingCharge.id}</td>
                  <td>{unloadingCharge.tripCode || '-'}</td>
                  <td>{unloadingCharge.tripDate ? new Date(unloadingCharge.tripDate).toLocaleDateString() : '-'}</td>
                  <td>{invoiceNosByTrip[unloadingCharge.tripId] || '-'}</td>
                  <td>{unloadingCharge.partyName || '-'}</td>
                  <td>
                    <span className={styles.badge}>
                      {unloadingCharge.vehicleRegistration || '-'}
                    </span>
                  </td>
                  <td>{unloadingCharge.driverName || '-'}</td>
                  <td>{unloadingCharge.destinationName || '-'}</td>
                  <td className={styles.amount}>₹ {unloadingCharge.amount}</td>
                  <td className={unloadingCharge.received ? styles.active : styles.inactive}>
                    {unloadingCharge.received ? "Received" : "Not Received"}
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {unloadingChargeFilteredList.length > 0 && (
            <tfoot>
              <tr className={printStyles.totalRow}>
                <td colSpan={7}>Total ({unloadingChargeFilteredList.length} {unloadingChargeFilteredList.length === 1 ? 'slip' : 'slips'})</td>
                <td className={styles.amount}>₹ {totalAmount.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
