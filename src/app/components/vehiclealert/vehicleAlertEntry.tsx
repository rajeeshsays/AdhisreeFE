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

const insuranceStatusOptions: FieldOption[] = [
  { value: "1", label: "Active" },
  { value: "2", label: "Expired" },
];

const pollutionStatusOptions: FieldOption[] = [
  { value: "1", label: "Active" },
  { value: "2", label: "Expired" },
];

const calcDaysLeft = (dateStr?: string): number => {
  if (!dateStr) return 0;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const  VehicleAlertEntry = ({vehicleAlert,closeModal,onSaved,existingVehicleIds}:{vehicleAlert:VehicleAlertFormData | undefined,closeModal:()=>void,onSaved?:()=>void,existingVehicleIds?:(string|number)[]}) => {

    const isEditMode = !!vehicleAlert;


    const vehiclealertData : VehicleAlertFormData = {
        id: 0,                // optional for new entries
        vehicleId: 0,           // reference to Vehicle
        emi: null,                 // decimal → number
        emiDueDate: null,          // DateOnly → string YYYY-MM-DD
        emiDaysLeft: null,
        insuranceExpiry: "",     // DateOnly → string
        insuranceDaysLeft: 0,
        insuranceStatus: "",
        pollutionExpiry: "",     // DateOnly → string
        pollutionDaysLeft: 0,
        pollutionStatus: "",
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
  {
    name: "vehicleId",
    type: "select",
    label: "Vehicle No",
    options: vehicleOptions.filter(
      o =>
        !existingVehicleIds?.some(id => String(id) === String(o.value)) ||
        String(o.value) === String(formData.vehicleId)
    ),
  },
  { name: "emi", type: "number", label: "EMI" },
  { name: "emiDueDate", type: "date", label:"EMI Due Date"},
  { name: "emiDaysLeft", type: "number", label: "Overdue in days"},
  { name: "insuranceExpiry", type: "date", label: "Insurance Expiry"},
  { name: "insuranceDaysLeft", type: "number", label: "Days Left For Ins Renewal"},
  { name: "insuranceStatus", type: "select", label: "Insurance Status", options: insuranceStatusOptions},
  { name: "pollutionExpiry", type: "date", label: "Pollution Expiry"},
  { name: "pollutionDaysLeft", type: "number", label: "Days Left For Pollution Retest"},
  { name: "pollutionStatus", type: "select", label: "Pollution Status", options: pollutionStatusOptions},
  { name: "fuelStationName", type: "text", label: "Fuel Station Name" },
  { name: "remarks", type: "textarea", label: "Remarks" }

];




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
   console.log(vehicleAlert);

}, [vehicleAlert]);

useEffect(() => {
  const emiDaysLeft = formData.emiDueDate ? calcDaysLeft(formData.emiDueDate) : null;
  if(emiDaysLeft == null)
  {
setFormData((p) =>  ({ ...p , emiDaysLeft :  0 } ));
  }
  else
  {
  setFormData((p) => (p.emiDaysLeft === emiDaysLeft  ? p:  { ...p, emiDaysLeft } ));
  }

}, [formData.emiDueDate]);

useEffect(() => {
  const insuranceDaysLeft = calcDaysLeft(formData.insuranceExpiry);
  setFormData((p) => ({
    ...p,
    insuranceDaysLeft,
    insuranceStatus: insuranceDaysLeft < 0 ? "2" : "1",
  }));
}, [formData.insuranceExpiry]);

useEffect(() => {
  const pollutionDaysLeft = calcDaysLeft(formData.pollutionExpiry);
  setFormData((p) => ({
    ...p,
    pollutionDaysLeft,
    pollutionStatus: pollutionDaysLeft < 0 ? "2" : "1",
  }));
}, [formData.pollutionExpiry]);


const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  try {

  if (formData.emiDueDate && Number(formData.emi) <= 0) {
    alert("EMI must be greater than 0 when an EMI due date is selected.");
    return;
  }

  console.log("formdata te list " +formData)

   //const response =  await createTransport(formData);
    const response = formData.id
      ? await updateVehicleAlert(formData.id, formData)
      : await createVehicleAlert(formData);

    if (response.ok) {
      alert(formData.id ? "Vehicle alert updated successfully." : "Vehicle alert saved successfully.");
      onSaved?.();
      closeModal();
    } else {
      alert("Failed to save vehicle alert.");
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
                    isDisabled={name === "vehicleId" && isEditMode}
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
                    rows={5}
                  />
                ) : (
                  <input
                    id={name}
                    name={name}
                    type={type}
                    value={formData[name] ?? ""}
                    onChange={handleInputChange}
                    readOnly={name === "emiDaysLeft" || name === "insuranceDaysLeft" || name === "pollutionDaysLeft"}
                    required={name === "emiDueDate" && (formData.emi ?? 0) > 0 }
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
