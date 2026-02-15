"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createTransport,updateTransport } from "../../services/transportService";
import "./transportEdit.css";
import { getDrivers } from "../../services/driverService";
import { getLocations } from "../../services/locationService";
import { getVehicles } from "../../services/vehicleService";
import { getVehicleTypes} from "../../services/vehicleTypeService";
import { getParties } from "../../services/partyService";
import styles from "./transport.module.css";
import { TransportEntryFormData } from "@/app/types/types";
const Select = dynamic(() => import("react-select"), { ssr: false });



interface FieldOption {
  value: string;
  label: string;
}
const TransportEntryForm = ({id,closeModal}:{id:number,closeModal:()=>void}) => {

  
    const transportData : TransportEntryFormData = {
      id: 0,
      date: "",
      vehicleId: "",
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
  
const [formData, setFormData] = useState<TransportEntryFormData>(transportData as TransportEntryFormData);
const [driverOptions, setDriverOptions] = useState<FieldOption[]>([]);
const [locationOptions, setLocationOptions] = useState<FieldOption[]>([]);
const [vehicleOptions, setVehicleOptions] = useState<FieldOption[]>([]);
const [vehicleTypeOptions, setVehicleTypeOptions] = useState<FieldOption[]>([]);
const [party2GroupOptions, setParty2GroupOptions] = useState<FieldOption[]>([]);
const [partyOptions, setPartyOptions] = useState<FieldOption[]>([]);
//const [loading, setLoading] = useState(true);

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
const handleClose = () => {
  console.log("Closing form...");
  closeModal();
}

useEffect(() => {  
   console.log("Fetching form data..."); 
//  const fetchDropdownData = async () => {
//     try {
//       //setLoading(true);

//       const [driverRes, locationRes, vehicleRes, vehicleTypeRes, partyRes] = await Promise.all([
//         getDrivers(),
//         getLocations(),
//         getVehicle(),
//         getVehicleType(),
//         getParty(),
//       ]);

//       if (!driverRes.ok || !locationRes.ok || !vehicleRes.ok) {
//         throw new Error("One or more API calls failed");
//       }

//       const [drivers, locations, vehicles, vehicleTypes, parties] = await Promise.all([
//         driverRes.json(),
//         locationRes.json(),
//         vehicleRes.json(),
//         vehicleTypeRes.json(),
//         partyRes.json(),
//       ]);

//       setDriverOptions(
//         drivers.map((d: any) => ({
//           value: d.value,
//           label: d.label,
//         }))
//       );

//       setLocationOptions(
//         locations.map((l: any) => ({
//           value: l.value,
//           label: l.label,
//         }))
//       );

//       setVehicleOptions(
//         vehicles.map((v: any) => ({
//           value: v.value,
//           label: v.label,
//         }))
//       );
//          setVehicleTypeOptions(
//         vehicleTypes.map((v: any) => ({
//           value: v.value,
//           label: v.label,
//         })));

//         setParty2GroupOptions(
//         parties.map((v: any) => ({
//           value: v.value,
//           label: v.label,
//         })));

//         setPartyOptions(
//         parties.map((v: any) => ({
//           value: v.value,
//           label: v.label,
//         }))

//       );
//     } catch (err) {
//       console.error("Dropdown load failed:", err);
//     } finally {
//       //setLoading(false);
//     }
//   };
//   fetchDropdownData();
// 
}, []);


const handleSave = async () => {
  try {

  console.log("formdata te list " +formData)

   //const response =  await createTransport(formData);
    const response = id
      ? await updateTransport(id, formData)
      : await createTransport(formData);

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

      const [driverRes, locationRes, vehicleRes, vehicleTypeRes, partyRes] = await Promise.all([
        getDrivers(),
        getLocations(),
        getVehicles(),
        getVehicleTypes(),
        getParties(),
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
          value: d.value,
          label: d.label,
        }))
      );

      setLocationOptions(
        locations.map((l: any) => ({
          value: l.value,
          label: l.label,
        }))
      );
      setVehicleOptions(
        vehicles.map((v: any) => ({
          value: v.value,
          label: v.label,
        }))
      );
      setVehicleTypeOptions(
        vehicleTypes.map((v: any) => ({
          value: v.value,
          label: v.label,
        })));

      setParty2GroupOptions(
        parties.map((v: any) => ({
          value: v.value,
          label: v.label,
        })));

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
      <form className="transport-form">
        <h2>Transport Entry Form</h2>

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
                    value={options?.filter(o =>
                      formData[name]?.includes(o.value)
                    )}
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
          <button type="submit" onClick={handleSave}>
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
);

};

export default TransportEntryForm;
