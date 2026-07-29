import { baseUrl } from '../configs/apiConfig';
import { STORAGE_KEY } from '../context/AuthContext';

export function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return {};
  try {
    const parsed = JSON.parse(stored);
    return parsed.token ? { Authorization: `Bearer ${parsed.token}` } : {};
  } catch {
    return {};
  }
}

export async function login(username: string, password: string) {
  try {
    const res = await fetch(`${baseUrl}/api/AuthApi/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res;
  } catch (ex: any) {
    console.error('Error logging in:', ex);
    throw ex;
  }
}

export async function getMe(token: string) {
  try {
    const res = await fetch(`${baseUrl}/api/AuthApi/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  } catch (ex: any) {
    console.error('Error fetching current user:', ex);
    throw ex;
  }
}
