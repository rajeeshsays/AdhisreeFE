"use client";

import React, { useEffect, useState } from "react";
import styles from "./vehicleList.module.css";
import {  deleteVehicle, getVehicleAll, getVehicles} from "@/app/services/vehicleService";
import VehicleEntryForm from "@/app/components/vehicle/VehicleEntryForm";
import {clsx} from 'clsx'
import button from "../../css/button.module.css"
import { useRouter } from "next/navigation";
import { FaEdit,FaTrash } from "react-icons/fa";
export default function VehicleList() {
  const [vehicleList, setVehicleList] = useState<any[]>([]);
  const [vehicleSelectList,setVehicleSelectList] = useState<any[]>([]); 
  const [vehicleFilteredList, setVehicleFilteredList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [searchedModel, setSearchedModel] = useState<string>('');
  const [selectedVehicleId,setSelectedVehicleId] = useState<number|null>(null)
  const router = useRouter();
  useEffect(() => {
    async function fetchVehicleList() {
      let isMounted = true;
      try {
        const response = await getVehicleAll(1,100);
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setVehicleList(data);
            setVehicleFilteredList(data);
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

  useEffect(()=>{
    async function fetchVehicleList() {
      let isMounted = true;
      try {
        const response = await getVehicles();
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setVehicleSelectList(data);
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
  },[])

const handleAdd = () => {
  setSelectedVehicle(null);
  setIsModalOpen(true);
  
};

const handleEdit = (vehicle: any) => {
  console.log('Editing vehicle:', vehicle);
  setSelectedVehicle(vehicle);
  setIsModalOpen(true)
  
};
  const closeModal = ()=>
  {
  setIsModalOpen(false);
  setSelectedVehicle(null);
  }
useEffect(()=>{
},[selectedVehicle])


const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this Vehicle Type?")) return;
  try{
  await deleteVehicle(id);
  setVehicleFilteredList(prev => prev.filter(t => t.id !== id));//truth of source
  setVehicleList(prev => prev.filter(t => t.id !== id));
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
  console.log(name,value);
  if(name === 'vehicleId') {

    setSelectedVehicleId(parseInt(value));
  }
  else if(name == 'model')
  {
    setSearchedModel(value);
  }
};

const handleFilter = () => {
  let filteredList = vehicleList;
    console.log("selected vehicle id " +selectedVehicleId)
  if (selectedVehicleId) {

    filteredList = filteredList.filter(x => x.id == selectedVehicleId);
  }
  if(searchedModel)
  {
     filteredList = filteredList.filter(x => x.model.includes(searchedModel));
  }
  
  setVehicleFilteredList(filteredList);
};


const handleClearFilter = () => {
  setVehicleList(vehicleList);
  setVehicleFilteredList(vehicleList);
};     

return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Vehicle List</h1>

      <div className={styles.tableWrapper}>
        <button className={clsx(styles.addBtn,button.primaryBtn)} onClick={handleAdd}>
  + Add Vehicle
</button>
 <button className={clsx(styles.addBtn,button.secondaryBtn)} onClick={()=>router.push("/")}>
  Home
</button>

        <label className={clsx(styles.label)}>Vehicle</label>
        <select
          name="vehicleId"
          value={selectedVehicleId?.toString()}
          onChange={handleChange}
          required
          className={clsx(styles.selectInput)}
        >
        <option value="">-- Select Driver --</option>

    {vehicleSelectList.map((driver) => (
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
             vehicleFilteredList.map((vehicle) => ( 

                 <tr key={vehicle.id}>
                     
                  <td>{vehicle.id}</td>
                   <td>{vehicle.registration}</td>
                   <td>{vehicle.model}</td>
                
                   <td className={vehicle.isActive === "1" ? styles.active : styles.inactive}>
                     {vehicle.isActive ? "Active" : "Inactive"}                    
                   
                    </td>
                    <td>
    <div className={button.actionIcons}>
     <button className={button.actionEdit} onClick={() => handleEdit(vehicle)}>
        <FaEdit />
      </button>

      <button className={button.btnDelete} onClick={() => handleDelete(vehicle.id)}>
        <FaTrash />
      </button>
      </div></td>
  
  </tr>
  )))}
   
            
 </tbody>
             
        </table>

 {isModalOpen && (
   <VehicleEntryForm
     vehicle={selectedVehicle}
     closeModal={closeModal}
     />
   
)}
      </div>
    </div>
  );
}

