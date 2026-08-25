# Interview-AI 🎤

An intelligent interview preparation platform powered by AI that helps users practice interviews, receive real-time feedback, and improve their interview skills.

## 🌐 Live Demo

Open the deployed app: https://interview-ai-prep-zeta.vercel.app/login

## 🌟 Features

- **User Authentication** - Secure registration and login with JWT tokens
- **Interview Practice** - Conduct mock interviews with AI-powered questions
- **Real-time Feedback** - Get instant analysis and suggestions on your responses
- **Interview Reports** - Detailed reports analyzing performance metrics
- **File Upload** - Upload resume and cover letter for context-aware questions
- **Secure Logout** - Token blacklisting for secure session management
- **Protected Routes** - Role-based access control
- **Responsive UI** - Modern, user-friendly interface built with React

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware
- **AI Service** - Integration for interview analysis

### Frontend
- **React 18** - UI library
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Context API** - State management
- **SCSS** - Styling
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time progress updates

## ⚡ Real-Time Architecture with Socket.IO

The application uses **Socket.IO** to provide real-time updates while the AI interview report is being generated, without altering the existing REST flow.

**Event Flow:**
1. Frontend calls REST API `POST /api/interview/` with a unique `generationId`.
2. REST API → Express Controller → Gemini API → MongoDB.
3. Simultaneously, the persistent Backend Socket.IO server emits progress events to an authenticated user-specific room (`user:<userId>`).
4. React real-time progress UI subscribes to the Socket.IO events and updates visual progress.

**Why Socket.IO?**
- Provides persistent bidirectional communication.
- Greatly improves user experience during long-running AI generation (up to 30s).
- Decouples progress notifications from the HTTP response.
- Ensures events are strictly broadcasted to authenticated user-specific rooms.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Git

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/astha-2004-code/INTERVIEW-AI.git
cd interview-ai
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend folder:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/interview-ai
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

Start the backend server:

```bash
npm start
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file in the Frontend folder:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
interview-ai/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js           # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Auth logic
│   │   │   └── interview.controller.js # Interview logic
│   │   ├── models/
│   │   │   ├── user.model.js         # User schema
│   │   │   ├── interviewReport.model.js # Report schema
│   │   │   └── blacklist.model.js    # Token blacklist
│   │   ├── routes/
│   │   │   ├── auth.routes.js        # Auth endpoints
│   │   │   └── interview.routes.js   # Interview endpoints
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js    # JWT verification
│   │   │   └── file.middleware.js    # File upload
│   │   ├── services/
│   │   │   └── ai.service.js         # AI integration
│   │   └── app.js                    # Express app
│   ├── server.js                     # Server entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── pages/            # Login, Register
│   │   │   │   ├── components/       # Protected routes
│   │   │   │   ├── hooks/            # useAuth hook
│   │   │   │   ├── services/         # Auth API calls
│   │   │   │   └── auth.context.jsx  # Auth context
│   │   │   └── interview/
│   │   │       ├── pages/            # Home, Interview
│   │   │       ├── hooks/            # useInterview hook
│   │   │       ├── services/         # Interview API
│   │   │       └── interview.context.jsx # Interview state
│   │   ├── style/                    # Global styles
│   │   ├── App.jsx                   # Main component
│   │   ├── app.routes.jsx            # Route config
│   │   └── main.jsx                  # Entry point
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/logout` | Logout user |
| GET | `/api/auth/get-me` | Get authenticated user details |

### Interview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interview/` | Generate a new interview report |
| GET | `/api/interview/` | Get all interview reports of the authenticated user |
| GET | `/api/interview/report/:interviewId` | Get a specific interview report |
| POST | `/api/interview/resume/pdf/:interviewReportId` | Generate interview report PDF |

### Authentication Required

The following endpoints require a valid JWT token:

- `GET /api/auth/get-me`
- `POST /api/interview/`
- `GET /api/interview/`
- `GET /api/interview/report/:interviewId`
- `POST /api/interview/resume/pdf/:interviewReportId`

## 📝 Environment Variables

### Backend (.env)
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/interview-ai
JWT_SECRET=your_secret_key_here
GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

## 🎯 Usage

1. **Register/Login** - Create an account or sign in
2. **Start Interview** - Click on "Start Interview" button
3. **Answer Questions** - Respond to AI-generated questions
4. **Get Feedback** - Receive instant analysis and suggestions
5. **View Reports** - Check your performance metrics and improvements

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for secure authentication:
- Tokens are issued upon successful login
- Tokens expire after the configured duration (default: 7 days)
- Tokens are added to blacklist upon logout
- Protected routes require valid tokens

## 📦 Building for Production

### Backend
```bash
cd Backend
npm run build
npm start
```

### Frontend
```bash
cd Frontend
npm run build
```

The build output will be in `Frontend/dist/`

## 🛠️ Development

### Running Tests
```bash
cd Backend
npm test

cd Frontend
npm test
```

### Linting
```bash
cd Frontend
npm run lint
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Verify connection string in `.env`
- Check MongoDB credentials if using Atlas

### CORS Issues
- Backend should have CORS enabled
- Frontend API URL should match backend origin

### Port Already in Use
- Change `PORT` in Backend `.env`
- Configure port in Frontend `vite.config.js` if needed

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Astha** - [GitHub Profile](https://github.com/astha-2004-code)

## 📧 Support

For support, email support@interview-ai.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Video interview support
- [ ] Multiple language support
- [ ] Advanced analytics dashboard
- [ ] Interview scheduling
- [ ] Peer review system
- [ ] Mobile app
- [ ] Integration with LinkedIn

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- MongoDB for database
- React community for tools and libraries
- Express.js for backend framework

---

**Last Updated:** July 2026

For more information, visit [GitHub Repository](https://github.com/astha-2004-code/INTERVIEW-AI)
