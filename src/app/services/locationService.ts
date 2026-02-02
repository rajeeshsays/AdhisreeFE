import { baseUrl } from '../configs/apiConfig';

export async function getLocation() {
  console.log('Reached get location :');

  try {
    console.log("Calling:", `${baseUrl}/api/LocationApi/getlocation`);
    const res = await fetch(`${baseUrl}/api/LocationApi/getlocation`, {
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

export async function parseContent(content : any) {

  console.log('Sending email content :', content);
  try {
    const res = await fetch(`${baseUrl}/api/LocationApi/1`, {
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
