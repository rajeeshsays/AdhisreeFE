import { baseUrl } from '../configs/apiConfig';
import { DistrictFormData } from '../types/types';


export async function getState() {
  console.log('Reached get state :');
  try {
    console.log("Calling:", `${baseUrl}/api/UtilityApi/getState`);
    const res = await fetch(`${baseUrl}/api/UtilityApi/getState`, {
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
export async function getDistrict(stateId : number) {
  console.log('Reached get district :');
  try {
    console.log("Calling:", `${baseUrl}/api/UtilityApi/getDistricts/${stateId}`);
    const res = await fetch(`${baseUrl}/api/UtilityApi/getDistricts/${stateId}`, {
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
export async function createDistrict(driverFormData : DistrictFormData) {
  console.log('Reached create district :'+ JSON.stringify(driverFormData));
  driverFormData.id = "0";

  try {
    console.log("Calling:", `${baseUrl}/api/UtilityApi/create`);
    const res = await fetch(`${baseUrl}/api/UtilityApi/create`, {
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
export async function deleteDistrict(id: number) {
  

  await fetch(`${baseUrl}/api/UtilityApi/${id}`, {
    method: 'DELETE'
  });
  console.log('District deleted:', id);
};

export async function updateDistrict(id: number, districtData : DistrictFormData) {


  console.log('inside updateDistrict ...Sending email content :', districtData);
  try {
    const res = await fetch(`${baseUrl}/api/UtilityApi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(districtData),
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
