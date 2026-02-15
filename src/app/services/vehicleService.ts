import { baseUrl } from '../configs/apiConfig';
import { VehicleFormData } from '../types/types';


export async function getVehicle(id:number) {
  console.log('Reached get vehicle :');
  try {
    console.log("Calling:", `${baseUrl}/api/VehicleApi/${id}`);
    const res = await fetch(`${baseUrl}/api/VehicleApi/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    return res; // <-- FIX
  } 
  catch (ex: any) {
    console.log(JSON.stringify(ex));
    throw ex; // optional
  }
}

export async function getVehicles() {
  console.log('Reached get vehicle :');
  try {
    console.log("Calling:", `${baseUrl}/api/VehicleApi/getVehicles`);
    const res = await fetch(`${baseUrl}/api/VehicleApi/getVehicles`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    return res; // <-- FIX
  } 
  catch (ex: any) {
    console.log(JSON.stringify(ex));
    throw ex; // optional
  }
}



export async function getVehicleAll(pageNumber: number, pageSize: number) {
  console.log('Reached get vehicle :');

  try {
    console.log("Calling:", `${baseUrl}/api/VehicleApi/getall/${pageNumber}/${pageSize}`);
    const res = await fetch(`${baseUrl}/api/VehicleApi/getall/${pageNumber}/${pageSize}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });


    return res; // <-- FIX
  } 
  catch (ex: any) {
    console.log(JSON.stringify(ex));
    throw ex; // optional
  }
}

export async function createVehicle(vehicleFormData : VehicleFormData) {
  console.log('Reached create vehicle :'+ JSON.stringify(vehicleFormData));


  try {
    console.log("Calling:", `${baseUrl}/api/VehicleApi`);
    const res = await fetch(`${baseUrl}/api/VehicleApi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleFormData),
    });

    return res; // <-- FIX
  } 
  catch (ex: any) {
    console.log(JSON.stringify(ex));
    throw ex; // optional
  }
}

export async function deleteVehicle(id: number) {

  const response = await fetch(`${baseUrl}/api/VehicleApi/${id}`, {
    method: 'DELETE'
  });
  console.log('Vehicle deleted:', id);


    if (!response.ok) {
      console.log(response)
    
  const contentType = response.headers.get("content-type");

  
  let message = "Internal server error";
  let detail;

  if (contentType && contentType.includes("application/json")) {
    const body = await response.json();
    message = body.message ?? message;
    detail = body.detail;
  } else {
    // 🔥 plain text fallback
    message = await response.text();
  }

  throw { status: response.status, message, detail };
  }
  // 204 No Content → nothing to return
  console.log('Vehicle deleted:', id);
};

export async function updateVehicle(id: number, vehicleData : VehicleFormData,) {
console.log('inside updateVehicle ...Sending email content :', vehicleData);
  try {
    const res = await fetch(`${baseUrl}/api/VehicleApi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleData),
    });

    const contentType = res.headers.get('content-type');
    const responseBody = contentType?.includes('application/json')
      ? await res.json()
      : await res.text();
     console.log(JSON.stringify(responseBody))

    if (!res.ok) {
      // Handle Badrequest error from api
      const errorMessage = '';

      if (responseBody?.error) {
        throw new Error(responseBody?.error + '. Request failed!');
      }
      throw new Error(errorMessage || 'Request failed! for unknown reason, need investigation');
    }

    console.log('Success response:', responseBody);
    return responseBody; //return parsed response

  } catch (err : any) {
    console.error('Error from service ', err.message);
    throw err; // re-throw for component to handle
  }
}

export async function parseContent(content : any) {

  console.log('Sending email content :', content);
  try {
    const res = await fetch(`${baseUrl}/api/VehicleApi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    const contentType = res.headers.get('content-type');
    const responseBody = contentType?.includes('application/json')
      ? await res.json()
      : await res.text();
     console.log(JSON.stringify(responseBody))
      
    if (!res.ok) {
      // Handle Badrequest error from api
      const errorMessage = '';
       
      if (responseBody?.error) {
        throw new Error(responseBody?.error + '. Request failed!');
      }
      throw new Error(errorMessage || 'Request failed! for unknown reason, need investigation');
    }
    
    console.log('Success response:', responseBody);
    return responseBody; //return parsed response

  } 
  catch (err : any) {
    console.error('Error from service ', err.message);
    throw err; // re-throw for component to handle
  }

}
