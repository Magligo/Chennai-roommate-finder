const API_URL = 'http://localhost:5000/api';

const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json();
    if (!response.ok) {
        // If token is invalid or expired, clear session and redirect to login
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            alert('Your session has expired. Please log in again.');
            window.location.href = 'login.html';
            return;
        }
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
};

const auth = {
    signup: (data) => apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    getProfile: () => apiRequest('/auth/profile')
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
};

window.auth = auth;
window.logout = logout;
window.apiRequest = apiRequest;
