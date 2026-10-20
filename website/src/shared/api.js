const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  constructor() {
    this.baseUrl = API_URL;
    this.captureTokenFromUrl();
  }

  captureTokenFromUrl() {
    let token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      const match = window.location.pathname.match(/\/token=([A-Za-z0-9._-]+)/);
      if (match) token = match[1];
    }

    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, '', '/');
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (err) {
      return null;
    }
  }

  async request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error((data && data.error) || `Request failed with status ${response.status}`);
    }

    return data;
  }

  get(path) {
    return this.request(path);
  }

  post(path, body) {
    return this.request(path, { method: 'POST', body: JSON.stringify(body) });
  }
}

const api = new ApiClient();
export default api;
