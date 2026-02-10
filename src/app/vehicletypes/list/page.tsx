"use client";

import React, { useEffect, useState } from "react";
import styles from "./vehicleTypeList.module.css";
import { PartyFormData } from "@/app/types/types";
import { createParty, deleteParty, getPartyAll, updateParty } from "@/app/services/vehicleTypeService";
import VehicleTypeEntryForm from "../edit/page";

export default function VehcileListPage() {
  const [partyList, setVehicleTypeList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParty, setSelectedVehicleType] = useState<any | null>(null);
  const [operationMode , setOperationMode] = useState('');
  

  useEffect(() => {
    async function fetchVehicleTypeList() {
      let isMounted = true;
      try {
        const response = await getPartyAll(1,100);
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
  setSelectedVehicleType(null);
  setIsModalOpen(true);
  setOperationMode('Add');
};

const handleEdit = (party: any) => {
  console.log('Editing VehicleType:', party);
  setSelectedVehicleType(party);
  setIsModalOpen(true)
  setOperationMode('Edit');
};

useEffect(()=>{

},[selectedParty])


const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this VehicleType?")) return;

  await deleteVehicleType(id);
  setVehicleTypeList(prev => prev.filter(t => t.id !== id));
  
};


const handleSave = async (id : number,formData : PartyFormData) => {
  try {

  console.log("formdata te list " +formData)

   //const response =  await createTransport(formData);
    const response = selectedVehicleType?.id
      ? await updateVehicleType(selectedVehicleType.id, formData)
      : await createVehicleType(formData);

    if (response.ok) {
      const savedVehicleType = await response.json();
      setVehicleTypeList(prev => {
        const existingIndex = prev.findIndex(t => t.id === savedVehicleType.id);
        if (existingIndex !== -1) {
          const updatedList = [...prev];
          updatedList[existingIndex] = savedVehicleType;
          return updatedList;
        } else {
          return [...prev, savedParty];
        }
      });
    }
  } catch (error) {
    alert(error);
    console.error(error);
  }
};

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Party List</h1>

      <div className={styles.tableWrapper}>
        <button className={styles.addBtn} onClick={handleAdd}>
  + Add Party
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
                   <td>{party.name}</td>
                   <td>{party.age}</td>
                   <td>{party.adhaarNo}</td>
                   <td>{party.mobile1}</td>
                   <td>{party.mobile2}</td>
                   <td>{party.licenseNo}</td>
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
   <PartyEntryForm
     party={selectedParty}
     onClose={() => setIsModalOpen(false)}
     operationMode={operationMode}
     onSave={(id : number,formData : any) => {
       console.log("Saving party entry with id:", id, "and data:", formData);
       setIsModalOpen(false);
       handleSave(id, formData);
       getPartyAll(1,100);
     }}
     onDelete={(id : number) => {
       setIsModalOpen(false);
       deleteParty(id);
       getPartyAll(1,100);
     }}
     />
   
)}
      </div>
    </div>
  );
}

