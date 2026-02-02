'use client';
import { get } from 'http';
import React, { useEffect, useState } from 'react';
import {getTransportAll } from '../app/services/transportService';
interface Transport {
  id: number;
  transportName: string;
  vehicleType: string;
  driverName: string;
  capacity: number;
  status: string;
}

const TransportList = () => {
  const [transports, setTransports] = useState<Transport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransports();
  }, []);

  const fetchTransports = async () => {
    try {
      const res = await getTransportAll(1,100);

      if (!res.ok) {
        throw new Error('Failed to fetch transports');
      }

      const data = await res.json();
      setTransports(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const handleEdit = (id: number) => {
  // navigate(`/transports/edit/${id}`)
  console.log('Edit transport', id);
};





  if (loading) return <p>Loading transports...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Transport List</h2>

      <table border={1} cellPadding={8} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>#</th>
            <th>Transport Name</th>
            <th>Vehicle Type</th>
            <th>Driver</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {transports.length === 0 ? (
            <tr>
              <td colSpan={7} align="center">No transports found</td>
            </tr>
          ) : (
            transports.map((t, index) => (
              <tr key={t.id}>
                <td>{index + 1}</td>
                <td>{t.transportName}</td>
                <td>{t.vehicleType}</td>
                <td>{t.driverName}</td>
                <td>{t.capacity}</td>
                <td>{t.status}</td>
                <td>
                  <button onClick={() => handleEdit(t.id)}>Edit</button>
                  {/* <button onClick={() => handleDelete(t.id)}>Delete</button> */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransportList;
