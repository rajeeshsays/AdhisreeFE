"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createDieselLog,updateDieselLog } from "../../services/diesellogService";
import   "./abc.css";
import { getDrivers } from "../../services/driverService";
import { getVehicles } from "../../services/vehicleService";
import { getParties } from "../../services/partyService";
import styles from "./dieselLog.module.css";
import { DieselLogFormData } from "@/app/types/types";
const Select = dynamic(() => import("react-select"), { ssr: false });



interface FieldOption {
  value: string;
  label: string;
}
const  DieselLogEntry = ({dieselLog,closeModal}:{dieselLog:DieselLogFormData | undefined,closeModal:()=>void}) => {

  
    const diesellogData : DieselLogFormData = {
      id: 0,
      date: "",
      vehicleId: 0,
      driverId: 0,
      sourceId: 0,
      odometerReading: 0,
      quantity: 0,
      pricePerUnit: 0,
      totalCost : 0,
      remarks: "",
    };
  

const [formData, setFormData] = useState<DieselLogFormData>(dieselLog ?? diesellogData);
const [driverOptions, setDriverOptions] = useState<FieldOption[]>([]);
const [vehicleOptions, setVehicleOptions] = useState<FieldOption[]>([]);
const [partyOptions, setPartyOptions] = useState<FieldOption[]>([]);

  const fields: {
  name: keyof DieselLogFormData;
  type: string;
  label: string;
  options?: FieldOption[];
}[] = [
  { name: "id", type: "number", label: "ID" },
  { name: "date", type: "date", label: "Date" },
  { name: "vehicleId", type: "select", label: "Vehicle No" , options: vehicleOptions },
  {name: "odometerReading", type: "number", label: "Odometer Reading"},
  {name: "quantity", type: "number", label: "Quantity"},
  {name: "pricePerUnit", type: "number", label: "Price Per Unit"},
  {name: "totalCost", type: "number", label: "Total Cost"},
  { name: "sourceId", type: "select", label: "Source" , options: partyOptions },
  { name: "driverId", type: "select", label: "Driver", options: driverOptions },
 
 
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
   console.log(dieselLog);
}, [dieselLog]);

const handleSave = async () => {
  try {

  console.log("Diesel Log create/update form data:", formData);
    const response = formData.id
      ? await updateDieselLog(formData.id, formData)
      : await createDieselLog(formData);

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
      const [driverRes,  vehicleRes, partyRes] = await Promise.all([
        getDrivers(),
        getVehicles(),
        getParties(),
      ]);
      if (!driverRes.ok  || !vehicleRes.ok || !partyRes.ok) {
        throw new Error("One or more API calls failed");
      }
      const [drivers, vehicles,parties
      ] = await Promise.all([
        driverRes.json(),
        vehicleRes.json(),
        partyRes.json(),
      ]);
      setDriverOptions(
        drivers.map((d: any) => ({
          value: d.value,
          label: d.label,
        }))
      );
      setVehicleOptions(
        vehicles.map((v: any) => ({
          value: v.value,
          label: v.label,
        }))
      );
      setPartyOptions(
        parties.map((v: any) => ({
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
      <form onSubmit={handleSave} className="diesellog-form">
        <h2>Diesel Log Entry Form</h2>

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

};

export default DieselLogEntry;
