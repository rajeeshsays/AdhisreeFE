import { baseUrl } from '../configs/apiConfig';
import { getAuthHeader } from './authService';

export async function downloadBackup() {
  try {
    const res = await fetch(`${baseUrl}/api/BackupApi/backup`, {
      method: 'GET',
      headers: { ...getAuthHeader() },
    });
    return res;
  } catch (ex: any) {
    console.error('Error downloading backup:', ex);
    throw ex;
  }
}

export async function restoreBackup(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${baseUrl}/api/BackupApi/restore`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    return res;
  } catch (ex: any) {
    console.error('Error restoring backup:', ex);
    throw ex;
  }
}
