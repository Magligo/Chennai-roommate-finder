const fetch = require('node-fetch');

async function testSendMessage() {
    try {
        console.log("Testing backend...");

        // 1. Login as user1
        let res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'suresh@example.com', password: 'password123' }) // Need a real user
        });

        if (res.status === 404 || res.status === 401) {
            console.log("Creating new user u1...");
            res = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'User1', email: 'u1@test.com', password: 'password', phone: '111' })
            });
        }
        let data1 = await res.json();
        const token1 = data1.token;
        console.log("User 1 Token:", token1 ? "OK" : "FAILED");

        // 2. Login as user2
        res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'u2@test.com', password: 'password' })
        });

        if (res.status === 404 || res.status === 401) {
            console.log("Creating new user u2...");
            res = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'User2', email: 'u2@test.com', password: 'password', phone: '222' })
            });
        }
        let data2 = await res.json();
        const token2 = data2.token;
        const user2Id = data2.user ? data2.user.id : (data2.userId || null); // Auth returns {token, user: {id...}}
        console.log("User 2 Token:", token2 ? "OK" : "FAILED", "User2 ID:", user2Id);

        // Try getting user2 ID properly if not in login response
        let userProfileRes = await fetch('http://localhost:5000/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token2}` }
        });
        let user2Profile = await userProfileRes.json();
        const u2Id = user2Profile.id;
        console.log("User 2 ID from profile:", u2Id);

        // 3. User 1 starts conversation with User 2 for dummy room 1
        res = await fetch('http://localhost:5000/api/conversations/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token1}` },
            body: JSON.stringify({ receiver_id: u2Id, room_id: 1 }) // Assuming room passing works
        });
        let convData = await res.json();
        console.log("Start Conversation:", convData);

        if (!convData.conversationId) throw new Error("No conversation ID");

        // 4. Send Message from User 1
        res = await fetch('http://localhost:5000/api/messages/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token1}` },
            body: JSON.stringify({ conversation_id: convData.conversationId, message_text: 'Hello from User 1' })
        });
        let msg1 = await res.json();
        console.log("Message 1 Sent:", msg1);

    } catch (err) {
        console.error("Test failed:", err);
    }
}

testSendMessage();
