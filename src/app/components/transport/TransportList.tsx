"use client";

import React, { useEffect, useState } from "react";
import { getTransportAll,deleteTransport} from "@/app/services/transportService";
import styles from "./transportList.module.css";
import TransportEntryForm from "@/app/components/transport/TransportEntryForm";
import { useRouter } from "next/navigation";
import button from "../../css/button.module.css"
import clsx from "clsx"
import { FaEdit,FaTrash } from "react-icons/fa";
export default function TransportList() {
  const [transportList, setTransportList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<any | null>(null);
  const router = useRouter();
  useEffect(() => {
    async function fetchTransportList() {
      try {
        const response = await getTransportAll(1,100);
        if (response.ok) {
          const data = await response.json();
          setTransportList(data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchTransportList();
  }, []);

const handleAdd = () => {
  setSelectedTransport(null);
  setIsModalOpen(true);
};

const handleEdit = (transport: any) => {
  console.log('Editing transport:', transport);
  setSelectedTransport(transport);
  setIsModalOpen(true);
};
  const closeModal = ()=>
  {
  setIsModalOpen(false);
  setSelectedTransport(null);
  }
const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this transport?")) return;

  await deleteTransport(id);
  setTransportList(prev => prev.filter(t => t.id !== id));
};






  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Transport List</h1>

      <div className={styles.tableWrapper}>
        <button className={clsx(styles.addBtn,button.primaryBtn)} onClick={handleAdd}>
  + Add Location
</button>
  <button className={clsx(styles.addBtn,button.secondaryBtn)} onClick={()=>router.push("/")}>
  Home
</button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Vehicle</th>
              <th>Registration</th>
              <th>From</th>
              <th>To</th>
              <th>Total KM</th>
              <th>Rent</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {transportList.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty}>
                  No transport records found
                </td>
              </tr>
            ) : (
              transportList.map((transport) => (
                <tr key={transport.id}>
                  <td>{transport.id}</td>
                  <td>{new Date(transport.date).toLocaleDateString()}</td>
                  <td>{transport.vehicle?.model}</td>
                  <td>
                    <span className={styles.badge}>
                      {transport.vehicle?.registration}
                    </span>
                  </td>
                  <td>{transport.fromText}</td>
                  <td>{transport.toText}</td>
                  <td>{transport.total}</td>
                  <td className={styles.amount}>₹ {transport.rent}</td>
                  <td>
     
    <div className={button.actionIcons}>
     <button className={button.actionEdit} onClick={() => handleEdit(transport)}>
        <FaEdit />
      </button>

      <button className={button.btnDelete} onClick={() => handleDelete(transport.id)}>
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
  <TransportEntryForm
    transport={selectedTransport}
    closeModal={closeModal}
  />
)}





      </div>
    </div>
  );
}
