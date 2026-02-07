'use client'

import React, { useState } from "react";
import  './locationEdit.css';
import Select from 'react-select';
import { LocationFormData } from "@/app/types/types";
import styles from "./location.module.css";
import { useEffect } from "react";
import { getDistrict  } from "../../services/utilityService"
import { get } from "http";

export default function LocationEntryForm({location, onClose, onSave,operationMode})  {
  


  let locationData : LocationFormData = {
    id: location?.id || "",
    name: "",
    code: "",
    districtId: "",
    isActive: "true",
    description: ""
  }

  const [formData, setFormData] = useState(locationData as LocationFormData);
  const [districts, setDistricts] = useState<any[]>([]);
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

   useEffect(() => {
    console.log("selected location in form:", location);
    setFormData(location || locationData);
    let isMounted = true;
     let fetchDistricts =  async () => {
     let districts =  await getDistrict(12).then(res => res.json());
     if (isMounted) {
       setDistricts(districts);
     }
    }
    fetchDistricts();
    return () => { isMounted = false; };
    
  }, []);
        

  const actives = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ];

  const handleClose = () => {
  console.log("Closing form...");
  onClose();
}
const handleSelectChange = (name: string) => (selected: any) => {
  setFormData((prev: any) => ({
    ...prev,
    [name]: selected?.value ?? null,
      
  }));
};

  const handleSave = async (e: React.FormEvent) => {
  
    e.preventDefault();
    console.log("Saving form data...", formData);
    if(operationMode === 'Edit'){
      console.log("Updating transport entry..."+formData.id);
      onSave(formData.id,formData);
  
    } else {
      console.log("Creating new transport entry...");
      onSave(0,formData);
    }
    };
    return (
     <div className={styles.overlay}>
        <div className={styles.modal}>

       <form className="location-form">
        <h2>Location Entry Form</h2>

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

      {/* <pre>{JSON.stringify(districts, null, 2)}</pre> */}

      <div>
        <label>District:</label>
        <Select
          name="districtId"
          value={districts.find(option => option.value === 12)}
          onChange={handleSelectChange("districtId")}
          options={districts.map(d => ({ value: d.id, label: d.name }))}
          required
        />
      </div>
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
        <label>Description:</label>
        <textarea
          className="textarea1"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
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




