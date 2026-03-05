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

document.addEventListener('DOMContentLoaded', checkAuth);
window.checkAuth = checkAuth;
