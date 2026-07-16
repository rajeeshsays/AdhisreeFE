import { baseUrl } from '../configs/apiConfig';

export async function getInvoiceAll() {
  console.log('Reached get invoices :');
  try {
    console.log("Calling:", `${baseUrl}/api/InvoiceApi/getall`);
    const res = await fetch(`${baseUrl}/api/InvoiceApi/getall`, {
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
