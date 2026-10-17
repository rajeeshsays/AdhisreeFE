"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { create,update,getAll } from "../../services/vehicleMaintenanceService";
import { getVehicles } from "../../services/vehicleService";
import { getDriverAll } from "@/app/services/driverService";
import "./vehicleMaintenanceEntry.css";
import styles from "./vehicleMaintenance.module.css";
import { VehicleMaintenanceFormData } from "@/app/types/types";
const Select = dynamic(() => import("react-select"), { ssr: false });





interface FieldOption {
  value: string;
  label: string;
}
const  VehicleMaintenanceEntry = ({vehicleMaintenance,closeModal,onSaved}:{vehicleMaintenance:VehicleMaintenanceFormData | undefined,closeModal:()=>void,onSaved?:()=>void}) => {

  
    const vehiclealertData : VehicleMaintenanceFormData = {
        id: 0,                // optional for new entries
        vehicleId: 0,           // reference to Vehicle
        driverId: 0,
        maintenanceDate: "", // ISO Date string
        kilometers: 0,
        cost: 0,
        description: "",
};

    
const [formData, setFormData] = useState<VehicleMaintenanceFormData>(vehicleMaintenance ?? vehiclealertData);
const [vehicleOptions, setVehicleOptions] = useState<FieldOption[]>([]);
const [driverOptions, setDriverOptions] = useState<FieldOption[]>([]);
const [maintenanceRecords, setMaintenanceRecords] = useState<VehicleMaintenanceFormData[]>([]);


//const [loading, setLoading] = useState(true);

  const fields: {
  name: keyof VehicleMaintenanceFormData;
  type: string;
  label: string;
  options?: FieldOption[];
}[] = [
  { name: "id", type: "number", label: "ID" },
   { name: "vehicleId", type: "select", label: "Vehicle No" , options: vehicleOptions },
   { name: "driverId", type: "select", label: "Driver Name" , options: driverOptions },
  { name: "maintenanceDate", type: "date", label:"Maintenance Date"},
  { name: "kilometers", type: "number", label: "Kilometers"},
  { name: "cost", type: "number", label: "Cost"},
  { name: "description", type: "textarea", label: "Description"},
];

const getLastKilometers = (vehicleId: number) => {
  const records = maintenanceRecords.filter(
    (r) => Number(r.vehicleId) === vehicleId && r.id !== formData.id
  );
  if (records.length === 0) return undefined;
  return Math.max(...records.map((r) => Number(r.kilometers)));
};




  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };
const handleClose = () => {
  console.log("Closing form...");
  closeModal();
}

useEffect(() => {  
   console.log("Fetching form data..."); 
   console.log(vehicleMaintenance);

}, [vehicleMaintenance]);


const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const kilometers = Number(formData.kilometers);
  const cost = Number(formData.cost);

  if (!(kilometers > 1)) {
    alert("Kilometers should be greater than 1");
    return;
  }

  if (!(cost > 1)) {
    alert("Cost should be greater than 1");
    return;
  }

  const lastKilometers = getLastKilometers(Number(formData.vehicleId));
  if (lastKilometers !== undefined && kilometers <= lastKilometers) {
    alert("Last maintenance kilometer is greater than now");
    return;
  }

  try {
    console.log("formdata te list " +formData)

    //const response =  await createTransport(formData);
    const response = formData.id
      ? await update(formData.id, formData)
      : await create(formData);
    
    if (response.ok) {
      alert(formData.id ? "Vehicle maintenance record updated successfully." : "Vehicle maintenance record saved successfully.");
      onSaved?.();
      closeModal();
    } else {
      alert("Failed to save vehicle maintenance record.");
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

      const [vehicleRes, driverRes, maintenanceRes] = await Promise.all([

        getVehicles(),
        getDriverAll(1, 1000),
        getAll(),
      ]);

      if (!vehicleRes.ok || !maintenanceRes.ok) {
        throw new Error("One or more API calls failed");
      }

      const [vehicles,drivers,maintenance] = await Promise.all([
        vehicleRes.json(),
        driverRes.json(),
        maintenanceRes.json(),
       ]);

      setMaintenanceRecords(maintenance);

      setVehicleOptions(
        vehicles.map((v: any) => ({
          value: v.value,
          label: v.label,
        }))
      );
      setDriverOptions(
        drivers.map((d: any) => ({
          value: d.id,
          label: String(d.transportTypeId) === "2" ? `${d.name} (Thirdparty)` : d.name,
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
      <form onSubmit={handleSave} className="vehiclemaintenance-form">
        <h2>Vehicle Maintenance Entry</h2>

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
              <div key={name} className={type === "textarea" ? "full-width-field" : undefined}>
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
                    required
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
                ) : type === "textarea" ? (
                  <textarea
                    id={name}
                    name={name}
                    value={formData[name] ?? ""}
                    onChange={handleInputChange}
                    required
                    rows={5}
                  />
                ) : (
                  <input
                    id={name}
                    name={name}
                    type={type}
                    value={formData[name] ?? ""}
                    onChange={handleInputChange}
                    required
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

export default VehicleMaintenanceEntry;
