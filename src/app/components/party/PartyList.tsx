"use client";

import React, { useEffect, useState } from "react";
import styles from "./partyList.module.css";
import {deleteParty, getPartyAll } from "@/app/services/partyService";
import PartyEntryForm from "@/app/components/party/PartyEntryForm";
import {PartyFormData} from "@/app/types/types";

export default function PartyList() {
  

  const [partyList, setPartyList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedParty, setSelectedParty] = useState<PartyFormData | undefined>(undefined);


  useEffect(() => {
    async function fetchPartyList() {
      let isMounted = true;
      try {
        const response = await getPartyAll(1,100);
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setPartyList(data);
          }
        }

      } catch (error) {
        console.error(error);
      }
      return () => {
        isMounted = false;
      }
    }
    fetchPartyList();
  }, []);

const handleAdd = () => {
  setSelectedParty(undefined);
  setIsModalOpen(true);
};

const handleEdit = (party: any) => {
  console.log('Editing party:', party);
  setIsModalOpen(true)
  setSelectedParty(party);
 
};

  const closeModal = ()=>
  {
  setIsModalOpen(false);
  setSelectedParty(undefined);
  }


const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this party?")) return;
  await deleteParty(id);
  setPartyList(prev => prev.filter(t => t.id !== id)); 
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
     closeModal= {closeModal}
     />
   
)}
      </div>
    </div>
  );
}

