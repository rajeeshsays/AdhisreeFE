"use client";

import React, { useEffect, useState } from "react";
import { getDriverAll, createDriver, updateDriver,deleteDriver} from "@/app/services/driverService";
import styles from "./driverList.module.css";
import DriverEntryForm from "../edit/page";
import { DriverFormData } from "@/app/types/types";

export default function DriverListPage() {
  const [driverList, setDriverList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
  const [operationMode , setOperationMode] = useState('');


  useEffect(() => {
    async function fetchDriverList() {
      try {
        const response = await getDriverAll(1,100);
        if (response.ok) {
          const data = await response.json();
          setDriverList(data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchDriverList();
  }, []);

const handleAdd = () => {
  setSelectedDriver(null);
  setIsModalOpen(true);
  setOperationMode('Add');
};

const handleEdit = (driver: any) => {
  console.log('Editing driver:', driver);
  setSelectedDriver(driver);
  setIsModalOpen(true);
  setOperationMode('Edit');
};

const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this driver?")) return;

  await deleteDriver(id);
  setDriverList(prev => prev.filter(t => t.id !== id));
};

const handleSave = async (id : number,formData : DriverFormData) => {
  try {

  console.log("formdata te list " +formData)

   //const response =  await createTransport(formData);
    const response = selectedDriver?.id
      ? await updateDriver(selectedDriver.id, formData)
      : await createDriver(formData);

    if (response.ok) {
      const savedDriver = await response.json();
      setDriverList(prev => {
        const existingIndex = prev.findIndex(t => t.id === savedDriver.id);
        if (existingIndex !== -1) {
          const updatedList = [...prev];
          updatedList[existingIndex] = savedDriver;
          return updatedList;
        } else {
          return [...prev, savedDriver];
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Driver List</h1>

      <div className={styles.tableWrapper}>
        <button className={styles.addBtn} onClick={handleAdd}>
  + Add Driver
</button>
{/* <pre>{JSON.stringify(driverList, null, 2) }</pre> */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Adhaar No</th>
              <th>Mobile 1</th>
              <th>Mobile 2</th>
              <th>License No</th>
              <th>Is Active</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {
            driverList.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  No driver records found
                </td>
              </tr>
           ) : (
             driverList.map((driver) => ( 

  <tr key={driver.id}>
                     
                  <td>{driver.id}</td>
                   <td>{driver.name}</td>
                   <td>{driver.age}</td>
                   <td>{driver.adhaarNo}</td>
                   <td>{driver.mobile1}</td>
                   <td>{driver.mobile2}</td>
                   <td>{driver.licenseNo}</td>
                   <td className={driver.isActive === "1" ? styles.active : styles.inactive}>
                     {driver.isActive ? "Active" : "Inactive"}                    
                   
                    </td>
                    <td>
<button
className={styles.editBtn}
onClick={() => handleEdit(driver)}
   >
     Edit
   </button>

   <button
     className={styles.deleteBtn}
     onClick={() => handleDelete(driver.id)}
   >
     Delete
   </button></td>
  
  </tr>
  )))}
   
            
 </tbody>
             
        </table>

 {isModalOpen && (
   <DriverEntryForm
     driver={selectedDriver}
     onClose={() => setIsModalOpen(false)}
     operationMode={operationMode}
     onSave={(id : number,formData : any) => {
       setIsModalOpen(false);
       handleSave(id, formData);
       getDriverAll(1,100);
     }}
   />
)}
      </div>
    </div>
  );
}

