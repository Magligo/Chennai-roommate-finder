# 🏠 Chennai Roommate Finder

A modern web application designed to help people in Chennai find the perfect roommates and living spaces. Whether you have a room to share or are searching for one, Chennai Roommate Finder makes the process seamless and secure.

---

## 🚀 Project Overview

Finding a compatible roommate in a bustling city like Chennai can be challenging. This platform provides a dedicated space for:
- **Room Owners**: Post your available rooms, specify requirements, and find the right match.
- **Room Seekers**: Browse through detailed listings and connect directly with potential roommates.

The application features a sleek, responsive design powered by Tailwind CSS and a robust Node.js backend with SQLite for reliable data management.

## ✨ Features

- **🔐 User Authentication**: Secure signup and login with personalized user profiles.
- **📍 Detailed Listings**: Post rooms with location (Chennai specific), rent, room type, and amenities.
- **👥 Roommate Preferences**: Specify the number of roommates needed and your expectations.
- **🔍 Smart Search**: Easily filter through available rooms based on location and budget.
- **💬 Messaging System**: Direct communication between owners and seekers to discuss details.
- **🖼️ Photo Uploads**: Upload real photos of your room to attract better matches.
- **👤 Profile Management**: View detailed profiles of potential roommates, including occupation and age.

## 🛠️ Tech Stack

- **Frontend**: 
  - HTML5 & CSS3
  - [Tailwind CSS](https://tailwindcss.com/) (Responsive Utility-First Framework)
  - Vanilla JavaScript (ES6+)
- **Backend**:
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/) (Web Framework)
  - [Multer](https://github.com/expressjs/multer) (File Upload Handling)
- **Database**:
  - [SQLite](https://www.sqlite.org/) (Lightweight, Serverless Relational Database)
  - [sqlite3](https://www.npmjs.com/package/sqlite3) (Node.js Driver)

## 📂 Folder Structure

```text
Chennai-Roommate-Finder/
├── backend/
│   ├── controllers/      # Route controllers and business logic
│   ├── database/         # SQLite database and initialization
│   ├── middleware/       # Authentication and error handling
│   ├── models/           # Data access logic
│   ├── routes/           # API endpoints (auth, rooms, messages)
│   ├── uploads/          # User-uploaded room photos
│   └── server.js         # Main server entry point
├── frontend/
│   ├── js/               # Frontend logic (auth, rooms, dashboard)
│   ├── index.html        # Landing page
│   ├── login.html        # User login
│   ├── signup.html       # User signup
│   ├── rooms.html        # Room search and listings
│   ├── post-room.html    # Form to post a new room
│   ├── dashboard.html    # User dashboard
│   ├── profile.html      # User profile
│   └── messages.html     # Messaging interface
└── README.md             # Project documentation (this file)
```

## ⚙️ Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/Chennai-Roommate-Finder.git
   cd Chennai-Roommate-Finder
   ```

2. **Setup the Backend**:
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Initialize Database**:
   The database will be automatically created and initialized when you run the server for the first time.

## 🏃 How to Run the Project

1. **Start the Backend Server**:
   ```bash
   cd backend
   node server.js
   ```
   The API will be running at `http://localhost:5000`.

2. **Open the Frontend**:
   Simply open `frontend/index.html` in your favorite web browser.

## 🚀 Future Improvements

- [ ] Email notifications for new messages and requests.
- [ ] Integration with Google Maps for precise room locations.
- [ ] Advanced AI-based roommate matching based on preferences.
- [ ] Real-time chat using WebSockets (Socket.io).
- [ ] Mobile application version using React Native.

## ✍️ Author

**Magli** - *Full Stack Developer*
[GitHub Profile](https://github.com/your-username)

## 🔗 GitHub Repository Link

[https://github.com/your-username/Chennai-Roommate-Finder](https://github.com/your-username/Chennai-Roommate-Finder)

---
*Created with ❤️ for the people of Chennai.*
