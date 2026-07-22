# Interview-AI 🎤

An intelligent interview preparation platform powered by AI that helps users practice interviews, receive real-time feedback, and improve their interview skills.

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
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interview-ai
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d
NODE_ENV=development
AI_API_KEY=your_ai_service_key_here
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
VITE_API_BASE_URL=http://localhost:5000/api
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
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Interview
- `GET /api/interview/questions` - Get interview questions
- `POST /api/interview/submit-response` - Submit interview response
- `GET /api/interview/reports` - Get user's interview reports
- `GET /api/interview/report/:id` - Get specific report

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interview-ai
JWT_SECRET=your_secret_key
JWT_EXPIRY=7d
NODE_ENV=development
AI_API_KEY=your_ai_key
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
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
- Change port in Frontend `vite.config.js`

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
