'use client'
import React, {  useEffect, useState } from "react";
import  './driverLedgerEdit.css';
import Select from 'react-select';
import {DriverLedgerFormData, DriverLedgerActualData } from "@/app/types/types";
import styles from "./driverLedger.module.css";
import {createDriverLedger, getdriverLedger } from "@/app/services/driverLedgerService";
import { getDrivers } from "@/app/services/driverService";

interface FieldOptions {
  value: number;
  label: string;
}

let _driverLedgerFormData : DriverLedgerFormData =
{
id: 0,
transactionDate: Date.now().toString(),
paymentType: '',
driverId: 0,
amount: 0,
balance: 0,
remarks: '' 
}

let _driverLedgerActualData : DriverLedgerActualData[] =
[
{
id: 0,
transactionDate: Date.now().toString(),
debit: 0,
credit: 0,
driverId: 0,
remarks: '' 
}
]
type ProcessType = "Advance" | "Salary";
type BalanceLabel = "Payable" | "Receivable" | "Balance";
export default function DriverLedgerEdit({closeModal } : { closeModal: () => void }) {
let drivers : FieldOptions[]=[];
const[driverList,setDriverList] = useState<FieldOptions[]>(drivers);
const[driverLedger,setDriverLedger] = useState<DriverLedgerActualData[]>(_driverLedgerActualData);
const [formData, setFormData] = useState<DriverLedgerFormData>(_driverLedgerFormData);
const [processType, setProcessType] = useState<ProcessType>("Advance");
const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
const [balanceLabel, setBalanceLabel] = useState<BalanceLabel>("Balance");

useEffect(() => {
  getDrivers()
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json(); // Returns a Promise
    })
    .then((data) => {
      console.log("Driver data:", data);

      const drivers = data.map((driver: any) => ({
        value: driver.value,
        label: driver.label,
      }));

      setDriverList(drivers);
    })
    .catch((err) => {
      console.error(err);
    });
}, []);

const getDriverLedger = function(driverId?: number)
{

 getdriverLedger(driverId || 0)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      } 
      return response.json(); // Returns a Promise
    })
    .then((data) => {
      console.log("Driver Ledger data:", data);

      const _driverLedger = data.map((ledger: any) => ({
        id: ledger.id,
        transactionDate: ledger.transactionDate,
        debit: ledger.debit,
        credit: ledger.credit,
        driverId: ledger.driverId,
        remarks: ledger.remarks,
      }));
     console.log("Driver Ledger mapped data:", _driverLedger);

      setDriverLedger(_driverLedger);
    })
    .catch((err) => {
      console.error(err);
    });
};

useEffect(() => {
        calculateBalance().then((balance) => {
      
        //alert("Driver Ledger: " + JSON.stringify(driverLedger));
      if(balance > 0) {
        setBalanceLabel("Receivable");
      } else if(balance < 0) {
        setBalanceLabel("Payable");
      } else {
        setBalanceLabel("Balance");
      }
      
      setFormData(prevData => ({
        ...prevData,
        originalBalance: balance,
        balance: balance
      }));
    });
}, [driverLedger]);


const calculateBalance = async () => {

  const totalDebit = driverLedger.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredit = driverLedger.reduce((sum, entry) => sum + entry.credit, 0);
  if(totalDebit > totalCredit) {
    return totalCredit - totalDebit;
  }
  else
  {
    return totalDebit - totalCredit;
  }
  return 0;
};  

useEffect(() => {
 console.log("Driver list:", driverList);
},[driverList]);


const actives = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];

  const handleClose = () => {
  console.log("Closing form...");
  closeModal();
}

const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if(name === "paymentType") {
       setProcessType(value as ProcessType);
    }
    else if(name === "driverId") {
      
      const driverId = parseInt(value, 10);
      await setSelectedDriverId(driverId);    
      await  getDriverLedger(driverId);


setFormData(prevData => ({
        ...prevData,
        [name]: parseInt(value, 10)
      }));
      
  }
  
  else if(name === "amount") {
    //alert("Amount: " + value);
    //alert("Form data: " + JSON.stringify(formData));
     let newBalance = formData.originalBalance + (parseFloat(value) || 0);
      const amount = parseFloat(value);
      setFormData(prevData => ({
        ...prevData,
        [name]: amount,
        balance: newBalance
      }));
    } 
  
   else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    
    }));
  }
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    try {
      console.log("formdata te list " + JSON.stringify(formData));
      const response = await createDriverLedger(formData);
      if (response.ok) {
        const message = await response.text();
        alert(message);
        closeModal();
      }
    } catch (error) {
      console.error(error);
    }
  }

  
    return (
     <div className={styles.overlay}>
        <div className={styles.modal}>
  <form onSubmit={handleSave}  className="driver-ledger-form">
            <h2>Driver Entry Form</h2>

             <div className="form-grid">
 <div>
 <label>
        <input
          type="radio"
          name="paymentType"
          value="Advance"
          onChange={handleChange}
        />
        Advance Wage
      </label>

      <label>
        <input
          type="radio"
          name="paymentType"
          value="Salary"
          onChange={handleChange}
        />
        Salary
      </label>
</div>



  
     <div>



        <label>Tr.Date:</label>
        <input
          type="date"
          name="transactionDate"
          value={formData.transactionDate}
          onChange={handleChange}
          required
        />
      </div>

    

      <div>
        <label>Driver</label>
        <select
          name="driverId"
          value={formData.driverId}
          onChange={handleChange}
          required
        >
        <option value="">-- Select Driver --</option>

    {driverList.map((driver) => (
      <option key={driver.value} value={driver.value}>
        {driver.label}
      </option>
    ))}
</select>
      </div>
    

      <div>
        <label>{balanceLabel}</label>
        <input
          type="text"
          name="balance"
          value={formData.balance}
          onChange={handleChange}
          required
        />
        
      </div>
     <div>
        <label>{processType}</label>
        <input
          type="text"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        
      </div>
     

      
      <div className="form-actions">
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" >
            Submit
          </button>
      </div>
      </div>
    </form> 
    </div>
    </div>
    
  );

}


