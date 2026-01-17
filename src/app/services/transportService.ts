import { baseUrl } from '../configs/apiConfig';



export async function getTransport() {
  console.log('Reached get transport :');

  try {
    console.log("Calling:", `${baseUrl}/api/TransportEntryApi/get/1`);
    const res = await fetch(`${baseUrl}/api/TransportEntryApi/get/1`, {
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

export async function getTransportAll() {
  console.log('Reached get transport :');

  try {
    console.log("Calling:", `${baseUrl}/api/TransportEntryApi/getall/1/10`);
    const res = await fetch(`${baseUrl}/api/TransportEntryApi/getall/1/10`, {
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

export async function createTransport(transportData: any) {
  console.log('Reached get transport :');
  try {
    console.log("Calling:", `${baseUrl}/api/TransportEntryApi/create`);
    const res = await fetch(`${baseUrl}/api/TransportEntryApi/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transportEntry:transportData,destinationGroup : {} }),
    });

    return res; // <-- FIX
  } 
  catch (ex: any) {
    console.log(JSON.stringify(ex));
    throw ex; // optional
  }
}
export async function deleteTransport(id: number) {
  if (!window.confirm('Are you sure?')) return;

  await fetch(`${baseUrl}/api/transports/${id}`, {
    method: 'DELETE'
  });
  console.log('Transport deleted:', id);
};

export async function updateTransport(transportData : any) {

  console.log('Sending email content :', transportData);
  try {
    const res = await fetch(`${baseUrl}/api/TransportEntryApi/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transportEntry:transportData,destinationGroup : {} }),
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
    const res = await fetch(`${baseUrl}/api/TransportEntryApi/1`, {
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
const API_URL = "https://localhost:5001/api/transport";



