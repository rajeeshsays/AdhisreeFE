"use client";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { createTrip,updateTrip } from "../../services/tripService";
import "./tripEdit.css";
import { getDriverAll } from "../../services/driverService";
import { getLocations } from "../../services/locationService";
import { getVehicles } from "../../services/vehicleService";
import { getVehicleTypes} from "../../services/vehicleTypeService";
import { getParties } from "../../services/partyService";
import styles from "./trip.module.css";
import { InvoiceDetail, TripEntryFormData, TripEntryPayload, UnLoadingCharge } from "@/app/types/types";
import { FaTrash } from "react-icons/fa";

const Select = dynamic(() => import("react-select"), { ssr: false });

interface FieldOption {
  value: string;
  label: string;
}
interface DriverOption extends FieldOption {
  transportTypeId: string;
}
const TripEntryForm = ({trip,closeModal}:{trip:TripEntryFormData | undefined,closeModal:()=>void}) => {

const tripData : TripEntryFormData = {
      id: 0,
      date: "",
      vehicleId: "",
      vehicleTypeId: "",
      driverId: "",
      party1: "",
      destinationGroup: [],
      from: "",
      to: "",
      fromText : "",
      toText : "",
      startKM: "",
      closeKM: "",
      total: "",
      rent : "",
      payabletoThirdParty : "",
      commission: "",
      invoiceDetails: [],
      unloadingCharges: [],
      returnTrip : "",
      haltDays:"",
      remark : ""
    };
  
const [formData, setFormData] = useState<TripEntryFormData>(trip ?? tripData);
const [invoiceForm, setInvoiceForm] = useState({ invoiceNo: "", date: "", amount: "" });
const [destinationCharges, setDestinationCharges] = useState<UnLoadingCharge[]>(trip?.unloadingCharges ?? []);
const [invoiceRows, setInvoiceRows] = useState<InvoiceDetail[]>(trip?.invoiceDetails ?? []);
const [driverOptions, setDriverOptions] = useState<DriverOption[]>([]);
const [selectedDriverTransportTypeId, setSelectedDriverTransportTypeId] = useState("");
const [locationOptions, setLocationOptions] = useState<FieldOption[]>([]);
const [vehicleOptions, setVehicleOptions] = useState<FieldOption[]>([]);
const [vehicleTypeOptions, setVehicleTypeOptions] = useState<FieldOption[]>([]);
const [party2GroupOriginalOptions, setParty2GroupOriginalOptions] = useState<FieldOption[]>([]);
const [party2GroupOptions, setParty2GroupOptions] = useState<FieldOption[]>([]);
const [partyOptions, setPartyOptions] = useState<FieldOption[]>([]);

//const [loading, setLoading] = useState(true);

  const fields: {
  name: keyof TripEntryFormData;
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
    name: "destinationGroup",
    type: "multiselect",
    label: "Destination Group",
    options: party2GroupOptions,
  },
  { name: "from", type: "select", label: "From", options: locationOptions },
  { name: "to", type: "select", label: "To", options: locationOptions },
  { name: "startKM", type: "number", label: "Start KM" },
  { name: "closeKM", type: "number", label: "Close KM" },
  { name: "total", type: "number", label: "Total" },
  { name:"haltDays",type:"number",label:"Halt Days"},
  { name: "rent", type: "number", label: "Rent" },
  { name: "commission", type: "number", label: "commission" },
  { name: "payabletoThirdParty", type: "number", label: "Payable to TP" },

];

const totalInvoiceAmount = useMemo(
  () => invoiceRows.reduce((sum, row) => sum + Number(row.amount || 0), 0),
  [invoiceRows]
);

const selectedDestinationOptions = useMemo(
  () => party2GroupOptions.filter((option) => formData.destinationGroup.includes(option.value)),
  [party2GroupOptions, formData.destinationGroup]
);

const isThirdPartyDriver = selectedDriverTransportTypeId === "2";

useEffect(() => {
  if (!formData.driverId) return;
  const currentDriver = driverOptions.find((o) => o.value === String(formData.driverId));
  if (currentDriver) setSelectedDriverTransportTypeId(currentDriver.transportTypeId);
}, [driverOptions]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "startKM" || name === "closeKM") {
      const startKM = name === "startKM" ? parseFloat(value) : parseFloat(formData.startKM as string);
      const closeKM = name === "closeKM" ? parseFloat(value) : parseFloat(formData.closeKM as string);
      const total = !isNaN(startKM) && !isNaN(closeKM) ? (closeKM - startKM).toString() : "";
      setFormData((p) => ({ ...p, [name]: value, total }));
      return;
    }

    if(name == "rent" )
    {
      const payableToThirdparty = (parseFloat(value) - (parseFloat(formData["commission"]) || 0)).toString();
      setFormData((p) => ({
      ...p,
      [name]: value,
      "payabletoThirdParty" :payableToThirdparty}));
      return;
    }

    else if(name == "commission")
    {
       const commission = parseFloat(value) || 0;
       const rent = parseFloat(formData["rent"]) || 0;
       if(rent < commission )
       {
       alert("Rent should always be a greated value");
       return;
       }
       const payableToThirdparty = (rent-commission).toString();

     setFormData((p) => ({
      ...p,
      [name]: value,
      "payabletoThirdParty" : payableToThirdparty,
      }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

const handleClose = () => {
  console.log("Closing form...");
  closeModal();
}

const handleInvoiceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setInvoiceForm((prev) => ({ ...prev, [name]: value }));
};

const handleAddInvoice = () => {
  if (!invoiceForm.invoiceNo.trim() || !invoiceForm.date || !invoiceForm.amount.trim()) {
    return;
  }

  const parsedAmount = Number(invoiceForm.amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
    return;
  }

  const newRow: InvoiceDetail = {
    invoiceNo: invoiceForm.invoiceNo.trim(),
    date: invoiceForm.date,
    amount: parsedAmount.toFixed(2),
  };

  const nextRows = [...invoiceRows, newRow];
  setInvoiceRows(nextRows);
  setFormData((prev) => ({ ...prev, invoiceDetails: nextRows }));
  setInvoiceForm({ invoiceNo: "", date: "", amount: "" });
};

const handleDeleteInvoice = (indexToRemove: number) => {
  const nextRows = invoiceRows.filter((_, index) => index !== indexToRemove);
  setInvoiceRows(nextRows);
  setFormData((prev) => ({ ...prev, invoiceDetails: nextRows }));
};



//useEffect(() => {  
 //  console.log("Fetching form data..."); 
//   console.log(trip);
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
//}, [trip]);


const handleDestinationChargeChange = (destinationValue: string, value: string) => {
  const nextCharges = { ...destinationCharges, [destinationValue]: value };
  setDestinationCharges(nextCharges);
  setFormData((prev) => ({ ...prev, unloadCharges: nextCharges }));
};

const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
      const payload:  TripEntryPayload = {
        id: formData.id || undefined,
        date: formData.date,
        vehicleId: formData.vehicleId,
        vehicleTypeId: formData.vehicleTypeId,
        driverId: formData.driverId,
        party1: formData.party1,
        from: formData.from,
        to: formData.to,
        startKM: formData.startKM,
        closeKM: formData.closeKM,
        total: formData.total,
        commission: formData.commission,
        returnTrip: formData.returnTrip,
        haltDays: formData.haltDays,
        rent: formData.rent,
        remark: formData.remark,
       destinationGroup: formData.destinationGroup.map((destinationId: string) => ({
  id: "",
  destinationId,
  tripId: "" // or the appropriate tripId value
})),
        invoiceDetails: formData.invoiceDetails.map((row) => ({
          id: "",
          invoiceNo: row.invoiceNo,
          date: row.date,
          amount: row.amount
        })),
        unloadingCharges: formData.unloadingCharges.map((row) => ({
          id: "",
          tripId: row.tripId,
          destinationId: row.destinationId,
          amount: row.amount
        })),
        payabletoThirdParty: ""
      }
console.log(payload);
    const response = formData.id
      ? await updateTrip(formData.id, payload)
      : await createTrip(payload);

    if (response.ok) {
      const resBody = await response.json();
      alert(JSON.stringify(resBody));
    } else {
      const errText = await response.text();
      alert(errText || "Failed to save trip");
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
        getDriverAll(1, 1000),
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
          value: String(d.id),
          label: d.name,
          transportTypeId: String(d.transportTypeId),
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

      setParty2GroupOriginalOptions(
        parties.map((v: any) => ({
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
  
  
  if (name === "driverId") {
    setSelectedDriverTransportTypeId(selected?.transportTypeId ?? "");
    setFormData((prev: any) => ({ ...prev, driverId: selected?.value ?? null }));
    return;
  }

  if (name === "destinationGroups") {
const selectedValues = selected?.map((item: any) => item.value) || [];
    const nextCharges = Object.fromEntries(
      Object.entries(destinationCharges).filter(([key]) => selectedValues.includes(key))
    );

    setDestinationCharges(nextCharges);
    setFormData((prev: any) => ({
      ...prev,
      destinationGroups: selectedValues,

      unloadCharges: nextCharges,
    }));
    return;
  }
  setFormData((prev: any) => ({
    ...prev,
    [name]: isMulti
      ? selected?.map((item: any) => item.value) || []
      : selected?.value ?? null,
  }));
 if(name=="party1")
  {
    alert("Party one is selected "+ selected?.value);
    setParty2GroupOptions(party2GroupOriginalOptions.filter(x=>x.value!== selected?.value));

    
   }

};


return (
  <div className={styles.overlay}>
    <div className={styles.modal}>
      <form onSubmit={handleSave} className="trip-form">
        <h2>Trip Entry Form</h2>

        <div className="form-grid">
          {fields
            .filter(({ name }) =>
              ["rent", "commission", "payabletoThirdParty"].includes(name) ? isThirdPartyDriver : true
            )
            .map(({ name, type, label, options }) => {
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
                      (o) => o.value === String(formData[name] ?? "")
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
                    value={options?.filter((o) =>
                      (formData[name] as string[] | undefined)?.includes(o.value)
                    )}
                  />
                ) : (
                  <input
                    id={name}
                    name={name}
                    type={type}
                    value={String(formData[name] ?? "")}
                    onChange={handleInputChange}
                    readOnly={name === "total"}
                  />
                )}
              </div>
            );
          })}
        </div>

        {selectedDestinationOptions.length > 0 && (
          <div style={{ gridColumn: "1 / -1", marginTop: 8 }}>
            <h3 style={{ marginBottom: 12 }}>Unloading Charges by Destination</h3>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {selectedDestinationOptions.map((option) => (
                <div key={option.value}>
                  <label htmlFor={`destination-charge-${option.value}`} style={{ display: "block", marginBottom: 4 }}>
                    {option.label}
                  </label>
                  <input
                    id={`destination-charge-${option.value}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={destinationCharges[option.value] ?? ""}
                    onChange={(e) => handleDestinationChargeChange(option.value, e.target.value)}
                    placeholder="0.00"
                    style={{ width: "100%", padding: 8 }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <label>Return Trip
            <input
                    id="returnTrip"
                    name="returnTrip"
                    type="text"
                    value={String(formData.returnTrip ?? "")}
                    onChange={handleInputChange}
                    placeholder = "Describe your return"
                    style={{ width: "100%", padding: 8 }}
                  />
            </label>
        </div>
        <div style={{ gridColumn: "1 / -1", marginTop: 12 }}>
          <h3 style={{ marginBottom: 12 }}>Invoice Details</h3>

          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginBottom: 16, padding: 16, border: "1px solid #ddd", borderRadius: 8, background: "#fafafa" }}>
            <div>
              <label htmlFor="invoiceNo" style={{ display: "block", marginBottom: 4 }}>Invoice No</label>
              <input
                id="invoiceNo"
                name="invoiceNo"
                value={invoiceForm.invoiceNo}
                onChange={handleInvoiceInputChange}
                placeholder="Enter invoice no"
                style={{ width: "100%", padding: 8 }}
              />
            </div>

            <div>
              <label htmlFor="invoiceDate" style={{ display: "block", marginBottom: 4 }}>Date</label>
              <input
                id="invoiceDate"
                name="date"
                type="date"
                value={invoiceForm.date}
                onChange={handleInvoiceInputChange}
                style={{ width: "100%", padding: 8 }}
              />
            </div>

            <div>
              <label htmlFor="invoiceAmount" style={{ display: "block", marginBottom: 4 }}>Amount</label>
              <input
                id="invoiceAmount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={invoiceForm.amount}
                onChange={handleInvoiceInputChange}
                placeholder="0.00"
                style={{ width: "100%", padding: 8 }}
              />
            </div>

            <div >
              <button type="button" onClick={handleAddInvoice} style={{ width: "100%", padding: "10px 12px" }}>
                Add Invoice
              </button>
            </div>
          </div>

          {invoiceRows.length === 0 ? (
            <p style={{ color: "#666" }}>No invoice details added yet.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f2f2f2" }}>
                  <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Invoice No</th>
                  <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>Date</th>
                  <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "right" }}>Amount</th>
                  <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoiceRows.map((row, index) => (
                  <tr key={`${row.invoiceNo}-${index}`}>
                    <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.invoiceNo}</td>
                    <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.date}</td>
                    <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "right" }}>
                      {Number(row.amount).toFixed(2)}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteInvoice(index)}
                        style={{ padding: "6px 10px", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: 4, background: "#fef2f2", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                        aria-label="Delete invoice"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "#f8f8f8" }}>
                  <td style={{ border: "1px solid #ddd", padding: 8, fontWeight: 600 }} colSpan={2}>Total</td>
                  <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "right", fontWeight: 600 }}>
                    {totalInvoiceAmount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
            <div>
              <label htmlFor="remark" style={{ display: "block", marginBottom: 4 }}>Remark</label>
              <input
                id="remark"
                name="remark"
                type="text"
                value={invoiceForm.amount}
                onChange={handleInvoiceInputChange}
                placeholder="Enter remark if any"
                style={{ width: "100%", padding: 8,height:"100px" }}
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
};
export default TripEntryForm;
