// API Utility for communicating with WordPress REST API

// Use the localized settings if available, otherwise fallback to relative
const API_BASE = window.redoyMpdApiSettings ? `${window.redoyMpdApiSettings.root}mpd/v1` : '/wp-json/mpd/v1';

const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json'
    };
    if (window.redoyMpdApiSettings && window.redoyMpdApiSettings.nonce) {
        headers['X-WP-Nonce'] = window.redoyMpdApiSettings.nonce;
    }
    return headers;
};

export const api = {
    async get(endpoint) {
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    },

    async post(endpoint, data) {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        const responseData = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(responseData.message || 'Network response was not ok');
        }
        return responseData;
    },

    async delete(endpoint) {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        const responseData = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(responseData.message || 'Network response was not ok');
        }
        return responseData;
    }
};
