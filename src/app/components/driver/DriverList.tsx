'use client'
import React, { useEffect, useState } from "react";
import { getDriverAll, deleteDriver} from "@/app/services/driverService";
import styles from "./driverList.module.css";
import DriverEntryForm from "@/app/components/driver/DriverEntryForm";
import { DriverFormData } from "@/app/types/types";

export default function DriverList() {
  const [driverList, setDriverList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverFormData | undefined>(undefined);
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
  setSelectedDriver(undefined);
  setIsModalOpen(true);
  setOperationMode('Add');
};

const handleEdit = (driver: any) => {
  console.log('Editing driver:', driver);
  driver.dob = driver.dob ? driver.dob.split('T')[0] : undefined;
  setSelectedDriver(driver);
  setOperationMode('Edit');
};

const closeModal = ()=>
{
  setIsModalOpen(false)
  setSelectedDriver(undefined);
}
useEffect(()=>{
if(operationMode=='Edit' && selectedDriver)
{
 setIsModalOpen(true);
}
},[selectedDriver,operationMode])

const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this driver?")) return;
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
     closeModal = {closeModal}
  
   />
)}
      </div>
    </div>
  );
}

