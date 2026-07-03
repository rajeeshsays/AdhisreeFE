'use client'
import React, { useEffect, useState } from "react";
import { getDriverAll, deleteDriver} from "@/app/services/driverService";
import styles from "./driverLedgerList.module.css";
import DriverLedgerEntryForm from "@/app/components/driverLedger/driverLedgerEdit";
import { DriverFormData, DriverLedgerFormData } from "@/app/types/types";
import {clsx} from 'clsx'
import {useRouter} from 'next/navigation'
import { FaEdit,FaTrash } from "react-icons/fa";
import button from "../../css/button.module.css"
import DriverLedgerEdit from "@/app/components/driverLedger/driverLedgerEdit";
export default function DriverList() {
  const [driverList, setDriverList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriverLedger, setSelectedDriverLedger] = useState<DriverLedgerFormData | undefined>(undefined);
  const [operationMode , setOperationMode] = useState('');
  const router = useRouter();

  const handleAdd = () => {
  setSelectedDriverLedger(undefined);
  setIsModalOpen(true);
  setOperationMode('Add');
};
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
            driverList.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  No driver ledger records found
                </td>
              </tr>
           ) : (
             driverList.map((driverLedger) => ( 

  <tr key={driverLedger.id}>
                     
                  <td>{driverLedger.id}</td>
                    <td>{driverLedger.transactionDate}</td>
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
    </div>
  );
}

