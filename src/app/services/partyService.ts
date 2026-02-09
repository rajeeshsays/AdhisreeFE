import { baseUrl } from '../configs/apiConfig';
import { PartyFormData } from '../types/types';

export async function getParty() {
  console.log('Reached get party :');

  try {
    console.log("Calling:", `${baseUrl}/api/partyApi/getparty`);
    const res = await fetch(`${baseUrl}/api/partyApi/getparty`, {
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
                                                                                                                                    

export async function getPartyAll(pageNumber: number, pageSize: number) {
  console.log('Reached get party :');

  try {
    console.log("Calling:", `${baseUrl}/api/PartyApi/getall/${pageNumber}/${pageSize}`);
    const res = await fetch(`${baseUrl}/api/PartyApi/getall/${pageNumber}/${pageSize}`, {
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

export async function createParty(partyFormData : PartyFormData) {
  console.log('Reached create party :'+ JSON.stringify(partyFormData));
  partyFormData.id = "0";

  if (!partyFormData.accountId || partyFormData.accountId === "0") {
    partyFormData.accountId = "0";
  }


  try {
    console.log("Calling:", `${baseUrl}/api/PartyApi/create`);
    const res = await fetch(`${baseUrl}/api/PartyApi/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partyFormData),
    });

    return res; // <-- FIX
  } 
  catch (ex: any) {
    console.log(JSON.stringify(ex));
    throw ex; // optional
  }
}
export async function deleteParty(id: number) {
  

  await fetch(`${baseUrl}/api/PartyApi/${id}`, {
    method: 'DELETE'
  });
  console.log('Party deleted:', id);
};

export async function updateParty(id: number, partyFormData : PartyFormData) {

  console.log('inside updateParty ...Sending email content :', partyFormData);

  if (!partyFormData.accountId || partyFormData.accountId === "0") {
    partyFormData.accountId = "0";
  }
  try {
    const res = await fetch(`${baseUrl}/api/PartyApi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partyFormData),
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
    const res = await fetch(`${baseUrl}/api/PartyApi/1`, {
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
