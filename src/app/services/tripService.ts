import { baseUrl } from '../configs/apiConfig';
import { TripEntryFormData } from '../types/types';



export async function getTrip(id: number) {
  console.log('Reached get trip :');

  try {
    console.log("Calling:", `${baseUrl}/api/TripEntryApi/get/${id}`);
    const res = await fetch(`${baseUrl}/api/TripEntryApi/get/${id}`, {
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

export async function getTripAll(pageNumber: number, pageSize: number) {
  console.log('Reached get trip :');

  try {
    console.log("Calling:", `${baseUrl}/api/TripEntryApi/getall/${pageNumber}/${pageSize}`);
    const res = await fetch(`${baseUrl}/api/TripEntryApi/getall/${pageNumber}/${pageSize}`, {
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

export async function createTrip(tripData : TripEntryFormData) {
  console.log('Reached get trip :'+ console.log(tripData));


  try {
    console.log("Calling:", `${baseUrl}/api/TripEntryApi/create`);
    const res = await fetch(`${baseUrl}/api/TripEntryApi/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripEntry:tripData,destinationGroup : {destinationIds : tripData.destinationGroups} }),
    });

    return res; // <-- FIX
  } 
  catch (ex: any) {
    console.log(JSON.stringify(ex));
    throw ex; // optional
  }
}
export async function deleteTrip(id: number) {
  

  return await fetch(`${baseUrl}/api/trips/${id}`, {
    method: 'DELETE'
  });
  console.log('Trip deleted:', id);
};

export async function updateTrip(id: number, tripData : TripEntryFormData,) {

  tripData.destinationGroups =  tripData.destinationGroups.toString().split(',');
   console.log('destination groups :' + tripData.destinationGroups);
    console.log('destination groups :' + tripData.destinationGroups.toString().split(','));
  console.log('inside updateTrip ...Sending email content :', tripData);
  try {
    const res = await fetch(`${baseUrl}/api/TripEntryApi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripEntry:tripData,destinationGroup : { destinationIds : tripData.destinationGroups} }),
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
    const res = await fetch(`${baseUrl}/api/TripEntryApi/1`, {
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




