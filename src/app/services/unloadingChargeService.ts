import { baseUrl } from '../configs/apiConfig';

export async function getUnloadingChargeAll() {
  console.log('Reached get unloading charges :');
  try {
    console.log("Calling:", `${baseUrl}/api/UnloadingChargeApi/getall`);
    const res = await fetch(`${baseUrl}/api/UnloadingChargeApi/getall`, {
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
