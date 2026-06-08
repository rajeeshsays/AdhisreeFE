"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createVehicleAlert,updateVehicleAlert } from "../../services/vehicleAlertService";
import "./vehicleAlertEntry.css";
import { getVehicles } from "../../services/vehicleService";
import styles from "./vehicleAlert.module.css";
import { VehicleAlertFormData } from "@/app/types/types";
const Select = dynamic(() => import("react-select"), { ssr: false });



interface FieldOption {
  value: string;
  label: string;
}
const  VehicleAlertEntry = ({vehicleAlert,closeModal}:{vehicleAlert:VehicleAlertFormData | undefined,closeModal:()=>void}) => {

  
    const vehiclealertData : VehicleAlertFormData = {
        id: 0,                // optional for new entries
        vehicleId: 0,           // reference to Vehicle
        emi: 0,                 // decimal → number
        emiDueDate: "",          // DateOnly → string YYYY-MM-DD
        emiDaysLeft: 0,
        insuranceExpiry: "",     // DateOnly → string
        insuranceDaysLeft: 0,
        insuranceStatus: 0,
        pollutionExpiry: "",     // DateOnly → string
        pollutionDaysLeft: 0,
        pollutionStatus: 0,
        fuelStationName: "",    // optional
        remarks: "",            // optional
};
    
    
const [formData, setFormData] = useState<VehicleAlertFormData>(vehicleAlert ?? vehiclealertData);
const [vehicleOptions, setVehicleOptions] = useState<FieldOption[]>([]);


//const [loading, setLoading] = useState(true);

  const fields: {
  name: keyof VehicleAlertFormData;
  type: string;
  label: string;
  options?: FieldOption[];
}[] = [
  { name: "id", type: "number", label: "ID" },
  { name: "emi", type: "date", label: "Date" },
  { name: "vehicleId", type: "multiselect", label: "Vehicle No" , options: vehicleOptions },
  { name: "emiDueDate", type: "date", label:"EMI Due Date"},
  { name: "emiDaysLeft", type: "number", label: "EMI Days Left"},
  { name: "insuranceExpiry", type: "date", label: "Insurance Expiry"},
  { name: "insuranceDaysLeft", type: "number", label: "Insurance Days Left"},
  { name: "insuranceStatus", type: "number", label: "Insurance Status"},
  { name: "pollutionExpiry", type: "date", label: "Pollution Expiry"},
  { name: "pollutionDaysLeft", type: "number", label: "Pollution Days Left"},
  { name: "pollutionStatus", type: "number", label: "Pollution Status"},
  { name: "fuelStationName", type: "text", label: "Fuel Station Name" },
  { name: "remarks", type: "text", label: "Remarks" }

];




  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };
const handleClose = () => {
  console.log("Closing form...");
  closeModal();
}

useEffect(() => {  
   console.log("Fetching form data..."); 
   console.log(vehicleAlert);

}, [vehicleAlert]);


const handleSave = async () => {
  try {

  console.log("formdata te list " +formData)

   //const response =  await createTransport(formData);
    const response = formData.id
      ? await updateVehicleAlert(formData.id, formData)
      : await createVehicleAlert(formData);

    if (response.ok) {
      const resText = await response.json();
      alert(resText)
    }
  } catch (error) {
    console.error(error);
  }
};




useEffect(() => {
  console.log("Fetching dropdown data...");
  const fetchDropdownData = async () => {
    try {
      //setLoading(true);

      const [vehicleRes] = await Promise.all([

        getVehicles(),

      ]);

      if (!vehicleRes.ok) {
        throw new Error("One or more API calls failed");
      }

      const [vehicles] = await Promise.all([
        vehicleRes.json(),
       ]);

      setVehicleOptions(
        vehicles.map((v: any) => ({
          value: v.value,
          label: v.label,
        }))
      );
    
    } catch (err) {
      console.error("Dropdown load failed:", err);
    } finally {
      //setLoading(false);
    }
  };
  fetchDropdownData();
  },[]);


const handleSelectChange = (name: string, isMulti = false) => (selected: any) => {
  setFormData((prev: any) => ({
    ...prev,
    [name]: isMulti
      ? selected?.map((item: any) => item.value) || []
      : selected?.value ?? null,
  }));
};


return (
  <div className={styles.overlay}>
    <div className={styles.modal}>
      <form onSubmit={handleSave} className="vehiclealert-form">
        <h2>Vehicle Alert Entry Form</h2>

        <div className="form-grid">
          {fields.map(({ name, type, label, options }) => {
            // Skip empty fields in edit mode
            // if (
            //   operationMode.toLowerCase() === "edit" &&
            //   (formData[name] === "" ||
            //     (Array.isArray(formData[name]) &&
            //       formData[name].length === 0))
            // ) {
            //   return null;
            // }

            if (name === "id") return null;

            return (
              <div key={name}>
                <label htmlFor={name}>{label}</label>
                 {/* {<pre>{type}</pre>}
                {<pre>options={type === "multiselect" ? JSON.stringify(options?.length) : "not multiselect"}</pre>} */}
                {
                type === "select" && options ? (
                  <Select
                    instanceId={name}
                    inputId={name}
                    classNamePrefix="react-select"
                    options={options}
                    onChange={handleSelectChange(name, false)}
                    value={options?.find(
                      o => o.value == formData[name]
                    )}
                  />
                ) : type === "multiselect" && options  ? (
                  <Select
                    instanceId={name}
                    inputId={name}
                    classNamePrefix="react-select"
                    isMulti
                    options={options}
                    onChange={handleSelectChange(name, true)}
                    // value={options?.filter(o =>
                    //   formData[name]?.includes(o.value)
                    // )}
                   
                  />
                ) : (
                  <input
                    id={name}
                    name={name}
                    type={type}
                    value={formData[name] ?? ""}
                    onChange={handleInputChange}
                  />
                )}
              </div>
            );
          })}
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

export default VehicleAlertEntry;
