"use client";

import React, { useEffect, useState } from "react";
import styles from "./vehicleList.module.css";
import {  deleteVehicle, getVehicleAll} from "@/app/services/vehicleService";
import VehicleEntryForm from "@/app/components/vehicle/VehicleEntryForm";

export default function VehicleList() {
  const [vehicleList, setVehicleList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<any | null>(null);
  
  useEffect(() => {
    async function fetchVehicleList() {
      let isMounted = true;
      try {
        const response = await getVehicleAll(1,100);
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setVehicleList(data);
          }
        }

      } catch (error) {
        console.error(error);
      }
      return () => {
        isMounted = false;
      }
    }
    fetchVehicleList();
  }, []);

const handleAdd = () => {
  setSelectedVehicleId(null);
  setIsModalOpen(true);
  
};

const handleEdit = (vehicle: any) => {
  console.log('Editing vehicle:', vehicle);
  setSelectedVehicleId(vehicle.id);
  setIsModalOpen(true)
  
};
  const closeModal = ()=>
  {
  setIsModalOpen(false);
  selectedVehicleId(null);
  }
useEffect(()=>{

},[selectedVehicleId])


const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this vehicle?")) return;

  await deleteVehicle(id);
  setVehicleList(prev => prev.filter(t => t.id !== id));
  
};




  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Vehicle List</h1>

      <div className={styles.tableWrapper}>
        <button className={styles.addBtn} onClick={handleAdd}>
  + Add Vehicle
</button>
{/* <pre>{JSON.stringify(driverList, null, 2) }</pre> */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Registration</th>
              <th>Model</th>
           
              <th>Is Active</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {
            vehicleList.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  No vehicle records found
                </td>
              </tr>
           ) : (
             vehicleList.map((vehicle) => ( 

                 <tr key={vehicle.id}>
                     
                  <td>{vehicle.id}</td>
                   <td>{vehicle.registration}</td>
                   <td>{vehicle.model}</td>
                
                   <td className={vehicle.isActive === "1" ? styles.active : styles.inactive}>
                     {vehicle.isActive ? "Active" : "Inactive"}                    
                   
                    </td>
                    <td>
<button
className={styles.editBtn}
onClick={() => handleEdit(vehicle)}
   >
     Edit
   </button>

   <button
     className={styles.deleteBtn}
     onClick={() => handleDelete(vehicle.id)}
   >
     Delete
   </button></td>
  
  </tr>
  )))}
   
            
 </tbody>
             
        </table>

 {isModalOpen && (
   <VehicleEntryForm
     id={selectedVehicleId}
     closeModal={closeModal}
     />
   
)}
      </div>
    </div>
  );
}

