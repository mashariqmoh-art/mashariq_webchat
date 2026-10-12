const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function buildUrl(url) {
  if (!url) {
    return API_BASE_URL;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

async function request(url, method = 'GET', body = null) {
  const headers = { Accept: 'application/json' };
  const token = localStorage.getItem('token');

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body !== null) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(buildUrl(url), {
    method,
    headers,
    body: body === null ? undefined : JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed');
  }

  return payload;
}

export default {
  get(url) {
    return request(url, 'GET');
  },

  post(url, body) {
    return request(url, 'POST', body);
  },

  put(url, body) {
    return request(url, 'PUT', body);
  },

  del(url) {
    return request(url, 'DELETE');
  },
};
