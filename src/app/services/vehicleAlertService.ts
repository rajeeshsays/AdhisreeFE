import { baseUrl } from '../configs/apiConfig';
import { VehicleAlertFormData } from '../types/types';

// Get single VehicleAlert by id
export async function getVehicleAlert(id: number) {
  try {
    console.log(`Calling: ${baseUrl}/api/VehicleAlerts/${id}`);
    const res = await fetch(`${baseUrl}/api/VehicleAlerts/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return res;
  } catch (ex: any) {
    console.error('Error fetching VehicleAlert:', ex);
    throw ex;
  }
}

// Get all VehicleAlerts
export async function getVehicleAlerts() {
  try {
    console.log(`Calling: ${baseUrl}/api/VehicleAlerts`);
    const res = await fetch(`${baseUrl}/api/VehicleAlerts`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return res;
  } catch (ex: any) {
    console.error('Error fetching VehicleAlerts:', ex);
    throw ex;
  }
}

// Create a new VehicleAlert
export async function createVehicleAlert(vehicleAlertData: VehicleAlertFormData) {
  try {
    console.log('Creating VehicleAlert:', vehicleAlertData);
    const res = await fetch(`${baseUrl}/api/VehicleAlerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleAlertData),
    });
    return res;
  } catch (ex: any) {
    console.error('Error creating VehicleAlert:', ex);
    throw ex;
  }
}

// Update an existing VehicleAlert
export async function updateVehicleAlert(id: number, vehicleAlertData: VehicleAlertFormData) {
  try {
    console.log(`Updating VehicleAlert ${id}:`, vehicleAlertData);
    const res = await fetch(`${baseUrl}/api/VehicleAlerts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleAlertData),
    });

    const contentType = res.headers.get('content-type');
    const responseBody = contentType?.includes('application/json')
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      const errorMessage = responseBody?.error ?? 'Unknown error';
      throw new Error(errorMessage);
    }

    return responseBody;
  } catch (err: any) {
    console.error('Error updating VehicleAlert:', err.message);
    throw err;
  }
}

// Delete a VehicleAlert
export async function deleteVehicleAlert(id: number) {
  try {
    const res = await fetch(`${baseUrl}/api/VehicleAlerts/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const contentType = res.headers.get('content-type');
      let message = 'Internal server error';
      if (contentType?.includes('application/json')) {
        const body = await res.json();
        message = body.message ?? message;
      } else {
        message = await res.text();
      }
      throw { status: res.status, message };
    }

    console.log('VehicleAlert deleted:', id);
  } catch (err: any) {
    console.error('Error deleting VehicleAlert:', err.message);
    throw err;
  }
}