'use client'
import React, { useEffect, useState } from "react";
import { getDriverAll, deleteDriver} from "@/app/services/driverService";
import styles from "./driverList.module.css";
import DriverEntryForm from "@/app/components/driver/driverEntry";
import {clsx} from 'clsx'
import {useRouter} from 'next/navigation'
import { DriverFormData } from "@/app/types/types";
import { FaEdit,FaTrash } from "react-icons/fa";
import button from "../../css/button.module.css"
export default function DriverList() {
  const [driverList, setDriverList] = useState<any[]>([]);
  const [driverFilteredList, setDriverFilteredList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
   const [operationMode , setOperationMode] = useState('');
   const [searchedDriver,setSearchedDriver] = useState('');
   const [selectedDriver,setSelectedDriver] = useState({} as DriverFormData);
  const router = useRouter();
console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
  useEffect(() => {
    async function fetchDriverList() {
      try {
        const response = await getDriverAll(1,100);
        if (response.ok) {
          const data = await response.json();
          setDriverList(data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchDriverList();
  }, []);

const handleAdd = () => {
  //setSearchedDriver('');
  setIsModalOpen(true);
  setOperationMode('Add');
};


const handleEdit = (driver: any) => {
  console.log('Editing driver:', driver);
  driver.dob = driver.dob ? driver.dob.split('T')[0] : undefined;
  setSelectedDriver(driver);
  setOperationMode('Edit');
};


const closeModal = ()=>
{
  setIsModalOpen(false)
  setSearchedDriver('');
}
useEffect(()=>{
if(operationMode=='Edit' && searchedDriver)
{
 setIsModalOpen(true);
}
},[searchedDriver,operationMode])


const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this driver Ledger?")) return;
  try{
  await deleteDriver(id);
  setDriverList(prev => prev.filter(t => t.id !== id));
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

  console.log("value "+ value);
  if(name === 'fromDate' && value !== '') {
    setFromDate(value);
  }
  else if(name === 'toDate' && value !== '') {
    setToDate(value);
  }
  else if(name === 'driverName') {
    setSearchedDriver(value);
  }
 }

const handleFilter = () => {
  let filteredList = driverList;
  console.log("Hi",searchedDriver);
  if (searchedDriver) {
    filteredList = filteredList.filter(x => x.name.includes(searchedDriver));
  }

  if (fromDate) {
    filteredList = filteredList.filter(x => new Date(x.d) >= new Date(fromDate));
  }

  if (toDate) {
    filteredList = filteredList.filter(x => new Date(x.transactionDate) <= new Date(toDate));
  }
  
  setDriverFilteredList(filteredList);
};



const handleClearFilter = () => {
console.log("Handle filter is clicked")
  setSearchedDriver('');
  setFromDate('');
  setToDate('');
  setDriverFilteredList(driverList);
};     


  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Driver List</h1>

    <div className={styles.tableWrapper}>
        <button className={clsx(styles.addBtn,button.primaryBtn)} onClick={handleAdd}>
  + Add Driver
</button>
  <button className={clsx(styles.addBtn,button.secondaryBtn)} onClick={()=>router.push("/")}>
  Home
</button>
<label className={clsx(styles.label)}>Driver</label>
<input type="text" name="driverName" value={searchedDriver} className={clsx(styles.textInput)} onChange={handleChange} />
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
            driverFilteredList.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  No driver records found
                </td>
              </tr>
           ) : (
             driverFilteredList.map((driver) => ( 

  <tr key={driver.id}>
                     
                  <td>{driver.id}</td>
                   <td>{driver.name}</td>
                   <td>{driver.age}</td>
                   <td>{driver.adhaarNo}</td>
                   <td>{driver.mobile1}</td>
                   <td>{driver.mobile2}</td>
                   <td>{driver.licenseNo}</td>
                   <td className={driver.isActive === "1" ? styles.active : styles.inactive}>
                     {driver.isActive ? "Active" : "Inactive"}                    
                   
                    </td>
                    <td>
    <div className={button.actionIcons}>
     <button className={button.actionEdit} onClick={() => handleEdit(driver)}>
        <FaEdit />
      </button>

      <button className={button.btnDelete} onClick={() => handleDelete(driver.id)}>
        <FaTrash />
      </button>
      </div></td>
  
  </tr>
  )))}
   
            
 </tbody>
             
        </table>

 {isModalOpen && (
   <DriverEntryForm
     driver={selectedDriver}
     closeModal = {closeModal}
  
   />
)}
      </div>
    </div>
  );
}

