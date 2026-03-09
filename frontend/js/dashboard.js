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
                <a href="messages.html" class="text-gray-700 hover:text-blue-600 font-medium transition flex items-center gap-1">
                    Messages <span id="unread-badge" class="hidden bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">0</span>
                </a>
                <div class="flex items-center gap-3 ml-4 border-l pl-6 border-gray-200">
                    <a href="profile.html" class="font-medium text-blue-600">${user.name}</a>
                    <button onclick="logout()" class="text-red-500 hover:text-red-600">Logout</button>
                </div>
            `;
            updateUnreadCount();
        }
    }
};

const updateUnreadCount = async () => {
    try {
        const { unreadCount } = await messages.getUnreadCount();
        const badge = document.getElementById('unread-badge');
        if (badge) {
            if (unreadCount > 0) {
                badge.innerText = unreadCount;
                badge.classList.remove('hidden');

                // Show one-time notification if on dashboard or home
                const hasNotified = sessionStorage.getItem('notifiedUnread');
                if (!hasNotified && (window.location.pathname.includes('dashboard.html') || window.location.pathname.includes('index.html'))) {
                    alert(`You have ${unreadCount} new message(s) from roommate requests.`);
                    sessionStorage.setItem('notifiedUnread', 'true');
                }
            } else {
                badge.classList.add('hidden');
            }
        }
    } catch (err) {
        console.error('Error fetching unread count:', err);
    }
};

document.addEventListener('DOMContentLoaded', checkAuth);
window.checkAuth = checkAuth;
