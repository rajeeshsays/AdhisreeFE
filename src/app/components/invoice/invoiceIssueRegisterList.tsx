'use client'
import React, { useEffect, useState } from "react";
import { getInvoiceAll } from "@/app/services/invoiceService";
import { getPartyAll } from "@/app/services/partyService";
import styles from "./invoiceIssueRegisterList.module.css";
import { InvoiceData } from "@/app/types/types";
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import button from "../../css/button.module.css"

export default function InvoiceIssueRegisterList() {
  const [invoiceList, setInvoiceList] = useState<InvoiceData[]>([]);
  const [invoiceFilteredList, setInvoiceFilteredList] = useState<InvoiceData[]>([]);
  const [partyList, setPartyList] = useState<any[]>([]);
  const [selectedPartyId, setSelectedPartyId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchInvoiceList = async () => {
      try {
        const response = await getInvoiceAll();
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        setInvoiceList(data);
        setInvoiceFilteredList(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching invoice list:", error.message);
        } else {
          console.error("Unknown error fetching invoice list");
        }
      }
    };

    fetchInvoiceList();
  }, []);

  useEffect(() => {
    const fetchPartyList = async () => {
      try {
        const response = await getPartyAll(1, 100);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        setPartyList(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching party list:", error.message);
        } else {
          console.error("Unknown error fetching party list");
        }
      }
    };

    fetchPartyList();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'fromDate') {
      setFromDate(value);
    }
    else if (name === 'toDate') {
      setToDate(value);
    }
    else if (name === 'partyId') {
      setSelectedPartyId(value);
    }
  };

  const handleFilter = () => {
    let filteredList = invoiceList;

    if (selectedPartyId) {
      filteredList = filteredList.filter(x => x.destinationId === parseInt(selectedPartyId));
    }

    if (fromDate) {
      filteredList = filteredList.filter(x => new Date(x.date) >= new Date(fromDate));
    }

    if (toDate) {
      filteredList = filteredList.filter(x => new Date(x.date) <= new Date(toDate));
    }

    setInvoiceFilteredList(filteredList);
  };

  const handleClearFilter = () => {
    setSelectedPartyId('');
    setFromDate('');
    setToDate('');
    setInvoiceFilteredList(invoiceList);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚚 Invoice Issue Register</h1>

      <div className={styles.tableWrapper}>
        <button className={clsx(styles.addBtn, button.secondaryBtn)} onClick={() => router.push("/")}>
          Home
        </button>

        <label className={clsx(styles.label)}>Target Location</label>
        <select
          name="partyId"
          value={selectedPartyId}
          onChange={handleChange}
          className={clsx(styles.selectInput)}
        >
          <option value="">-- Select Target Location --</option>
          {partyList.map((party) => (
            <option key={party.id} value={party.id}>
              {party.name}
            </option>
          ))}
        </select>

        <label className={clsx(styles.label)}>From Date</label>
        <input type="date" name="fromDate" value={fromDate} className={clsx(styles.dateInput)} onChange={handleChange} />
        <label className={clsx(styles.label)}>To Date</label>
        <input type="date" name="toDate" value={toDate} className={clsx(styles.dateInput)} onChange={handleChange} />

        <button className={clsx(styles.addBtn, button.secondaryBtn)} onClick={handleFilter}>
          Filter
        </button>
        <button className={clsx(styles.addBtn, button.secondaryBtn)} onClick={handleClearFilter}>
          Clear Filter
        </button>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Invoice No</th>
              <th>Date</th>
              <th>Vehicle</th>
              <th>Target Location</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {invoiceFilteredList.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No invoice records found
                </td>
              </tr>
            ) : (
              invoiceFilteredList.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.invoiceNo}</td>
                  <td>{invoice.date ? new Date(invoice.date).toLocaleDateString() : '-'}</td>
                  <td>
                    <span className={styles.badge}>
                      {invoice.tripEntry?.vehicle?.registration || '-'}
                    </span>
                  </td>
                  <td>{invoice.destination?.name || '-'}</td>
                  <td className={styles.amount}>₹ {invoice.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
