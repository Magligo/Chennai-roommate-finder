const messages = {
    getMessages: () => apiRequest('/messages'),
    sendMessage: (receiver_id, message_text) => apiRequest('/messages/send', {
        method: 'POST',
        body: JSON.stringify({ receiver_id, message_text })
    })
};

const requests = {
    getRequests: () => apiRequest('/requests'),
    updateRequest: (id, status) => apiRequest(`/requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    })
};

window.messages = messages;
window.requests = requests;
