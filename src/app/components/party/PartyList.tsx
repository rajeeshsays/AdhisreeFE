"use client";

import React, { useEffect, useState } from "react";
import styles from "../../css/list.module.css";
import {deleteParty, getPartyAll } from "@/app/services/partyService";
import { getLocations } from "@/app/services/locationService";
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
  const [locationNameById, setLocationNameById] = useState<Record<number, string>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getLocations();
        if (response.ok) {
          const data = await response.json();
          const map: Record<number, string> = {};
          data.forEach((loc: { value: number; label: string }) => {
            map[loc.value] = loc.label;
          });
          setLocationNameById(map);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchLocations();
  }, []);

  const fetchPartyList = async () => {
    try {
      const response = await getPartyAll(1,100);
      if (response.ok) {
        const data = await response.json();
        const realParties = data.filter((party: any) => party.id !== -1);
        setPartyList(realParties);
        setPartyFilteredList(realParties);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
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
  fetchPartyList();
  }
const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this party?")) return;
  try{
  await deleteParty(id);
  setPartyFilteredList(prev => prev!= null ? prev.filter(t => t.id !== id): null) 

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
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>🚚 Party List</h1>
        <div className={styles.headerActions}>
          <button className={clsx(button.primaryBtn)} onClick={handleAdd}>
            + Add Party
          </button>
          <button className={clsx(button.secondaryBtn)} onClick={() => router.push("/")}>
            Home
          </button>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filterField}>
          <label className={styles.filterLabel}>Party</label>
          <input type="text" name="partyName" className={styles.textInput} value={searchedParty} onChange={handleChange} />
        </div>
        <div className={styles.filterField}>
          <label className={styles.filterLabel}>From Date</label>
          <input type="date" name="fromDate" value={''} className={styles.dateInput} onChange={handleChange} />
        </div>
        <div className={styles.filterField}>
          <label className={styles.filterLabel}>To Date</label>
          <input type="date" name="toDate" value={''} className={styles.dateInput} onChange={handleChange} />
        </div>
        <div className={styles.filterActions}>
          <button className={clsx(button.primaryBtn)} onClick={handleFilter}>
            Filter
          </button>
          <button className={clsx(button.secondaryBtn)} onClick={handleClearFilter}>
            Clear
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Code</th>
              <th>Location</th>
              <th>Mobile</th>
              <th>Office Phone</th>
              <th>Contact Person</th>
              <th>Is Active</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {
            partyList.length === 0 ? (
              <tr>
                <td colSpan={9} className={styles.empty}>
                  No party records found
                </td>
              </tr>
           ) : ( partyFilteredList &&
             partyFilteredList.map((party) => (

                 <tr key={party.id}>

                  <td>{party.id}</td>
                   <td>{party.name}</td>
                   <td>{party.code}</td>
                   <td>{locationNameById[party.locationId] || "-"}</td>
                   <td>{party.mobile}</td>
                   <td>{party.officePhone}</td>
                   <td>{party.contactPerson}</td>
                   <td className={party.isActive === "1" ? styles.active : styles.inactive}>
                     {party.isActive ? "Active" : "Inactive"}

                    </td>
                    <td style={{ textAlign: "right" }}>
    <div className={button.actionIcons} style={{ justifyContent: "flex-end" }}>
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

