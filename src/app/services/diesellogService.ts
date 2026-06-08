import { baseUrl } from '../configs/apiConfig';
import { DieselLogFormData } from '../types/types';


export async function getDieselLog(id: number) {
  try {
    console.log(`Calling: ${baseUrl}/api/DieselLog/${id}`);
    const res = await fetch(`${baseUrl}/api/DieselLog/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return res;
  } catch (ex: any) {
    console.error('Error fetching DieselLog:', ex);
    throw ex;
  }
}

export async function getDieselLogs() {
  try {
    console.log(`Calling: ${baseUrl}/api/DieselLog`);
    const res = await fetch(`${baseUrl}/api/DieselLog`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return res;
  } catch (ex: any) {
    console.error('Error fetching DieselLogs:', ex);
    throw ex;
  }
}

export async function createDieselLog(dieselLogData: DieselLogFormData) {
  try {
    console.log('Creating DieselLog:', dieselLogData);
    const res = await fetch(`${baseUrl}/api/DieselLog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dieselLogData),
    });
    return res;
  } catch (ex: any) {
    console.error('Error creating DieselLog:', ex);
    throw ex;
  }
}

export async function updateDieselLog(id: number, dieselLogData: DieselLogFormData) {
  try {
    console.log(`Updating DieselLog ${id}:`, dieselLogData);
    const res = await fetch(`${baseUrl}/api/DieselLog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dieselLogData),
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
    console.error('Error updating DieselLog:', err.message);
    throw err;
  }
}

export async function deleteDieselLog(id: number) {
  try {
    const res = await fetch(`${baseUrl}/api/DieselLog/${id}`, {
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

    console.log('DieselLog deleted:', id);
  } catch (err: any) {
    console.error('Error deleting DieselLog:', err.message);
    throw err;
  }
}