// js/api.js — All backend API calls

const API_BASE = 'http://localhost:5000'; // Change to your deployed backend URL

const api = {
  // ── Auth helpers ───────────────────────────────────────────────
  getToken: () => localStorage.getItem('signbridge_token'),
  setToken: (t) => localStorage.setItem('signbridge_token', t),
  setUser:  (u) => localStorage.setItem('signbridge_user', JSON.stringify(u)),
  getUser:  ()  => {
    try { return JSON.parse(localStorage.getItem('signbridge_user')); } catch { return null; }
  },
  clearAuth: () => {
    localStorage.removeItem('signbridge_token');
    localStorage.removeItem('signbridge_user');
  },

  // ── Base request ───────────────────────────────────────────────
  async request(path, options = {}) {
    const token = api.getToken();
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
      const msg = data.errors
        ? data.errors.map(e => e.message).join(', ')
        : data.message || 'An error occurred';
      throw new Error(msg);
    }
    return data;
  },

  // ── User endpoints ─────────────────────────────────────────────
  register(name, email, password) {
    return api.request('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login(email, password) {
    return api.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // ── Translation endpoints ──────────────────────────────────────
  saveTranslation(translatedText, sourceLanguage, confidence) {
    return api.request('/save-translation', {
      method: 'POST',
      body: JSON.stringify({ translatedText, sourceLanguage, confidence }),
    });
  },

  getHistory(page = 1, limit = 10, lang = '') {
    const params = new URLSearchParams({ page, limit });
    if (lang) params.set('lang', lang);
    return api.request(`/history?${params}`);
  },

  deleteTranslation(id) {
    return api.request(`/history/${id}`, { method: 'DELETE' });
  },
};
