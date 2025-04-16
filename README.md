# StealthTalk

StealthTalk is a secure and anonymous chat application built using the **MERN stack** (MongoDB, Express.js, React, Node.js). It allows users to chat with each other, update profiles, and manage their accounts while ensuring privacy and security.

---

## Features

- **Real-time Chat**: Secure messaging with real-time updates using WebSockets (Socket.io).
- **User Authentication**: JWT-based login and registration.
- **Profile Management**: Users can edit their profiles, including uploading profile pictures.
- **Account Management**: Options to delete accounts and messages.
- **Secure Messaging**: End-to-end encryption for user privacy.

---

## Technologies Used

### Frontend
- **React**: For building the user interface.
- **Bootstrap**: For responsive and modern styling.
- **Axios**: For making API requests.

### Backend
- **Node.js**: For server-side logic.
- **Express.js**: For building RESTful APIs.
- **Socket.io**: For real-time communication.
- **JWT**: For secure authentication.
- **bcrypt**: For password hashing.

### Database
- **MongoDB**: For storing application data.
- **Mongoose**: For object data modeling (ODM).

---

## Getting Started

Follow these steps to run the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/Anas-7860/StealthTalk---A-Chat-App.git
cd stealthtalk
```
### 2. Install Dependencies
#### Backend:
```bash
cd backend
npm install
```
#### Frontend:
```bash
cd frontend
npm install
```
### 3. Set Up Environment Variables
Create a `.env` file in the `backend/` directory and add the following:
```bash
MONGO_URI=your_mongo_database_url
JWT_SECRET=your_jwt_secret
PORT=5000
```
### 4. Start the Application
#### Backend:
```bash
cd backend
npm run dev
```
#### Frontend:
```bash
cd frontend
npm run dev
```
This will start the server on port 5000 for the backend and the frontend on http://localhost:3000.

## Features
1. User Authentication
Register: Allows new users to register with their name, email, and password.

Login: Users can log in to their account using their credentials.

JWT Authentication: Secure user authentication with JWT tokens stored in cookies.

2. Real-time Messaging
WebSockets: Using Socket.io for real-time messaging.

Message Display: Messages are instantly shown when sent or received.

3. Profile Management
Users can upload, update, and display profile pictures.

Edit profile details such as name and bio.

Delete Account: Users can delete their account, removing all their data from the database.

4. Message Deletion
Users can delete their sent messages.

## Folder Structure
```plaintext
stealthtalk/
│
├── backend/                 # Backend API and server
│   ├── models/              # Mongoose models
│   ├── routes/              # Express route handlers
│   ├── controllers/         # Route logic
│   └── server.js            # Main server file
│
└── frontend/                # Frontend React app
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Pages (Home, Profile, Chat, etc.)
    │   └── App.js           # Main App component
```
## Future Works
Integrate Cloud storage services (like AWS S3 or Cloudinary) for storing profile images, as currently, images are stored locally in the uploads folder.

## Contributing
Feel free to fork this repository and submit pull requests. If you'd like to contribute to the project, please follow these steps:

Fork the repository.

Create a new branch (git checkout -b feature-name).

Make your changes and commit (git commit -am 'Add feature').

Push the branch to your fork (git push origin feature-name).

Submit a pull request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
