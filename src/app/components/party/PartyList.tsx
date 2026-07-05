"use client";

import React, { useEffect, useState } from "react";
import styles from "./partyList.module.css";
import {deleteParty, getPartyAll } from "@/app/services/partyService";
import PartyEntryForm from "@/app/components/party/PartyEntryForm";
import {PartyFormData} from "@/app/types/types";
import { useRouter } from "next/navigation";
import {clsx} from 'clsx'
import button from "../../css/button.module.css"
import { FaEdit,FaTrash } from "react-icons/fa";
export default function PartyList() {
  

  const [partyList, setPartyList] = useState<any[]>([]);
  const [partyFilteredList,setPartyFilteredList] = useState<any[]|null>([])
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedParty, setSelectedParty] = useState<PartyFormData | undefined>(undefined);
  const [searchedParty,setSearchedParty] = useState<string>('abc');
  const router = useRouter();

  useEffect(() => {
    async function fetchPartyList() {
      let isMounted = true;
      try {
        const response = await getPartyAll(1,100);
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setPartyList(data);
            setPartyFilteredList(data);
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

  useEffect(()=>console.log("party list",JSON.stringify(partyList)),[partyList]);

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
  try{
  await deleteParty(id);
  setPartyFilteredList(prev => prev.filter(t => t.id !== id)) 

  setPartyList(prev => prev.filter(t => t.id !== id));

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
  console.log(value);
  if(name === 'partyName' ) {
    setSearchedParty(value);
  }
 };


const handleFilter = () => {
  let filteredList = partyList;
  if (searchedParty) {
    filteredList = filteredList.filter(x =>
      x.name.includes(searchedParty)
    );
    console.log("filtered list",filteredList)
  }
   console.log("filtered list2",filteredList)
  setPartyFilteredList(filteredList);
};



const handleClearFilter = () => {
  setSearchedParty('');
  setPartyFilteredList(partyList);
};     

return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Party List</h1>

      <div className={styles.tableWrapper}>
        <button className={clsx(styles.addBtn,button.primaryBtn)} onClick={handleAdd}>
  + Add Party
</button>
     <button className={clsx(styles.addBtn,button.secondaryBtn)} onClick={()=>router.push("/")}>
  Home
</button>
<label className={clsx(styles.label)}>Party</label>
<input type="text" name="partyName"  className={clsx(styles.textInput)} value={searchedParty} onChange={handleChange} />
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
             partyFilteredList.map((party) => ( 

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
    <div className={button.actionIcons}>
     <button className={button.actionEdit} onClick={() => handleEdit(party)}>
        <FaEdit />
      </button>

      <button className={button.btnDelete} onClick={() => handleDelete(party.id)}>
        <FaTrash />
      </button>
      </div></td>
  
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

