'use client'

import React, { useState,useEffect } from "react";
import  './partyEdit.css';
import Select from 'react-select';
import { PartyFormData } from "@/app/types/types";
import styles from "./party.module.css";
import { createParty,updateParty } from "@/app/services/partyService";


export default function PartyEntryForm({party,closeModal}:{party : PartyFormData,closeModal:()=>void})  {  
  const partyData : PartyFormData = {
    id:  0,
    name: "",
    code : "",
    gstNo : "",
    addressLine1:  "",
    addressLine2: "",
    mobile: "",
    officePhone :  "",
    email:  "",
    contactPerson : "",
    pincode: "",
    accountId: "",  
    isActive:true
  }


  const [formData, setFormData] = useState<PartyFormData>(party ?? partyData);
  
  useEffect(()=>{
  console.log(party);
  
  },[formData])

  
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("Form data---->>>",formData);
    console.log("Changing field:", name, "to value:", value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const actives = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];


  const handleClose = () => {
  console.log("Closing form...");
  closeModal();
}


const handleSelectChange = (name: string) => (selected: any) => {
  setFormData((prev: any) => ({
    ...prev,
    [name]: selected?.value ?? null,
      
  }));
};


const handleSave = async () => {
  try {
  console.log("formdata te list " +formData)

   //const response =  await createTransport(formData);
    const response = formData.id
      ? await updateParty(formData.id, formData)
      : await createParty(formData);

    if (response.ok) {
      const resText = await response.text();
      alert(resText);
    }
  } catch (error) {
    alert(error);
    console.error(error);
  }
};
    return (
     <div className={styles.overlay}>
        <div className={styles.modal}>

    <form onSubmit={handleSave}  className="party-form">
            <h2>party Entry Form</h2>

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
        <label>Code:</label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
        />
      </div>
    


      <div>
        <label>GST No:</label>
        <input
          type="text"
          name="gstNo"
          value={formData.gstNo}
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
        <label>Pincode</label>
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
        />

        
      </div>

      <div>
        <label>Mobile</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Office Phone</label>
        <input
          type="text"
          name="officePhone"
          value={formData.officePhone}
          onChange={handleChange}
          required
        />
      </div>
  <div>
        <label>Contact Person</label>
        <input
          type="text"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
          required
        />
      </div>

      <div>
  <label>Is Active</label>
  <pre>{formData.isActive}</pre>
  <Select
    name="isActive"
    value={actives.find(option => option.value === formData.isActive)}
    onChange={handleSelectChange("isActive")}
    options={actives}
    required
  >

  
  </Select>
      </div>
      
      <div className="form-actions">
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit">
            Submit
          </button>
      </div>
     </div>
    </form>
    </div>
    </div>
  );
}


