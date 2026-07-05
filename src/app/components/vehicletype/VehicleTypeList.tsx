"use client";

import React, { useEffect, useState } from "react";
import styles from "./vehicleTypeList.module.css";
import {deleteVehicleType, getVehicleTypeAll} from "@/app/services/vehicleTypeService";
import VehicleTypeEntryForm from "@/app/components/vehicletype/VehicleTypeEntryForm";
import {clsx} from 'clsx'
import button from "../../css/button.module.css"
import { useRouter } from "next/navigation"
import { FaEdit,FaTrash } from "react-icons/fa";
export default function VehcileList() {
  const [vehicleTypeList, setVehicleTypeList] = useState<any[]>([]);
  const [vehicleTypeFilteredList, setVehicleTypeFilteredList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState<any | null>(null);
  const [searchedVehicleType, setSearchedVehicleType] = useState<string>('');


    const router = useRouter();

  
  useEffect(() => {
    async function fetchVehicleTypeList() {
      let isMounted = true;
      try {
        const response = await getVehicleTypeAll(1,100);
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setVehicleTypeList(data);
            setVehicleTypeFilteredList(data);
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
  setSelectedVehicleType(null);
  setIsModalOpen(true);
  
};

const handleEdit = (vehicleType: any) => {
  console.log('Editing VehicleType:', vehicleType);
  setSelectedVehicleType(vehicleType);
  setIsModalOpen(true)
};
  const closeModal = ()=>
  {
  setIsModalOpen(false);
  setSelectedVehicleType(null);
  }
useEffect(()=>{

},[selectedVehicleType])


const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this Vehicle Type?")) return;
  try{
  await deleteVehicleType(id);
  setVehicleTypeFilteredList(prev => prev.filter(t => t.id !== id));//truth of source
  setVehicleTypeList(prev => prev.filter(t => t.id !== id));
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
  if(name === 'vehicleType') {
    console.log("searched vehicle type", value)
    setSearchedVehicleType(value);
  }
};

const handleFilter = () => {
  let filteredList = vehicleTypeList;
  if (searchedVehicleType) {
    filteredList = filteredList.filter(x => x.desc.includes(searchedVehicleType));
  }
  setVehicleTypeFilteredList(filteredList);
};

const handleClearFilter = () => {
  
  setSearchedVehicleType('');
  setVehicleTypeFilteredList(vehicleTypeList);
};     



  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Vehicle Type List</h1>

      <div className={styles.tableWrapper}>
        <button className={clsx(styles.addBtn,button.primaryBtn)} onClick={handleAdd}>
  + Add Vehicle Type
</button>
 <button className={clsx(styles.addBtn,button.secondaryBtn)} onClick={()=>router.push("/")}>
  Home
</button>
<label className={clsx(styles.label)}>Vehicle Type</label>
<input type="text" name="vehicleType" value={searchedVehicleType} className={clsx(styles.textInput)} onChange={handleChange} />
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
              <th>Desc</th>
              <th>Is Active</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {
            vehicleTypeFilteredList.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  No vehicleType records found
                </td>
              </tr>
           ) : (
             vehicleTypeFilteredList.map((vehicleType) => ( 

                 <tr key={vehicleType.id}>
                     
                  <td>{vehicleType.id}</td>
                   <td>{vehicleType.desc}</td>
                   <td className={vehicleType.isActive === "1" ? styles.active : styles.inactive}>
                     {vehicleType.isActive ? "Active" : "Inactive"}                    
                   
                    </td>
                    <td>
    <div className={button.actionIcons}>
     <button className={button.actionEdit} onClick={() => handleEdit(vehicleType)}>
        <FaEdit />
      </button>

      <button className={button.btnDelete} onClick={() => handleDelete(vehicleType.id)}>
        <FaTrash />
      </button>
      </div></td>
  
  </tr>
  )))}
   
            
 </tbody>
             
        </table>

 {isModalOpen && (
   <VehicleTypeEntryForm
     vehicleType={selectedVehicleType}
     closeModal={closeModal}
     />
   
)}
      </div>
    </div>
  );
}

