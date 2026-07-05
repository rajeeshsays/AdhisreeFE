"use client";

import React, { useEffect,useState } from "react";
import { getLocationAll, deleteLocation} from "@/app/services/locationService";
import styles from "./locationList.module.css";
import LocationEntryForm from "@/app/components/location/LocationEntryForm";
import { useRouter } from "next/navigation";
import {clsx} from 'clsx'
import button from "../../css/button.module.css"
import { FaEdit,FaTrash } from "react-icons/fa";
export default function LocationList() {
  const [locationList, setLocationList] = useState<any[]>([]);
  const [locationFilteredList, setLocationFilteredList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [searchedLocation, setSearchedLocation] = useState<string>('');
  const router = useRouter();
  const closeModal = ()=>
  {
  setIsModalOpen(false);
  setSelectedLocation(null);
  }
  useEffect(() => {
    async function fetchLocationList() {
      try {
        const response = await getLocationAll(1,100);
        if (response.ok) {
          const data = await response.json();
          setLocationList(data);
          setLocationFilteredList(data);
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
  try { 
  await deleteLocation(id);
  setLocationList(prev => prev.filter(t => t.id !== id));
}
  catch (error :unknown) {
    if(error instanceof Error)
    {
      alert(error.message);
    }
    }
};

const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
  const { name, value } = e.target;
   if(name === 'locationName') {
    setSearchedLocation(value);
  }
 };

const handleFilter = () => {
  let filteredList = locationList;
  console.log(locationList);
  console.log("Searched location");
  if (searchedLocation) {
    filteredList = filteredList.filter(x => x.name.includes(searchedLocation));
  }
  setLocationFilteredList(filteredList);
};
  


const handleClearFilter = () => {
  setSearchedLocation('');
  setLocationFilteredList(locationList);
};     




  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Location List</h1>

      <div className={styles.tableWrapper}>
        <button className={clsx(styles.addBtn,button.primaryBtn)} onClick={handleAdd}>
  + Add Location
</button>
      <button className={clsx(styles.addBtn,button.secondaryBtn)} onClick={()=>router.push("/")}>
  Home
</button>
<label className={clsx(styles.label)}>Location</label>
<input type="text" name="locationName" value={searchedLocation} className={clsx(styles.textInput)} onChange={handleChange} />
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
            locationFilteredList.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  No location records found
                </td>
              </tr>
           ) : (
             locationFilteredList.map((location) => ( 
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
    <div className={button.actionIcons}>
     <button className={button.actionEdit} onClick={() => handleEdit(location)}>
        <FaEdit />
      </button>

      <button className={button.btnDelete} onClick={() => handleDelete(location.id)}>
        <FaTrash />
      </button>
      </div></td>
  
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

