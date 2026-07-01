'use client'
import React, { useEffect, useState } from "react";
import styles from "./vehicleMaintenanceList.module.css";
import { VehicleMaintenanceFormData } from "@/app/types/types";
import {clsx} from 'clsx'
import {useRouter} from 'next/navigation'
import { FaEdit,FaTrash } from "react-icons/fa";
import button from "../../css/button.module.css"
import { remove, getAll} from "@/app/services/vehicleMaintenanceService";
import VehicleMaintenanceEntry from "./vehicleMaintenanceEntry";
export default function VehicleMaintenanceList() {
  const [vehicleMaintenanceList, setVehicleMaintenanceList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleMaintenance, setSelectedVehicleMaintenance] = useState<VehicleMaintenanceFormData | undefined>(undefined);
  const [operationMode , setOperationMode] = useState('');
    const router = useRouter();

  useEffect(() => {
    async function fetchVehicleMaintenanceList() {
      try {
        const response = await getAll();
        if (response.ok) {
          const data = await response.json();
          setVehicleMaintenanceList(data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchVehicleMaintenanceList();
  }, []);

const handleAdd = () => {
  setSelectedVehicleMaintenance(undefined);
  setIsModalOpen(true);
  setOperationMode('Add');
};

const handleEdit = (vehicleMaintenance: any) => {
  console.log('Editing vehicle maintenance:', vehicleMaintenance);
  vehicleMaintenance.dob = vehicleMaintenance.dob ? vehicleMaintenance.dob.split('T')[0] : undefined;
  setSelectedVehicleMaintenance(vehicleMaintenance);
  setOperationMode('Edit');
};

const closeModal = ()=>
{
  setIsModalOpen(false)
  setSelectedVehicleMaintenance(undefined);
}
useEffect(()=>{
if(operationMode=='Edit' && selectedVehicleMaintenance)
{
 setIsModalOpen(true);
}
},[selectedVehicleMaintenance,operationMode])

const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this vehicle maintenance record?")) return;
  try{
  await remove(id);
  setVehicleMaintenanceList(prev => prev.filter(t => t.id !== id));
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
      <h1 className={styles.title}>🚚 Vehicle Maintenance List</h1>

    <div className={styles.tableWrapper}>
        <button className={clsx(styles.addBtn,button.primaryBtn)} onClick={handleAdd}>
  + Add Vehicle Maintenance
</button>
  <button className={clsx(styles.addBtn,button.secondaryBtn)} onClick={()=>router.push("/")}>
  Home
</button>
{/* <pre>{JSON.stringify(vehicleMaintenanceList, null, 2) }</pre> */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle No</th>
              <th>Driver</th>
              <th>Maintenance Date</th>
              <th>Kilometers</th>
              <th>Cost</th>
              <th>Discription</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {
            vehicleMaintenanceList.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  No vehicle maintenance records found
                </td>
              </tr>
           ) : (
             vehicleMaintenanceList.map((vehicleMaintenance) => ( 

  <tr key={vehicleMaintenance.id}>
                     
                  <td>{vehicleMaintenance.id}</td>
                   <td>{vehicleMaintenance.vehicle.registration}</td>
                   <td>{vehicleMaintenance.driver.name}</td>
                   <td>{vehicleMaintenance.maintenanceDate}</td>
                   <td>{vehicleMaintenance.kilometers}</td>
                   <td>{vehicleMaintenance.cost}</td>
                   <td>{vehicleMaintenance.description}</td>
                   <td className={vehicleMaintenance.isActive === "1" ? styles.active : styles.inactive}>
                     {vehicleMaintenance.isActive ? "Active" : "Inactive"}                    
                   
                    </td>
                    <td>
    <div className={button.actionIcons}>
     <button className={button.actionEdit} onClick={() => handleEdit(vehicleMaintenance)}>
        <FaEdit />
      </button>

      <button className={button.btnDelete} onClick={() => handleDelete(vehicleMaintenance.id)}>
        <FaTrash />
      </button>
      </div></td>
  
  </tr>
  )))}
   
            
 </tbody>
             
        </table>
 <pre>{isModalOpen ? "Modal is open" : "Modal is closed"}</pre>
 {isModalOpen && (
   <VehicleMaintenanceEntry
     vehicleMaintenance={selectedVehicleMaintenance}
     closeModal = {closeModal}
  
   />
)}
      </div>
    </div>
  );
}

