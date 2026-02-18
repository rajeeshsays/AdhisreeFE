"use client";

import React, { useEffect, useState } from "react";
import { getLocationAll, deleteLocation} from "@/app/services/locationService";
import styles from "./locationList.module.css";
import LocationEntryForm from "@/app/components/location/LocationEntryForm";



export default function LocationList() {
  const [locationList, setLocationList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  
  const closeModal = ()=>
  {
  setIsModalOpen(false);
  selectedLocation(null);
  }


  useEffect(() => {
    async function fetchLocationList() {
      try {
        const response = await getLocationAll(1,100);
        if (response.ok) {
          const data = await response.json();
          setLocationList(data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchLocationList();
  }, []);

const handleAdd = () => {
  setSelectedLocation(null);
  setIsModalOpen(true);

};

const handleEdit = (location: any) => {
  console.log('Editing location:', location);
  setSelectedLocation(location);
  setIsModalOpen(true);
};

const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this location?")) return;

  await deleteLocation(id);
  setLocationList(prev => prev.filter(t => t.id !== id));
};



  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Location List</h1>

      <div className={styles.tableWrapper}>
        <button className={styles.addBtn} onClick={handleAdd}>
  + Add Location
</button>
{/* <pre>{JSON.stringify(driverList, null, 2) }</pre> */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Code</th>
              <th>Description</th>
              <th>District ID</th>
              <th>IsActive</th>
              <th>Actions</th>

            </tr>
          </thead>

          <tbody>
            {
            locationList.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  No location records found
                </td>
              </tr>
           ) : (
             locationList.map((location) => ( 
  <tr key={location.id}>
                     
                  <td>{location.id}</td>
                   <td>{location.name}</td>
                   <td>{location.code}</td>
                  <td>{location.districtId}</td>
                   <td>{location.description}</td>           
                   <td className={location.isActive === "1" ? styles.active : styles.inactive}>
                     {location.isActive ? "Active" : "Inactive"}                    
                   
                    </td>
                    <td>
<button
className={styles.editBtn}
onClick={() => handleEdit(location)}
   >
     Edit
   </button>

   <button
     className={styles.deleteBtn}
     onClick={() => handleDelete(location.id)}
   >
     Delete
   </button></td>
  
  </tr>
  )))}
   
            
 </tbody>
             
        </table>
 {
   <pre>{JSON.stringify(selectedLocation, null, 2)}</pre>
 }
 {isModalOpen && (
 
   <LocationEntryForm
     location={selectedLocation}
     closeModal = {closeModal}
     
   />
)}
      </div>
    </div>
  );
}

