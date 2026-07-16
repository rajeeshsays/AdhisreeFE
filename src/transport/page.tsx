'use client';
import React, { useEffect, useState } from 'react';
import {getTripAll } from '../app/services/tripService';

interface Trip {
  id: number;
  tripName: string;
  vehicleType: string;
  driverName: string;
  capacity: number;
  status: string;
}

const TripList = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await getTripAll(1,100);

      if (!res.ok) {
        throw new Error('Failed to fetch trips');
      }

      const data = await res.json();
      setTrips(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const handleEdit = (id: number) => {
  // navigate(`/trips/edit/${id}`)
  console.log('Edit trip', id);
};





  if (loading) return <p>Loading trips...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Trip List</h2>

      <table border={1} cellPadding={8} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>#</th>
            <th>Trip Name</th>
            <th>Vehicle Type</th>
            <th>Driver</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {trips.length === 0 ? (
            <tr>
              <td colSpan={7} align="center">No trips found</td>
            </tr>
          ) : (
            trips.map((t, index) => (
              <tr key={t.id}>
                <td>{index + 1}</td>
                <td>{t.tripName}</td>
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

export default TripList;
