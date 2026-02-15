import { baseUrl } from '../configs/apiConfig';
import {LocationFormData } from '../types/types';

export async function getLocation(id? :number) {
  console.log('Reached get location :');
  try {
    console.log("Calling:", `${baseUrl}/api/LocationApi/${id}`);
    const res = await fetch(`${baseUrl}/api/LocationApi/${id}`, {
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




export async function getLocations() {
  console.log('Reached get location :');
  try {
    console.log("Calling:", `${baseUrl}/api/LocationApi/getlocations`);
    const res = await fetch(`${baseUrl}/api/LocationApi/getlocations`, {
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



export async function getLocationAll(pageNumber: number, pageSize: number) {
  console.log('Reached get location :');

  try {
    console.log("Calling:", `${baseUrl}/api/LocationApi/getall/${pageNumber}/${pageSize}`);
    const res = await fetch(`${baseUrl}/api/LocationApi/getall/${pageNumber}/${pageSize}`, {
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

export async function createLocation(locationFormData : LocationFormData) {
  console.log('Reached create location :'+ JSON.stringify(locationFormData));
  //object destructuring 
  const { id, ...payload } = locationFormData;

  console.log(id);
  try {
    console.log("Calling:", `${baseUrl}/api/LocationApi`);
    const res = await fetch(`${baseUrl}/api/LocationApi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return res; // <-- FIX
  } 
  catch (ex: any) {
    console.log(JSON.stringify(ex));
    throw ex; // optional
  }
}
export async function deleteLocation(id: number) {

  await fetch(`${baseUrl}/api/LocationApi/${id}`, {
    method: 'DELETE'
  });
  console.log('Location deleted:', id);
};

export async function updateLocation(id: number, locationData : LocationFormData) {



  console.log('inside updateLocation ...Sending email content :', locationData);
  try {
    const res = await fetch(`${baseUrl}/api/LocationApi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationData),
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
    const res = await fetch(`${baseUrl}/api/LocationApi`, {
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
