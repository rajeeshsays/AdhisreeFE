"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getTransport } from "../services/transportService";
import "./transportentryform.css";
import { getDriver } from "../services/driverService";
import { getLocation } from "../services/locationService";
import { getVehicle } from "../services/vehicleService";
import { getVehicleType } from "../services/vehicleTypeService";
import { getParty } from "../services/partyService";
import styles from "./transport.module.css";
const Select = dynamic(() => import("react-select"), { ssr: false });

type TransportEntryFormData = {
  id: string;
  date: string;
  vehicleNo: string;
  vehicleTypeId: string;
  driverId: string;
  party1: string;
  party2: string[];
  from: string;
  to: string;
  startKM: string;
  closeKM: string;
  total: string;
  loading: string;
  unloading: string;
  loadingCommision: string;
  unloadingCommision: string;
};

interface FieldOption {
  value: string;
  label: string;
}
const TransportEntryForm = ({transport, onClose, onSave}) => {

  if (!transport) {
    transport = {
      id: "",
      date: "",
      vehicleNo: "",
      vehicleTypeId: "",
      driverId: "",
      party1: "",
      destinationGroups: [],
      from: "",
      to: "",
      startKM: "",
      closeKM: "",
      total: "",
      loading: "",
      unloading: "",
      loadingCommision: "",
      unloadingCommision: "",
    };
  }   
 const [formData, setFormData] = useState<TransportEntryFormData>(transport as TransportEntryFormData);
  
const [driverOptions, setDriverOptions] = useState<FieldOption[]>([]);
const [locationOptions, setLocationOptions] = useState<FieldOption[]>([]);
const [vehicleOptions, setVehicleOptions] = useState<FieldOption[]>([]);
const [vehicleTypeOptions, setVehicleTypeOptions] = useState<FieldOption[]>([]);
const [party2GroupOptions, setParty2GroupOptions] = useState<FieldOption[]>([]);
const [partyOptions, setPartyOptions] = useState<FieldOption[]>([]);
const [loading, setLoading] = useState(true);

  const fields: {
  name: keyof TransportEntryFormData;
  type: string;
  label: string;
  options?: FieldOption[];
}[] = [
  { name: "id", type: "number", label: "ID" },
  { name: "date", type: "date", label: "Date" },
  { name: "vehicleId", type: "select", label: "Vehicle No" , options: vehicleOptions },
  { name: "vehicleTypeId", type: "select", label: "Vehicle Type" , options: vehicleTypeOptions },
  { name: "driverId", type: "select", label: "Driver ID", options: driverOptions },
  { name: "party1", type: "select", label: "Party 1" , options: partyOptions },
  {
    name: "destinationGroups",
    type: "multiselect",
    label: "Destination Group",
    options: party2GroupOptions,
      
    
  },
  { name: "from", type: "select", label: "From", options: locationOptions },
  { name: "to", type: "select", label: "To", options: locationOptions },
  { name: "startKM", type: "number", label: "Start KM" },
  { name: "closeKM", type: "number", label: "Close KM" },
  { name: "total", type: "number", label: "Total" },
  { name: "loading", type: "number", label: "Loading" },
  { name: "unloading", type: "number", label: "Unloading" },
  { name: "loadingCommision", type: "number", label: "Loading Commission" },
  { name: "unloadingCommision", type: "number", label: "Unloading Commission" },
];
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };


useEffect(() => {   console.log("Fetching form data..."); 
 const fetchDropdownData = async () => {
    try {
      setLoading(true);

      const [driverRes, locationRes, vehicleRes, vehicleTypeRes, partyRes] = await Promise.all([
        getDriver(),
        getLocation(),
        getVehicle(),
        getVehicleType(),
        getParty(),
      ]);

      if (!driverRes.ok || !locationRes.ok || !vehicleRes.ok) {
        throw new Error("One or more API calls failed");
      }

      const [drivers, locations, vehicles, vehicleTypes, parties] = await Promise.all([
        driverRes.json(),
        locationRes.json(),
        vehicleRes.json(),
        vehicleTypeRes.json(),
        partyRes.json(),
      ]);

      setDriverOptions(
        drivers.map((d: any) => ({
          value: d.id,
          label: d.name,
        }))
      );

      setLocationOptions(
        locations.map((l: any) => ({
          value: l.id,
          label: l.name,
        }))
      );

      setVehicleOptions(
        vehicles.map((v: any) => ({
          value: v.id,
          label: v.registration,
        }))
      );
         setVehicleTypeOptions(
        vehicleTypes.map((v: any) => ({
          value: v.id,
          label: v.desc,
        })));

        setParty2GroupOptions(
        parties.map((v: any) => ({
          value: v.id,
          label: v.name,
        })));

        setPartyOptions(
        parties.map((v: any) => ({
          value: v.id,
          label: v.name,
        }))

      );
    } catch (err) {
      console.error("Dropdown load failed:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchDropdownData();
}, []);



const handleClose = () => {
  console.log("Closing form...");
  onClose();
}



const fetchFormData = async () => {         
   getTransport().then((res) => res?.json()).then((data)=>{
   console.log(data);
   console.log("Fields :", fields);

   let updatedData = fields.reduce((acc : any, field) => {
    console.log("Processing field:", field.name, "of type:", field.type, "with data:", data[field.name]);
     if (data[field.name] !== undefined) {
       if (field.type === "multiselect" && Array.isArray(data[field.name])) {
        console.log("Setting multiselect field:", field.name, "with data:", data[field.name]);
         acc[field.name] = data[field.name];
       } 
       if (field.type === "select" && Number.isNaN(data[field.name])) {
        console.log("Setting select field:", field.name, "with data:", data[field.name]);
         acc[field.name] = data[field.name];
       } 
       else {
         acc[field.name] = data[field.name]?.toString();
       }
     }

      return acc;
    }
    ,{});

    console.log("Updated Data:", updatedData);

    setFormData((p) => ({ ...p, ...updatedData }));
   }).catch((err)=>{
     console.error("Failed to fetch transport data:", err);
   });

  };

useEffect(() => {
  console.log("Fetching dropdown data...");
  const fetchDropdownData = async () => {
    try {
      setLoading(true);

      const [driverRes, locationRes, vehicleRes, vehicleTypeRes, partyRes] = await Promise.all([
        getDriver(),
        getLocation(),
        getVehicle(),
        getVehicleType(),
        getParty(),
      ]);

      if (!driverRes.ok || !locationRes.ok || !vehicleRes.ok) {
        throw new Error("One or more API calls failed");
      }

      const [drivers, locations, vehicles, vehicleTypes, parties] = await Promise.all([
        driverRes.json(),
        locationRes.json(),
        vehicleRes.json(),
        vehicleTypeRes.json(),
        partyRes.json(),
      ]);

      setDriverOptions(
        drivers.map((d: any) => ({
          value: d.id,
          label: d.name,
        }))
      );

      setLocationOptions(
        locations.map((l: any) => ({
          value: l.id,
          label: l.name,
        }))
      );
      setVehicleOptions(
        vehicles.map((v: any) => ({
          value: v.id,
          label: v.registration,
        }))
      );
      setVehicleTypeOptions(
        vehicleTypes.map((v: any) => ({
          value: v.id,
          label: v.desc,
        })));

      setParty2GroupOptions(
        parties.map((v: any) => ({
          value: v.id,
          label: v.name,
        })));

      setPartyOptions(
        parties.map((v: any) => ({
          value: v.id,
          label: v.name,
        }))

      );
    } catch (err) {
      console.error("Dropdown load failed:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchDropdownData();
  },[]);

useEffect(() => {
fetchFormData();
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
        <form className="transport-form">
          
          <h2>Transport Entry Form</h2>

  <div className="form-grid">
  {fields.map(({ name, type, label, options }) => {
    // ❌ Skip fields with no data
    if (formData[name] === "" || typeof formData[name] === "object" && (formData[name] as any).length === 0) {
      return null;
    }

    return (
      <div key={name}>
        {/* Show current value 
        <pre>{JSON.stringify(formData[name], null, 2)}</pre>*/}

        <label htmlFor={name}>{label}</label>

        {type === "select" && options ? (

          <Select
            instanceId={name}
            inputId={name}
            classNamePrefix="react-select"
            options={options}
            onChange={handleSelectChange(name,false)}
            value={options.find(o => o.value == formData[name])}
            />
        ) : type === "multiselect" && options ? (
          <Select
            instanceId={name}
            inputId={name}
            classNamePrefix="react-select"
            isMulti
            options={options}
            onChange={handleSelectChange(name,true)}
            value={options.filter(o =>
              formData[name]?.includes(o.value)
            )}

          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={formData[name]}
            onChange={handleInputChange}
          />
        )}
      </div>
    );
  })}
</div>
<div className="form-actions">
  <button type="button" onClick={handleClose}>Cancel</button>
<button type="submit">Submit</button>

</div>
</form>
</div>
      </div>
    

      );
};

export default TransportEntryForm;
