"use client";

import React, { useEffect, useState } from "react";
import styles from "./vehicleTypeList.module.css";
import {deleteVehicleType, getVehicleTypeAll} from "@/app/services/vehicleTypeService";
import VehicleTypeEntryForm from "@/app/components/vehciletype/VehicleTypeEntryForm";

export default function VehcileList() {
  const [partyList, setVehicleTypeList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleTypeId, setSelectedVehicleTypeId] = useState<any | null>(null);

  
  useEffect(() => {
    async function fetchVehicleTypeList() {
      let isMounted = true;
      try {
        const response = await getVehicleTypeAll(1,100);
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setVehicleTypeList(data);
          }
        }

      } catch (error) {
        console.error(error);
      }
      return () => {
        isMounted = false;
      }
    }
    fetchVehicleTypeList();
  }, []);

const handleAdd = () => {
  setSelectedVehicleTypeId(null);
  setIsModalOpen(true);
  
};

const handleEdit = (party: any) => {
  console.log('Editing VehicleType:', party);
  setSelectedVehicleTypeId(party.id);
  setIsModalOpen(true)
};
  const closeModal = ()=>
  {
  setIsModalOpen(false);
  selectedVehicleTypeId(null);
  }
useEffect(()=>{

},[selectedVehicleTypeId])


const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this VehicleType?")) return;

  await deleteVehicleType(id);
  setVehicleTypeList(prev => prev.filter(t => t.id !== id));
  
};




  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Vehicle Type List</h1>

      <div className={styles.tableWrapper}>
        <button className={styles.addBtn} onClick={handleAdd}>
  + Add Vehicle Type
</button>
{/* <pre>{JSON.stringify(driverList, null, 2) }</pre> */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Desc</th>
              <th>Is Active</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {
            partyList.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  No party records found
                </td>
              </tr>
           ) : (
             partyList.map((party) => ( 

                 <tr key={party.id}>
                     
                  <td>{party.id}</td>
                   <td>{party.desc}</td>
                   <td className={party.isActive === "1" ? styles.active : styles.inactive}>
                     {party.isActive ? "Active" : "Inactive"}                    
                   
                    </td>
                    <td>
<button
className={styles.editBtn}
onClick={() => handleEdit(party)}
   >
     Edit
   </button>

   <button
     className={styles.deleteBtn}
     onClick={() => handleDelete(party.id)}
   >
     Delete
   </button></td>
  
  </tr>
  )))}
   
            
 </tbody>
             
        </table>

 {isModalOpen && (
   <VehicleTypeEntryForm
     id={selectedVehicleTypeId}
     closeModal={closeModal}
     />
   
)}
      </div>
    </div>
  );
}

