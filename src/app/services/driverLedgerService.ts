import { baseUrl } from '../configs/apiConfig';
import { DriverLedgerActualData, DriverLedgerFormData } from '../types/types';



export async function getdriverLedger(id? :number) {
  console.log('Reached get driver :');
  try {
    console.log("Calling:", `${baseUrl}/api/DriverLedgerApi/${id}`);
    const res = await fetch(`${baseUrl}/api/DriverLedgerApi/${id}`, {
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

export async function getDriverLedgerAll() {
  console.log('Reached get driver :');
  try {
    console.log("Calling:", `${baseUrl}/api/DriverLedgerApi/getall`);
    const res = await fetch(`${baseUrl}/api/DriverLedgerApi/getall`, {
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
    


export async function createDriverLedger(driverFormData : DriverLedgerFormData) {

  let driverLedgerActualData : DriverLedgerActualData = {
    driverId: driverFormData.driverId,
    transactionDate: driverFormData.transactionDate,
    debit: driverFormData.paymentType === 'Advance' ? driverFormData.amount : 0,
    credit: driverFormData.paymentType === 'Salary' ? driverFormData.amount : 0,
    remarks: driverFormData.remarks
  };

  console.log('Reached create driver :'+ JSON.stringify(driverFormData));
  try {
    console.log("Calling:", `${baseUrl}/api/DriverLedgerApi`);
    const res = await fetch(`${baseUrl}/api/DriverLedgerApi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driverLedgerActualData),
    });
    return res; // <-- FIX
  } 
  catch (ex: any) {
    console.log(JSON.stringify(ex));
    throw ex; // optional
  }
}



export async function deleteDriverLedger(id: number) {

  const response = await fetch(`${baseUrl}/api/DriverLedgerApi/${id}`, {
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



