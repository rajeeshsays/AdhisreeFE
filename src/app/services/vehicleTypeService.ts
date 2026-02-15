import { baseUrl } from '../configs/apiConfig';
import { VehicleTypeFormData } from '../types/types';

export async function getVehicleType(id:number) {
  console.log('Reached get vehicle :');
  try {
    console.log("Calling:", `${baseUrl}/api/VehicleTypeApi/${id}`);
    const res = await fetch(`${baseUrl}/api/VehicleTypeApi/${id}`, {
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



export async function getVehicleTypes() {
  console.log('Reached get vehicle :');
  try {
    console.log("Calling:", `${baseUrl}/api/VehicleTypeApi/getVehicleTypes`);
    const res = await fetch(`${baseUrl}/api/VehicleTypeApi/getVehicleTypes`, {
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


export async function getVehicleTypeAll(pageNumber: number, pageSize: number) {
  console.log('Reached get vehicle type :');

  try {
    console.log("Calling:", `${baseUrl}/api/VehicleTypeApi/getall/${pageNumber}/${pageSize}`);
    const res = await fetch(`${baseUrl}/api/VehicleTypeApi/getall/${pageNumber}/${pageSize}`, {
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

export async function createVehicleType(vehicleTypeFormData : VehicleTypeFormData) {
  console.log('Reached create vehicle :'+ JSON.stringify(vehicleTypeFormData));


  try {
    console.log("Calling:", `${baseUrl}/api/VehicleTypeApi`);
    const res = await fetch(`${baseUrl}/api/VehicleTypeApi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleTypeFormData),
    });

    return res; // <-- FIX
  } 
  catch (ex: any) {
    console.log(JSON.stringify(ex));
    throw ex; // optional
  }
}

export async function deleteVehicleType(id: number) {

  const response = await fetch(`${baseUrl}/api/VehicleTypeApi/${id}`, {
    method: 'DELETE'
  });
  console.log('Vehicle type deleted:', id);


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
  console.log('Vehicle  type deleted:', id);
};

export async function updateVehicleType(id: number, vehicleTypeData : VehicleTypeFormData,) {
console.log('inside updateVehicle ...Sending email content :', vehicleTypeData);
  try {
    const res = await fetch(`${baseUrl}/api/VehicleTypeApi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleTypeData),
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
    const res = await fetch(`${baseUrl}/api/VehicleTypeApi`, {
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
