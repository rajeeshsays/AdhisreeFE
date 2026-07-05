'use client'
import React, { useEffect, useState } from "react";
import {deleteDriver,getDrivers} from "@/app/services/driverService";
import {getDriverLedgerAll} from "@/app/services/driverLedgerService";
import styles from "./driverLedgerList.module.css";
import DriverLedgerEntryForm from "@/app/components/driverLedger/driverLedgerEdit";
import { DriverFormData, DriverLedgerActualData, DriverLedgerFormData } from "@/app/types/types";
import {clsx} from 'clsx'
import {useRouter} from 'next/navigation'
import { FaEdit,FaTrash } from "react-icons/fa";
import button from "../../css/button.module.css"
import DriverLedgerEdit from "@/app/components/driverLedger/driverLedgerEdit";
export default function DriverList() {
  const [driverList, setDriverList] = useState<any[]>([]);
  const [driverLedgerFilteredList, setDriverLedgerFilteredList] = useState<DriverLedgerActualData[]>([]);
  const [driverLedgerList, setDriverLedgerList] = useState<DriverLedgerActualData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriverLedger, setSelectedDriverLedger] = useState<DriverLedgerFormData | undefined>(undefined);
  const [operationMode , setOperationMode] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState(''); 

  const router = useRouter();
  const handleAdd = () => {
  setSelectedDriverLedger(undefined);
  setIsModalOpen(true);
  setOperationMode('Add');
};

useEffect(() => {
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

  fetchDriverLedgerList();
}, []);

useEffect(() => {console.log("selectedDriverId:", selectedDriverId)}, [selectedDriverId]);

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

const closeModal = ()=>
{
  setIsModalOpen(false)
  setSelectedDriverLedger(undefined);
}

const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this driver Ledger?")) return;
  try{
  await deleteDriver(id);
  setDriverList(prev => prev.filter(t => t.id !== id));
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
  let filteredList = driverLedgerList;

  if (selectedDriverId) {
    filteredList = filteredList.filter(x => x.driverId === parseInt(selectedDriverId));
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
  setFromDate('');
  setToDate('');
  setDriverLedgerFilteredList(driverLedgerList);
};              

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Driver List</h1>

    <div className={styles.tableWrapper}>
        <button className={clsx(styles.addBtn,button.primaryBtn)} onClick={handleAdd}>
  + Add Driver Ledger
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
      </div>
{/* <pre>{JSON.stringify(driverList, null, 2) }</pre> */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tr.Date</th>
              <th>Driver</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Remarks</th>
              <th>Actions</th>

            
            </tr>
          </thead>

          <tbody>
            {
            driverLedgerFilteredList.length === 0 ? (
              <tr >
                <td colSpan={8} className={styles.empty}>
                  No driver ledger records found
                </td>
              </tr>
           ) : (
             driverLedgerFilteredList.map((driverLedger) => ( 

  <tr key={driverLedger.id}>

                  <td>{driverLedger.id}</td>
                    <td>{driverLedger.transactionDate}</td>
                    
                    <td>{driverLedger.driver?.name}</td>
                  <td>{driverLedger.debit}</td>
                   <td>{driverLedger.credit}</td>
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
  
   />
)}
      </div>
    
  );
}

