'use client'
import React, { useEffect, useState } from "react";
import { getVehicleAlerts, deleteVehicleAlert } from "@/app/services/vehicleAlertService";
import {getVehicles} from "@/app/services/vehicleService";
import styles from "./vehicleAlertList.module.css";
import VehicleAlertsEntry from "./vehicleAlertEntry";
import { VehicleAlertFormData } from "@/app/types/types";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import button from "../../css/button.module.css";


export default function VehicleAlertsList() {
  const [alertsList, setAlertsList] = useState<any[]>([]);
  const [alertsFilteredList,setAlertsFilteredList] = useState<any[]>([])
  const [vehicleSelectList,setVehicleSelectList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<VehicleAlertFormData | undefined>(undefined);
  const [operationMode, setOperationMode] = useState('');
  const [selectedVehicleId,setSelectedVehicleId] = useState<string|null>(null);
  
  const router = useRouter();

  useEffect(()=>{
  if(operationMode=='Edit' && selectedAlert)
  {
   setIsModalOpen(true);
  }
  },[selectedAlert,operationMode])

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const response = await getVehicleAlerts();
        if (response.ok) {
          const data = await response.json();
          setAlertsList(data);
          setAlertsFilteredList(data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchAlerts();
  }, []);

  useEffect(()=>{
    async function fetchVehicleList() {
      let isMounted = true;
      try {
        const response = await getVehicles();
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setVehicleSelectList(data);
          }
        }

      } catch (error) {
        console.error(error);
      }
      return () => {
        isMounted = false;
      }
    }
    fetchVehicleList();
  },[])

  const handleAdd = () => {
    setSelectedAlert(undefined);
    setOperationMode('Add');
    setIsModalOpen(true);
  };

  const handleEdit = (alert: VehicleAlertFormData) => {
    console.log('Editing alert:', alert);
    // Convert dates to YYYY-MM-DD format for input
    alert.emiDueDate = alert.emiDueDate ? alert.emiDueDate.split('T')[0] : '';
    alert.insuranceExpiry = alert.insuranceExpiry ? alert.insuranceExpiry.split('T')[0] : '';
    alert.pollutionExpiry = alert.pollutionExpiry ? alert.pollutionExpiry.split('T')[0] : '';
    setSelectedAlert(alert);
    setOperationMode('Edit');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(undefined);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vehicle alert?")) return;
    try {
      await deleteVehicleAlert(id);
      setAlertsList(prev => prev.filter(t => t.id !== id));
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
    }
  };

  const handleChange = async (e : React.ChangeEvent<HTMLSelectElement|HTMLInputElement>)=>
  {
    const {name,value} = e.target;
    if(name =='vehicleId')
    {
       setSelectedVehicleId(value);
    }      

  }

  const handleFilter =  ()=>
  {
 
   let filteredList = alertsList;
   alert(selectedVehicleId);
   if(selectedVehicleId)
   {
    filteredList = filteredList.filter(x => x.vehicleId === selectedVehicleId)
   }
   setAlertsFilteredList(filteredList);
  }

  const handleClearFilter = ()=>
  {
  setAlertsFilteredList(alertsList);
  setSelectedVehicleId(null);
  }


  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚨 Vehicle Alerts</h1>

      <div className={styles.tableWrapper}>
        <button className={clsx(styles.addBtn, button.primaryBtn)} onClick={handleAdd}>
          + Add Alert
        </button>
        <button className={clsx(styles.addBtn, button.secondaryBtn)} onClick={() => router.push("/")}>
          Home
        </button>

        <label className={clsx(styles.label)}>Vehicle</label>
        <select
          name="vehicleId"
          value={selectedVehicleId?.toString()}
          onChange={handleChange}
          required
          className={clsx(styles.selectInput)}
        >
        <option value="">-- Select Vehicle --</option>

    {vehicleSelectList.map((driver) => (
      <option key={driver.value} value={driver.value}>
        {driver.label}
      </option>
    ))}
</select>
<button className={clsx(styles.addBtn,button.secondaryBtn)} onClick={handleFilter}>
  Filter
</button>
<button className={clsx(styles.addBtn,button.secondaryBtn)} onClick={handleClearFilter}>

  Clear Filter
</button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle ID</th>
              <th>EMI</th>
              <th>EMI Due Date</th>
              <th>Insurance Expiry</th>
              <th>Pollution Expiry</th>
              <th>Fuel Station</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {alertsFilteredList.length === 0 ? (
              <tr>
                <td colSpan={9} className={styles.empty}>
                  No vehicle alerts found
                </td>
              </tr>
            ) : (
              alertsFilteredList.map(alert => (
                <tr key={alert.id}>
                  <td>{alert.id}</td>
                  <td>{alert.vehicleId}</td>
                  <td>{alert.emi}</td>
                  <td>{alert.emiDueDate}</td>
                  <td>{alert.insuranceExpiry}</td>
                  <td>{alert.pollutionExpiry}</td>
                  <td>{alert.fuelStationName || "-"}</td>
                  <td>{alert.remarks || "-"}</td>
                  <td>
                    <div className={button.actionIcons}>
                      <button className={button.actionEdit} onClick={() => handleEdit(alert)}>
                        <FaEdit />
                      </button>
                      <button className={button.btnDelete} onClick={() => handleDelete(alert.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {isModalOpen && (
          <VehicleAlertsEntry
            vehicleAlert={selectedAlert}
            closeModal={closeModal}
          />
        )}
      </div>
    </div>
  );
}