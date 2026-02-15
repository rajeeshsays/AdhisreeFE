'use client'

import React, { useEffect, useState } from "react";
import  './vehicleEdit.css';
import Select from 'react-select';
import { VehicleFormData } from "@/app/types/types";
import styles from "./vehicle.module.css";
import {getVehicle,createVehicle,updateVehicle} from '../../services/vehicleService'

export default function VehicleEntryForm({id,closeModal}:{id:number,closeModal:()=>void})  {
  
  const vehicleData : VehicleFormData = {
         id : 0,     
         model : "", 
         registration : "",
         typeId : 0,
         isActive : true
  }
  const [formData, setFormData] = useState<VehicleFormData>(vehicleData);
  const [vehicleTypes,setVehicleTypes] = useState<any[]>([]);

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("Form data---->>>",formData);
    console.log("Changing field:", name, "to value:", value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(()=>
  {
  let data;
  getVehicle(id).then((res)=>{
   data = res.json();
   console.log(data);
   return data;

  }).then(data=>setVehicleTypes(data));
  },[id])

  useEffect(()=>{
    if(vehicleTypes.length > 0)
    {
      console.log(vehicleTypes)
    }
  
  },[vehicleTypes])


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
    const response = id
      ? await updateVehicle(id, formData)
      : await createVehicle(formData);

    if (response.ok) {
      const resText = await response.text();
      alert(resText)
  } 
}catch(error:unknown) {
    if(error instanceof Error)
    alert(error.message);
    console.error(error);
  }
};
    return (
     <div className={styles.overlay}>
        <div className={styles.modal}>

    <form className="vehicle-form">
            <h2>Vehicle Entry Form</h2>

    <div className="form-grid">
      <div>
        <label>Model:</label>
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Registration:</label>
        <input
          type="text"
          name="registration"
          value={formData.registration}
          onChange={handleChange}
          required
        />
      </div>
      <div>
  <label>Is Active</label>
     
  <Select
    name="isActive"
    value={actives.find(option => option.value === formData.isActive)}
    onChange={handleSelectChange("isActive")}
    options={actives}
    required
  >
  </Select>
  </div>
      <div>
        <label>Registration:</label>
  <Select
    name="typeId"
    value={vehicleTypes.find(option => option.value === formData.typeId)}
    onChange={handleSelectChange("typeId")}
    options={vehicleTypes}
    required
  >
  </Select>
      </div>
      
      <div className="form-actions">
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" onClick={handleSave}>
            Submit
          </button>
      </div>
       

    </div>
    </form>
    </div>
    </div>
  );
}


