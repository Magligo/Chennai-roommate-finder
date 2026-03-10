const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const navLinks = document.getElementById('nav-links');
    if (navLinks) {
        if (token && user) {
            navLinks.innerHTML = `
                <a href="index.html" class="nav-link">Home</a>
                <a href="rooms.html" class="nav-link">Find Room</a>
                <a href="dashboard.html" class="nav-link">Dashboard</a>
                <a href="messages.html" class="nav-link" style="display:flex;align-items:center;gap:0.4rem;">
                    Messages <span id="unread-badge" style="display:none;background:var(--accent);color:#fff;font-size:0.75rem;font-weight:700;padding:0.1rem 0.5rem;border-radius:12px;">0</span>
                </a>
                <a href="profile.html" class="nav-link" style="color:var(--primary);font-weight:600;">${user.name}</a>
                <button onclick="logout()" class="btn-secondary" style="padding:0.4rem 1rem;font-size:0.875rem;">Logout</button>
            `;
            updateUnreadCount();
        } else {
            navLinks.innerHTML = `
                <a href="index.html" class="nav-link">Home</a>
                <a href="rooms.html" class="nav-link">Find Room</a>
                <a href="login.html" class="nav-link">Login</a>
                <a href="signup.html" class="btn-primary" style="padding:0.5rem 1.25rem;">Sign Up</a>
            `;
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
