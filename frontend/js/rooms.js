const rooms = {
    getAll: (params = '') => apiRequest(`/rooms?${params}`),
    getById: (id) => apiRequest(`/rooms/${id}`),
    post: (data) => {
        const isFormData = data instanceof FormData;
        return apiRequest('/rooms', {
            method: 'POST',
            body: isFormData ? data : JSON.stringify(data)
        });
    },
    delete: (id) => apiRequest(`/rooms/${id}`, { method: 'DELETE' })
};

const requestRoom = async (roomId, ownerId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    if (user.id === ownerId) {
        alert("You cannot request your own room!");
        return;
    }

    try {
        await apiRequest('/requests', {
            method: 'POST',
            body: JSON.stringify({ room_id: roomId, owner_id: ownerId })
        });
        alert('Request sent successfully! You can also message the owner.');
    } catch (err) {
        alert(err.message);
    }
};

const deleteRoom = async (roomId) => {
    if (!confirm('Are you sure you want to delete this room listing?')) return;

    try {
        await rooms.delete(roomId);
        alert('Room deleted successfully!');
        if (typeof loadRooms === 'function') {
            loadRooms();
        } else {
            window.location.reload();
        }
    } catch (err) {
        alert(err.message);
    }
};

window.rooms = rooms;
window.requestRoom = requestRoom;
window.deleteRoom = deleteRoom;
