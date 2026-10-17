"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { createTrip,updateTrip } from "../../services/tripService";
import { createDriverLedger, deleteDriverLedger } from "../../services/driverLedgerService";
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
const getTodayDate = () => new Date().toLocaleDateString('en-CA');

const TripEntryForm = ({trip,closeModal}:{trip:TripEntryFormData | null | undefined,closeModal:()=>void}) => {

const tripData : TripEntryFormData = {
      id: 0,
      date: getTodayDate(),
      vehicleId: "",
      vehicleTypeId: "",
      driverId: "",
      party1: "-1",
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
      remark : "",
      voucherId: null
    };
  
const [formData, setFormData] = useState<TripEntryFormData>(trip ?? tripData);
const [invoiceForm, setInvoiceForm] = useState({ invoiceNo: "", date: "", amount: "" });
const [destinationCharges, setDestinationCharges] = useState<Record<string, string>>(
  Object.fromEntries((trip?.unloadingCharges ?? []).map((uc) => [uc.destinationId, String(uc.amount)]))
);
const [destinationReceived, setDestinationReceived] = useState<Record<string, boolean>>(
  Object.fromEntries((trip?.unloadingCharges ?? []).map((uc) => [uc.destinationId, uc.received ?? true]))
);
const [invoiceRows, setInvoiceRows] = useState<InvoiceDetail[]>(trip?.invoiceDetails ?? []);
const [driverOptions, setDriverOptions] = useState<DriverOption[]>([]);
const [selectedDriverTransportTypeId, setSelectedDriverTransportTypeId] = useState("");

const [locationOptions, setLocationOptions] = useState<FieldOption[]>([]);
const [vehicleOptions, setVehicleOptions] = useState<FieldOption[]>([]);
const [vehicleTypeOptions, setVehicleTypeOptions] = useState<FieldOption[]>([]);
const [party2GroupOriginalOptions, setParty2GroupOriginalOptions] = useState<FieldOption[]>([]);
const [party2GroupOptions, setParty2GroupOptions] = useState<FieldOption[]>([]);
const [partyOriginalOptions, setPartyOriginalOptions] = useState<FieldOption[]>([]);
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
  { name: "driverId", type: "select", label: "Driver (Transporter)", options: driverOptions },
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
  () => party2GroupOptions.filter((option) => formData.destinationGroup.includes(String(option.value))),
  [party2GroupOptions, formData.destinationGroup]
);

const isThirdPartyDriver = selectedDriverTransportTypeId === "2";

useEffect(() => {
  if (!formData.driverId) return;
  const currentDriver = driverOptions.find((o) => o.value === String(formData.driverId));
  if (currentDriver) setSelectedDriverTransportTypeId(currentDriver.transportTypeId);
}, [formData.driverId, driverOptions]);

useEffect(() => {
  if (!formData.party1) {
    setParty2GroupOptions(party2GroupOriginalOptions);
    return;
  }
  setParty2GroupOptions(
    party2GroupOriginalOptions.filter((x) => String(x.value) !== String(formData.party1))
  );
}, [party2GroupOriginalOptions, formData.party1]);

useEffect(() => {
  setPartyOptions(
    partyOriginalOptions.filter((x) => !formData.destinationGroup.includes(String(x.value)))
  );
}, [partyOriginalOptions, formData.destinationGroup]);
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

const invoiceNoRef = useRef<HTMLInputElement>(null);
const invoiceDateRef = useRef<HTMLInputElement>(null);
const invoiceAmountRef = useRef<HTMLInputElement>(null);

const handleInvoiceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  e.target.setCustomValidity("");
  setInvoiceForm((prev) => ({ ...prev, [name]: value }));
};

const handleAddInvoice = () => {
  if (!invoiceForm.invoiceNo.trim()) {
    invoiceNoRef.current?.setCustomValidity("Invoice No is required");
    invoiceNoRef.current?.reportValidity();
    return;
  }

  if (!invoiceForm.date) {
    invoiceDateRef.current?.setCustomValidity("Date is required");
    invoiceDateRef.current?.reportValidity();
    return;
  }

  const parsedAmount = Number(invoiceForm.amount);
  if (!invoiceForm.amount.trim() || !Number.isFinite(parsedAmount) || parsedAmount < 0) {
    invoiceAmountRef.current?.setCustomValidity("Enter a valid amount");
    invoiceAmountRef.current?.reportValidity();
    return;
  }

  const newRow: InvoiceDetail = {
    invoiceNo: invoiceForm.invoiceNo.trim(),
    date: invoiceForm.date,
    amount: parsedAmount.toFixed(2),
    received: true,
  };

  const nextRows = [...invoiceRows, newRow];
  setInvoiceRows(nextRows);
  setFormData((prev) => ({ ...prev, invoiceDetails: nextRows }));
  setInvoiceForm({ invoiceNo: "", date: "", amount: "" });
};

const handleToggleInvoiceReceived = (indexToToggle: number, checked: boolean) => {
  const nextRows = invoiceRows.map((row, index) =>
    index === indexToToggle ? { ...row, received: checked } : row
  );
  setInvoiceRows(nextRows);
  setFormData((prev) => ({ ...prev, invoiceDetails: nextRows }));
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


const buildUnloadingCharges = (
  charges: Record<string, string>,
  received: Record<string, boolean>
): UnLoadingCharge[] =>
  Object.entries(charges)
    .filter(([, amount]) => amount !== "")
    .map(([destinationId, amount]) => ({
      tripId: String(formData.id ?? ""),
      destinationId,
      amount: Number(amount),
      received: received[destinationId] ?? true,
    }));

const handleDestinationChargeChange = (destinationValue: string, value: string) => {
  const nextCharges = { ...destinationCharges, [destinationValue]: value };
  setDestinationCharges(nextCharges);

  const unloadingCharges = buildUnloadingCharges(nextCharges, destinationReceived);

  setFormData((prev) => ({ ...prev, unloadingCharges }));
};

const handleDestinationReceivedChange = (destinationValue: string, checked: boolean) => {
  const nextReceived = { ...destinationReceived, [destinationValue]: checked };
  setDestinationReceived(nextReceived);

  const unloadingCharges = buildUnloadingCharges(destinationCharges, nextReceived);

  setFormData((prev) => ({ ...prev, unloadingCharges }));
};

// Party1 and destinationGroup ("Party 2") are optional: -1 is the sentinel "no party
// selected" value backed by a seeded Party row, so they're excluded from this check.
const requiredReferenceFields: { name: keyof TripEntryFormData; label: string }[] = [
  { name: "vehicleId", label: "Vehicle No" },
  { name: "vehicleTypeId", label: "Vehicle Type" },
  { name: "driverId", label: "Driver (Transporter)" },
  { name: "from", label: "From" },
  { name: "to", label: "To" },
];

const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();

  const missingField = requiredReferenceFields.find(
    ({ name }) => !formData[name] || Number(formData[name]) <= 0
  );
  if (missingField) {
    alert(`Please select ${missingField.label}.`);
    return;
  }

  try {
      // Third-party driver payments are tracked as driver-ledger entries. Since a ledger
      // entry has no tripId of its own, we replace it wholesale on every save (delete the
      // previous one referenced by voucherId, create a fresh one) rather than trying to
      // patch it in place, and store the new entry's id back on the trip as voucherId.
      let voucherId: number | null = formData.voucherId ?? null;

      if (isThirdPartyDriver) {
        if (voucherId) {
          try {
            await deleteDriverLedger(voucherId);
          } catch (err) {
            console.error(err);
          }
        }
        const ledgerRes = await createDriverLedger({
          transactionDate: formData.date,
          paymentType: "Salary",
          driverId: Number(formData.driverId),
          amount: Number(formData.payabletoThirdParty || 0),
          originalBalance: 0,
          balance: 0,
          remarks: `Third-party payment for trip dated ${formData.date}`,
        });
        if (!ledgerRes.ok) {
          throw new Error("Failed to record third-party driver payment");
        }
        const ledgerBody = await ledgerRes.json();
        voucherId = ledgerBody?.id ?? null;
      } else if (voucherId) {
        try {
          await deleteDriverLedger(voucherId);
        } catch (err) {
          console.error(err);
        }
        voucherId = null;
      }

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
        destinationGroups: formData.destinationGroup.length > 0
          ? formData.destinationGroup.map((destinationId: string) => Number(destinationId))
          : [-1],
        invoices: formData.invoiceDetails.map((row) => ({
          invoiceNo: row.invoiceNo,
          date: row.date,
          amount: row.amount,
          received: row.received ?? true
        })),
        unloadingCharges: formData.unloadingCharges.map((row) => ({
          id: "",
          tripId: row.tripId,
          destinationId: row.destinationId,
          amount: row.amount,
          received: row.received ?? true
        })),
        payabletoThirdParty: "",
        voucherId,
      }
    if (formData.id) {
      await updateTrip(formData.id, payload);
    } else {
      await createTrip(payload);
    }
    setFormData((prev) => ({ ...prev, voucherId }));
    alert(formData.id ? "Trip updated successfully." : "Trip saved successfully.");
    closeModal();
  } catch (error) {
    console.error(error);
    alert(error instanceof Error ? error.message : "Failed to save trip");
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
        drivers.map((d: any) => {
          const transportTypeId = String(d.transportTypeId);
          return {
            value: String(d.id),
            label: transportTypeId === "2" ? `${d.name} (Thirdparty)` : d.name,
            transportTypeId,
          };
        })
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

      const realParties = parties.filter((v: any) => Number(v.value) !== -1);

      setParty2GroupOriginalOptions(
        realParties.map((v: any) => ({
          value: v.value,
          label: v.label,
        })));

      setParty2GroupOptions(
        realParties.map((v: any) => ({
          value: v.value,
          label: v.label,
        })));

      setPartyOriginalOptions(
        realParties.map((v: any) => ({
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

  if (name === "destinationGroup") {
    const selectedValues = selected?.map((item: any) => String(item.value)) || [];
    const nextCharges = Object.fromEntries(
      Object.entries(destinationCharges).filter(([key]) => selectedValues.includes(key))
    );
    const nextReceived = Object.fromEntries(
      Object.entries(destinationReceived).filter(([key]) => selectedValues.includes(key))
    );
    const unloadingCharges = buildUnloadingCharges(nextCharges, nextReceived);

    setDestinationCharges(nextCharges);
    setDestinationReceived(nextReceived);
    setFormData((prev: any) => ({
      ...prev,
      destinationGroup: selectedValues,
      unloadingCharges,
    }));
    return;
  }
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
      <form onSubmit={handleSave} className="trip-form">
        <h2>Trip Entry Form</h2>

        <div className="form-grid">
          {trip && (
            <div>
              <label htmlFor="tripCode">Trip Code</label>
              <input
                id="tripCode"
                name="tripCode"
                type="text"
                value={formData.tripCode ?? ""}
                readOnly
              />
            </div>
          )}
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
                      (o) => String(o.value) === String(formData[name] ?? "")
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
                      (formData[name] as string[] | undefined)?.includes(String(o.value))
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
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                    <label
                      htmlFor={`destination-received-${option.value}`}
                      style={{ display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", fontSize: 13 }}
                    >
                      <input
                        id={`destination-received-${option.value}`}
                        type="checkbox"
                        checked={destinationReceived[option.value] ?? true}
                        onChange={(e) => handleDestinationReceivedChange(option.value, e.target.checked)}
                      />
                      Received
                    </label>
                  </div>
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
                ref={invoiceNoRef}
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
                ref={invoiceDateRef}
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
                ref={invoiceAmountRef}
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
                  <th style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>Received</th>
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
                      <input
                        type="checkbox"
                        checked={row.received ?? true}
                        onChange={(e) => handleToggleInvoiceReceived(index, e.target.checked)}
                        aria-label={`Mark invoice ${row.invoiceNo} as received`}
                      />
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
                  <td style={{ border: "1px solid #ddd", padding: 8 }} colSpan={2}></td>
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
                value={formData.remark}
                onChange={handleInputChange}
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
