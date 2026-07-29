import { baseUrl } from '../configs/apiConfig';
import { UserAccountFormData } from '../types/types';
import { getAuthHeader } from './authService';

export async function getUsers() {
  try {
    const res = await fetch(`${baseUrl}/api/AuthApi/users`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    });
    return res;
  } catch (ex: any) {
    console.error('Error fetching users:', ex);
    throw ex;
  }
}

export async function createUser(userData: UserAccountFormData) {
  try {
    const res = await fetch(`${baseUrl}/api/AuthApi/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(userData),
    });
    return res;
  } catch (ex: any) {
    console.error('Error creating user:', ex);
    throw ex;
  }
}

export async function changePassword(id: number, newPassword: string) {
  try {
    const res = await fetch(`${baseUrl}/api/AuthApi/users/${id}/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ newPassword }),
    });
    return res;
  } catch (ex: any) {
    console.error('Error changing password:', ex);
    throw ex;
  }
}
