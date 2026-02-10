import { baseUrl } from '../configs/apiConfig';
import { DriverFormData } from '../types/types';



export async function getDriver() {
  console.log('Reached get driver :');
  try {
    console.log("Calling:", `${baseUrl}/api/DriverApi/getdriver`);
    const res = await fetch(`${baseUrl}/api/DriverApi/getdriver`, {
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



export async function getDriverAll(pageNumber: number, pageSize: number) {
  console.log('Reached get driver :');

  try {
    console.log("Calling:", `${baseUrl}/api/DriverApi/getall/${pageNumber}/${pageSize}`);
    const res = await fetch(`${baseUrl}/api/DriverApi/getall/${pageNumber}/${pageSize}`, {
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

export async function createDriver(driverFormData : DriverFormData) {
  console.log('Reached create driver :'+ JSON.stringify(driverFormData));
  driverFormData.id = "0";

  try {
    console.log("Calling:", `${baseUrl}/api/DriverApi/create`);
    const res = await fetch(`${baseUrl}/api/DriverApi/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driverFormData),
    });

    return res; // <-- FIX
  } 
  catch (ex: any) {
    console.log(JSON.stringify(ex));
    throw ex; // optional
  }
}

export async function deleteDriver(id: number) {

  const response = await fetch(`${baseUrl}/api/DriverApi/${id}`, {
    method: 'DELETE'
  });
  console.log('Driver deleted:', id);


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
  console.log('Driver deleted:', id);
};

export async function updateDriver(id: number, driverData : DriverFormData,) {
console.log('inside updateDriver ...Sending email content :', driverData);
  try {
    const res = await fetch(`${baseUrl}/api/DriverApi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driverData),
    });

    const contentType = res.headers.get('content-type');
    const responseBody = contentType?.includes('application/json')
      ? await res.json()
      : await res.text();
     console.log(JSON.stringify(responseBody))

    if (!res.ok) {
      // Handle Badrequest error from api
      let errorMessage = '';

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
    const res = await fetch(`${baseUrl}/api/DriverApi`, {
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
      let errorMessage = '';
       
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
