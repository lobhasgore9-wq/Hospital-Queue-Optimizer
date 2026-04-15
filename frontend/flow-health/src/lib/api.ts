const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const TIMEOUT_MS = 10000; // 10 seconds — Render free tier can be slow to wake up

function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timeoutId));
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      detail = body.detail || JSON.stringify(body);
    } catch { /* ignore parse errors */ }
    throw new Error(`API Error (${response.status}): ${detail}`);
  }
  return await response.json();
}

export const api = {
  get: async (endpoint: string) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('API GET request failed:', error);
      throw error;
    }
  },

  post: async (endpoint: string, data: any) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('API POST request failed:', error);
      throw error;
    }
  },

  patch: async (endpoint: string, data: any) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('API PATCH request failed:', error);
      throw error;
    }
  }
};
