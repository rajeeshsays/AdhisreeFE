'use client'

import React, { useEffect, useState } from "react";
import  './vehicleTypeEdit.css';
import Select from 'react-select';
import { VehicleTypeFormData } from "@/app/types/types";
import styles from "./vehicleType.module.css";
import { createVehicleType,updateVehicleType } from "@/app/services/vehicleTypeService";
export default function VehicleTypeEntryForm({vehicleType,closeModal}:{vehicleType:VehicleTypeFormData,closeModal:()=>void})  {
  
  const vehicleTypeData : VehicleTypeFormData = {
        id : 0,
        desc : "",
        isActive : true,
  }

  const [formData, setFormData] = useState<VehicleTypeFormData>(vehicleType ?? vehicleTypeData);

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("Form data---->>>",formData);
    console.log("Changing field:", name, "to value:", value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

   useEffect(()=>console.log(formData),[formData])
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
      ? await updateVehicleType(formData.id, formData)
      : await createVehicleType(formData);

    if (response.ok) {
      const resText  = await response.text();
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

    <form onSubmit = {handleSave} className="vehicletype-form">
            <h2>Vehicle Type Entry Form</h2>

    <div className="form-grid">
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="desc"
          value={formData.desc}
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


