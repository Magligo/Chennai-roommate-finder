const messages = {
    getConversations: () => apiRequest('/conversations'),
    getConversationById: (id) => apiRequest(`/conversations/${id}`),
    getMessagesByConversation: (id) => apiRequest(`/messages/${id}`),
    getUnreadCount: () => apiRequest('/messages/unread-count'),
    markRead: (id) => apiRequest(`/messages/mark-read/${id}`, { method: 'PUT' }),
    sendMessage: (conversation_id, message_text) => apiRequest('/messages/send', {
        method: 'POST',
        body: JSON.stringify({ conversation_id, message_text })
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
