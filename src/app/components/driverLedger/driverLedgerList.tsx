'use client'
import React, { useEffect, useMemo, useState } from "react";
import {getDriverAll} from "@/app/services/driverService";
import {getDriverLedgerAll, deleteDriverLedger} from "@/app/services/driverLedgerService";
import styles from "../../css/list.module.css";
import { DriverLedgerActualData, } from "@/app/types/types";
import {clsx} from 'clsx'
import {useRouter} from 'next/navigation'
import { FaTrash } from "react-icons/fa";
import button from "../../css/button.module.css"
import DriverLedgerEdit from "@/app/components/driverLedger/driverLedgerEdit";
export default function DriverList() {
  const [driverList, setDriverList] = useState<any[]>([]);
  const [driverLedgerFilteredList, setDriverLedgerFilteredList] = useState<DriverLedgerActualData[]>([]);
  const [driverLedgerList, setDriverLedgerList] = useState<DriverLedgerActualData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedDriverType, setSelectedDriverType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const router = useRouter();
  const handleAdd = () => {
  setIsModalOpen(true);
};

const fetchDriverLedgerList = async () => {
  try {
    const response = await getDriverLedgerAll();
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();

    setDriverLedgerList(data);
    setDriverLedgerFilteredList(data); // Initialize the filtered list with all records
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching driver ledger list:", error.message);
    } else {
      console.error("Unknown error fetching driver ledger list");
    }
  }
};

useEffect(() => {
  fetchDriverLedgerList();
}, []);

useEffect(() => {console.log("selectedDriverId:", selectedDriverId)}, [selectedDriverId]);

useEffect(() => {
  const fetchDriverList = async () => {
    try {
      const response = await getDriverAll(1, 1000);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const drivers = data.map((driver: any) => {
        const transportTypeId = String(driver.transportTypeId);
        return {
          value: driver.id,
          label: transportTypeId === "2" ? `${driver.name} (Thirdparty)` : driver.name,
          transportTypeId,
        };
      });
      setDriverList(drivers);
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

const closeModal = ()=>
{
  setIsModalOpen(false)
}

// Running balance per driver, computed from the full (unfiltered) ledger so it
// always reflects true history even when a date/driver filter is applied.
const balanceById = useMemo(() => {
  const map = new Map<number, number>();
  const byDriver = new Map<number, DriverLedgerActualData[]>();

  driverLedgerList.forEach((entry) => {
    const list = byDriver.get(entry.driverId) ?? [];
    list.push(entry);
    byDriver.set(entry.driverId, list);
  });

  byDriver.forEach((entries) => {
    const sorted = [...entries].sort((a, b) => {
      const dateDiff = new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
      return dateDiff !== 0 ? dateDiff : (a.id ?? 0) - (b.id ?? 0);
    });

    let running = 0;
    sorted.forEach((entry) => {
      running += entry.debit - entry.credit;
      if (entry.id !== undefined) {
        map.set(entry.id, running);
      }
    });
  });

  return map;
}, [driverLedgerList]);

const renderBalance = (id: number | undefined) => {
  const balance = id !== undefined ? balanceById.get(id) ?? 0 : 0;
  if (balance === 0) {
    return <span>0</span>;
  }
  const isReceivable = balance > 0;
  return (
    <span className={isReceivable ? styles.balanceReceivable : styles.balancePayable}>
      {Math.abs(balance)} ({isReceivable ? "Receivable" : "Payable"})
    </span>
  );
};

const handleDelete = async (id: number | undefined) => {
  if (!confirm("Are you sure you want to delete this driver Ledger?")) return;
  try{
  await deleteDriverLedger(id || 0);
  setDriverLedgerList(prev => prev.filter(t => t.id !== id));
  setDriverLedgerFilteredList(prev => prev.filter(t => t.id !== id));
  }
  catch(error : unknown)
  {
    if(error instanceof Error)
    {
      alert(error.message);
    }
  
  }
};


const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
  const { name, value } = e.target;
  if(name === 'fromDate') {
    setFromDate(value);
  }
  else if(name === 'toDate') {
    setToDate(value);
  }
  else if(name === 'driverId' && value !== '') {
    setSelectedDriverId(value);
  }
  else if(name === 'driverType') {
    setSelectedDriverType(value);
  }
 };

const handleFilter = () => {
  let filteredList = driverLedgerList;

  if (selectedDriverId) {
    filteredList = filteredList.filter(x => x.driverId === parseInt(selectedDriverId));
  }

  if (selectedDriverType) {
    filteredList = filteredList.filter(x => String(x.driver?.transportTypeId) === selectedDriverType);
  }

  if (fromDate) {
    filteredList = filteredList.filter(x => new Date(x.transactionDate) >= new Date(fromDate));
  }

  if (toDate) {
    filteredList = filteredList.filter(x => new Date(x.transactionDate) <= new Date(toDate));
  }

  setDriverLedgerFilteredList(filteredList);
};



const handleClearFilter = () => {
  setSelectedDriverId('');
  setSelectedDriverType('');
  setFromDate('');
  setToDate('');
  setDriverLedgerFilteredList(driverLedgerList);
};

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>🚚 Driver Ledger List</h1>
        <div className={styles.headerActions}>
          <button className={clsx(button.primaryBtn)} onClick={handleAdd}>
            + Add Driver Ledger
          </button>
          <button className={clsx(button.secondaryBtn)} onClick={() => router.push("/")}>
            Home
          </button>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filterField}>
          <label className={styles.filterLabel}>Driver</label>
          <select
            name="driverId"
            value={selectedDriverId}
            onChange={handleChange}
            required
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
          <label className={styles.filterLabel}>Type</label>
          <select
            name="driverType"
            value={selectedDriverType}
            onChange={handleChange}
            className={styles.selectInput}
          >
            <option value="">-- All --</option>
            <option value="1">Own</option>
            <option value="2">Thirdparty</option>
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

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tr.Date</th>
              <th>Driver</th>
              <th>Type</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Balance</th>
              <th>Remarks</th>
              <th>Actions</th>

            
            </tr>
          </thead>

          <tbody>
            {
            driverLedgerFilteredList.length === 0 ? (
              <tr >
                <td colSpan={9} className={styles.empty}>
                  No driver ledger records found
                </td>
              </tr>
           ) : (
             driverLedgerFilteredList.map((driverLedger) => ( 

  <tr key={driverLedger.id}>

                  <td>{driverLedger.id}</td>
                    <td>{driverLedger.transactionDate}</td>

                    <td>{driverLedger.driver?.name}</td>
                    <td>{String(driverLedger.driver?.transportTypeId) === "2" ? "Thirdparty" : "Own"}</td>
                  <td>{driverLedger.debit}</td>
                   <td>{driverLedger.credit}</td>
                   <td>{renderBalance(driverLedger.id)}</td>
                   <td>{driverLedger.remarks}</td>
                    <td>
    <div className={button.actionIcons}>
      <button className={button.btnDelete} onClick={() => handleDelete(driverLedger.id)}>
        <FaTrash />
      </button>
      </div></td>
  
  </tr>
  )))}
   
            
 </tbody>
             
        </table>

 {isModalOpen && (
   <DriverLedgerEdit

     closeModal = {closeModal}
     onSaved = {fetchDriverLedgerList}

   />
)}
      </div>
    </div>
  );
}

