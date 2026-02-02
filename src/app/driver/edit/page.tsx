'use client'

import React, { useState } from "react";
import  './driverEdit.css';
import Select from 'react-select';
import { DriverFormData } from "@/app/types/types";
import styles from "./driver.module.css";

export default function DriverEntryForm({driver, onClose, onSave,operationMode})  {
  


  let driverData = {
    name: "",
    age: "",
    dob: "",
    adhaarNo: "",
    addressLine1: "",
    addressLine2: "",
    mobile1: "",
    mobile2: "",
    licenseNo: "",
    isActive: "true",

  }
  const [formData, setFormData] = useState(driverData as DriverFormData);

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const actives = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ];

  const handleClose = () => {
  console.log("Closing form...");
  onClose();
}


  const changeActives = () => {
   setFormData(prevData => ({
        ...prevData,
        isActive: prevData.isActive === "true" ? "false" : "true"
      }));
  }
  const handleSave = async (e: React.FormEvent) => {
  
    e.preventDefault();
    console.log("Saving form data...", formData);
    if(operationMode === 'Edit'){
      console.log("Updating transport entry..."+formData.id);
      onSave(formData.id,formData);
  
    } else {
      console.log("Creating new transport entry...");
      onSave(formData);
    }
    };
    return (
     <div className={styles.overlay}>
        <div className={styles.modal}>
      <form className="transport-form"></form>
  <form onSubmit = {handleSave} className="driver-form">
            <h2>Driver Entry Form</h2>

             <div className="form-grid">

  

      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

    

      <div>
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Adhaar no</label>
        <input
          type="text"
          name="dob"
          value={formData.adhaarNo}
          onChange={handleChange}
          required
        />


      </div>

      <div>
        <label>Address Line 1</label>
        <input
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          required
        />

        
      </div>

      <div>
        <label>Address Line 2</label>
        <input
          type="text"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
          required
        />

        
      </div>
      <div>
        <label>Mobile 1</label>
        <input
          type="text"
          name="mobile1"
          value={formData.mobile1}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Mobile 2</label>
        <input
          type="text"
          name="mobile2"
          value={formData.mobile2}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>License No</label>
        <input
          type="text"
          name="licenseNo"
          value={formData.licenseNo}
          onChange={handleChange}
          required
        />
      </div>
<div>
  <label>Is Active</label>
  <Select
    name="isActive"
    value={actives.find(option => option.value === formData.isActive)}
    onChange={changeActives}
    options={actives}
    required
  >

  
  </Select>
</div>
      </div>
      <div className="form-actions">
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" onClick={handleSave}>
            Submit
          </button>
      </div>
    </form>
    </div>
    </div>
    
  );

}


