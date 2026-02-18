'use client'
import React, { useState,useMemo } from "react";
import  './locationEdit.css';
import Select from 'react-select';
import { LocationFormData } from "@/app/types/types";
import styles from "./location.module.css";
import { useEffect } from "react";
import { getDistrict  } from "../../services/utilityService"
import { getLocation,updateLocation,createLocation } from "@/app/services/locationService";


export default function LocationEntryForm({location,closeModal}:{location:LocationFormData,closeModal:()=>void})  {
 
  const locationData : LocationFormData = useMemo(()=> ({
    id:  0,
    name:  "",
    code:  "",
    districtId: "",
    isActive: true,
    description: ""
  }),[]);
  
  const [formData, setFormData] = useState<LocationFormData>(location ?? locationData);
  const [districts, setDistricts] = useState<any[]>([]);
  const handleChange = (e : React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  useEffect(() => {

    let isMounted = true;
     const fetchDistricts =  async () => {
     const districts =  await getDistrict(12).then(res => res.json());
     if (isMounted) {
       setDistricts(districts);
     }
    }
    fetchDistricts();
    return () => { isMounted = false; };
    
  }, []);
        

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
    console.log("formdata te list " +JSON.stringify(formData))
    //const response =  await createTransport(formData);
    const response = formData?.id
      ? await updateLocation(formData.id, formData)
      : await createLocation(formData);

    if (response.ok) {
      const resText = await response.text();
      alert(resText);
  } 
}
catch(error) {
    console.error(error);
  }
  closeModal();

};

    return (
     <div className={styles.overlay}>
        <div className={styles.modal}>

       <form onSubmit={handleSave} className="location-form">
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
          value={districts.find(option=> option.value === formData.districtId)}
          onChange={handleSelectChange("districtId")}
          options={districts.map(d => ({ value: d.value, label: d.label }))}
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
          <button type="submit">
            Submit
          </button>
      </div>
    </form>
</div>
</div>
    
    );
     }




