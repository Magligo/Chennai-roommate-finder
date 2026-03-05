const API_URL = 'http://localhost:5000/api';

const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        return data;
    },

    auth: {
        signup: (data) => api.request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
        login: (data) => api.request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
        getProfile: () => api.request('/auth/profile')
    },

    rooms: {
        getAll: (params = '') => api.request(`/rooms?${params}`),
        getById: (id) => api.request(`/rooms/${id}`),
        post: (data) => api.request('/rooms', { method: 'POST', body: JSON.stringify(data) })
    },

    social: {
        getMessages: () => api.request('/messages'),
        sendMessage: (receiver_id, message_text) => api.request('/messages/send', {
            method: 'POST',
            body: JSON.stringify({ receiver_id, message_text })
        }),
        getRequests: () => api.request('/requests'),
        sendRequest: (data) => api.request('/requests', { method: 'POST', body: JSON.stringify(data) }),
        updateRequest: (id, status) => api.request(`/requests/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        })
    }
};

// Global Auth Check
const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const navLinks = document.getElementById('nav-links');
    if (navLinks) {
        if (token && user) {
            navLinks.innerHTML = `
                <a href="index.html" class="text-gray-700 hover:text-blue-600 font-medium transition">Home</a>
                <a href="rooms.html" class="text-gray-700 hover:text-blue-600 font-medium transition">Find Room</a>
                <a href="dashboard.html" class="text-gray-700 hover:text-blue-600 font-medium transition">Dashboard</a>
                <a href="messages.html" class="text-gray-700 hover:text-blue-600 font-medium transition">Messages</a>
                <div class="flex items-center gap-3 ml-4 border-l pl-6 border-gray-200">
                    <a href="profile.html" class="font-medium text-blue-600">${user.name}</a>
                    <button onclick="logout()" class="text-red-500 hover:text-red-600">Logout</button>
                </div>
            `;
        }
    }
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
};

document.addEventListener('DOMContentLoaded', checkAuth);
window.logout = logout;
window.api = api;
