# Interview AI 🎤

An AI-powered interview preparation platform that analyzes a candidate's
resume or self-description against a target job description and
generates a personalized interview strategy.

## 🌐 Live Demo

**Live application:** https://interview-ai-prep-zeta.vercel.app/login

> Replace the live URL above if the deployment URL changes.

------------------------------------------------------------------------

## ✨ Overview

Interview AI is a full-stack web application built to make interview
preparation more personalized.

Instead of preparing from generic interview questions, a candidate
provides:

-   A target **job description**
-   Their **resume** (PDF) and/or self-description

The backend extracts the resume text, sends the candidate information
and job description to **Google Gemini**, and generates a structured
interview report containing:

-   Candidate-job **match score**
-   **Technical interview questions**
-   **Behavioral interview questions**
-   **Skill gaps** with severity
-   A **day-wise preparation plan**
-   Target **job title**

The generated report is stored in MongoDB and displayed through the
React frontend.

The platform can also generate a tailored, ATS-friendly resume as a PDF
using Gemini-generated HTML and Puppeteer.

------------------------------------------------------------------------

## 🚀 Key Features

### 🔐 Authentication

-   User registration and login
-   Password hashing with `bcryptjs`
-   JWT-based authentication
-   JWT stored in an HTTP-only cookie
-   Protected API routes
-   Logout with token blacklisting

### 📄 Resume Processing

-   Upload PDF resumes
-   Multipart file handling using Multer
-   In-memory file processing
-   PDF text extraction using `pdf-parse`
-   Resume content is passed to the AI analysis pipeline

### 🤖 AI-Powered Interview Analysis

-   Job-description based personalization
-   Resume/self-description analysis
-   Candidate-job match score
-   Technical interview questions
-   Behavioral interview questions
-   Skill-gap analysis
-   Severity classification: `low`, `medium`, `high`
-   Day-wise preparation roadmap

### 🧩 Structured AI Output

The Gemini response is constrained using a Zod schema and converted to
JSON Schema.

This allows the application to consume predictable structured data
instead of relying on free-form AI text.

### 📊 Interview Reports

-   Store generated reports in MongoDB
-   View previous reports
-   View individual reports
-   Reports are associated with the authenticated user

### 📑 AI Resume Generator

-   Generate a job-tailored resume
-   Generate ATS-friendly HTML using Gemini
-   Convert generated HTML to A4 PDF using Puppeteer
-   Supports local Puppeteer execution and serverless Chromium through
    `@sparticuz/chromium`

### 🎨 Frontend

-   React-based UI
-   React Router navigation
-   Context API for application state
-   Axios for API requests
-   Responsive SCSS styling

------------------------------------------------------------------------

## 🏗️ System Architecture

``` text
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │ React + Vite + SCSS │
                         └──────────┬──────────┘
                                    │
                              Axios / REST
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Express / Node.js   │
                         │     Backend API     │
                         └───────┬─────┬───────┘
                                 │     │
                  ┌──────────────┘     └──────────────┐
                  ▼                                   ▼
        ┌──────────────────┐                ┌──────────────────┐
        │ Authentication   │                │ Interview Logic  │
        │ JWT + Cookies    │                │ Resume + AI      │
        └────────┬─────────┘                └────────┬─────────┘
                 │                                   │
                 ▼                                   ▼
        ┌──────────────────┐                ┌──────────────────┐
        │    MongoDB       │                │   Google Gemini  │
        │ Users + Reports  │                │  AI Generation   │
        └──────────────────┘                └────────┬─────────┘
                                                     │
                                                     ▼
                                           ┌──────────────────┐
                                           │ Structured JSON  │
                                           │ Zod / JSON Schema│
                                           └──────────────────┘
```

------------------------------------------------------------------------

## 🔄 Interview Report Flow

``` text
Job Description
       +
Resume PDF / Self Description
       │
       ▼
React Frontend
       │
       │ multipart/form-data
       ▼
Express API
       │
       ▼
Authentication Middleware
       │
       ▼
Multer
       │
       ▼
PDF Text Extraction
       │
       ▼
Google Gemini
       │
       ▼
Structured JSON Response
       │
       ▼
MongoDB
       │
       ▼
React Interview Report
```

------------------------------------------------------------------------

## 🤖 AI Pipeline

The application sends three major inputs to Gemini:

``` text
Resume Text
Self Description
Job Description
       │
       ▼
   Gemini Model
       │
       ▼
Structured Interview Report
```

The expected response contains:

``` json
{
  "matchScore": 85,
  "technicalQuestions": [],
  "behavioralQuestions": [],
  "skillGaps": [],
  "preparationPlan": [],
  "title": "Software Engineer"
}
```

### Why structured output?

LLMs can return unpredictable free-form responses.

Interview AI uses:

1.  **Zod** to define the expected response structure
2.  `zod-to-json-schema` to convert the schema
3.  Gemini's JSON response mode and response schema
4.  JSON parsing on the backend
5.  MongoDB storage of the structured result

This makes the AI response easier for both the backend and frontend to
consume.

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend
<<<<<<< HEAD
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
=======
>>>>>>> 3382f87bc72707fc274aca3df41fb0ff7cf5a19d

  Technology     Purpose
  -------------- ---------------------------
  React 19       User interface
  Vite           Development/build tooling
  React Router   Client-side routing
  Context API    Global state management
  Axios          HTTP/API communication
  SCSS           Styling

### Backend

  Technology            Purpose
  --------------------- -------------------------------
  Node.js               Backend runtime
  Express 5             REST API
  MongoDB               Database
  Mongoose              MongoDB ODM
  JWT                   Authentication
  bcryptjs              Password hashing
  Multer                File uploads
  pdf-parse             PDF text extraction
  Google GenAI          LLM integration
  Zod                   AI response validation/schema
  zod-to-json-schema    Schema conversion
  Puppeteer             HTML-to-PDF generation
  @sparticuz/chromium   Serverless Chromium

------------------------------------------------------------------------

## 📁 Project Structure

``` text
INTERVIEW-AI/
│
├── Backend/
│   ├── api/
│   │   └── index.js
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── interview.controller.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── file.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── interviewReport.model.js
│   │   │   └── blacklist.model.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── interview.routes.js
│   │   │
│   │   ├── services/
│   │   │   └── ai.service.js
│   │   │
│   │   └── app.js
│   │
│   ├── server.js
│   ├── Dockerfile
│   ├── nixpacks.toml
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   └── auth.context.jsx
│   │   │   │
│   │   │   └── interview/
│   │   │       ├── hooks/
│   │   │       ├── pages/
│   │   │       ├── services/
│   │   │       └── interview.context.jsx
│   │   │
│   │   ├── style/
│   │   ├── App.jsx
│   │   ├── app.routes.jsx
│   │   └── main.jsx
│   │
│   ├── vite.config.js
│   └── package.json
│
├── Dockerfile
├── railway.json
├── vercel.json
└── README.md
```

------------------------------------------------------------------------

## 🔑 Authentication Flow

Interview AI uses JWT authentication with HTTP-only cookies.

``` text
Register / Login
       │
       ▼
Validate credentials
       │
       ▼
bcrypt password verification
       │
       ▼
Create JWT
       │
       ▼
HTTP-only Cookie
       │
       ▼
Protected API Request
       │
       ▼
JWT Middleware
       │
       ▼
Authenticated User
```

### Password security

Passwords are never stored as plaintext.

During registration:

``` text
Plain Password
      │
      ▼
bcrypt.hash()
      │
      ▼
Password Hash
      │
      ▼
MongoDB
```

During login, `bcrypt.compare()` verifies the supplied password against
the stored hash.

### Token invalidation

On logout:

1.  The current JWT is stored in the blacklist collection.
2.  The authentication cookie is cleared.
3.  The authentication middleware can reject blacklisted tokens.

------------------------------------------------------------------------

## 🗃️ Database Models

### User

``` text
User
├── username
├── email
└── password
```

### InterviewReport

``` text
InterviewReport
├── user
├── jobDescription
├── resume
├── selfDescription
├── matchScore
├── technicalQuestions[]
├── behavioralQuestions[]
├── skillGaps[]
├── preparationPlan[]
├── title
├── createdAt
└── updatedAt
```

### BlacklistToken

``` text
BlacklistToken
├── token
├── createdAt
└── updatedAt
```

------------------------------------------------------------------------

## 🔌 API Endpoints

### Authentication

  Method   Endpoint               Description
  -------- ---------------------- --------------------------------
  `POST`   `/api/auth/register`   Register a new user
  `POST`   `/api/auth/login`      Login
  `GET`    `/api/auth/logout`     Logout and invalidate token
  `GET`    `/api/auth/get-me`     Get current authenticated user

### Interview

  ------------------------------------------------------------------------------------------------
  Method                  Endpoint                                         Description
  ----------------------- ------------------------------------------------ -----------------------
  `POST`                  `/api/interview/`                                Generate an AI
                                                                           interview report

  `GET`                   `/api/interview/`                                Get the user's previous
                                                                           reports

  `GET`                   `/api/interview/report/:interviewId`             Get one interview
                                                                           report

  `POST`                  `/api/interview/resume/pdf/:interviewReportId`   Generate a tailored
                                                                           resume PDF
  ------------------------------------------------------------------------------------------------

Protected endpoints require authentication.

------------------------------------------------------------------------

## ⚙️ Installation

### Prerequisites

Make sure you have:

-   Node.js 18+
-   npm
-   MongoDB Atlas or a local MongoDB instance
-   Google Gemini API key
-   Git

### 1. Clone the repository

``` bash
git clone https://github.com/astha-2004-code/INTERVIEW-AI.git
cd INTERVIEW-AI
```

### 2. Install backend dependencies

``` bash
cd Backend
npm install
```

### 3. Configure backend environment variables

Create:

``` text
Backend/.env
```

Add:

``` env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

<<<<<<< HEAD
### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
=======
### 4. Start backend

Development:

``` bash
npm run dev
>>>>>>> 3382f87bc72707fc274aca3df41fb0ff7cf5a19d
```

Production:

``` bash
npm start
```

### 5. Install frontend dependencies

Open another terminal:

``` bash
cd Frontend
npm install
```

### 6. Configure frontend

Create:

``` text
Frontend/.env
```

Add:

``` env
VITE_API_BASE_URL=http://localhost:3000
```

### 7. Start frontend

``` bash
npm run dev
```

The frontend will normally be available at:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

## 🔐 Environment Variables

### Backend

``` env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

### Frontend

``` env
VITE_API_BASE_URL=http://localhost:3000
```

> Never commit real API keys, JWT secrets, database credentials, or
> production environment variables to Git.

------------------------------------------------------------------------

## 📑 Resume PDF Generation

The resume-generation pipeline is:

``` text
Candidate Information
        +
Job Description
        │
        ▼
     Gemini
        │
        ▼
ATS-friendly HTML
        │
        ▼
Puppeteer
        │
        ▼
A4 PDF
```

### Serverless support

For serverless environments such as Vercel, the project uses:

-   `puppeteer-core`
-   `@sparticuz/chromium`

For local development, it can use regular `puppeteer`.

------------------------------------------------------------------------

## 🧠 Design Decisions

### Why MongoDB?

Interview reports contain nested arrays and AI-generated structures.
MongoDB's document model maps naturally to this data.

### Why JWT?

JWT provides a lightweight authentication mechanism suitable for a REST
API.

### Why HTTP-only cookies?

HTTP-only cookies prevent client-side JavaScript from directly reading
the authentication token, reducing exposure in case of certain XSS
attacks.

### Why Multer?

The application receives PDF resumes using `multipart/form-data`, and
Multer provides straightforward Express middleware for handling uploaded
files.

### Why Zod + JSON Schema?

LLM output can be inconsistent. A schema provides a predictable contract
between the AI service and the rest of the application.

### Why Puppeteer?

The AI generates HTML for the resume, and Puppeteer provides
browser-quality rendering to convert that HTML into a PDF.

------------------------------------------------------------------------

## 🛡️ Security Considerations

The application includes:

-   bcrypt password hashing
-   JWT authentication
-   HTTP-only cookies
-   Protected routes
-   User ownership checks for interview reports
-   File-size limits
-   CORS configuration
-   Token blacklisting on logout

### Production improvements

For a larger production deployment, the following could be added:

-   Rate limiting
-   Helmet/security headers
-   Stronger request validation
-   File signature/MIME validation
-   Object storage such as S3 for uploaded files
-   Automatic cleanup of expired blacklisted tokens
-   Background queues for AI/PDF jobs
-   Centralized logging and monitoring
-   Automated unit/integration tests

------------------------------------------------------------------------

## 📈 Scalability Improvements

The current application performs AI generation and PDF generation
synchronously.

For higher traffic, the architecture could be changed to:

``` text
Client
  │
  ▼
API Server
  │
  ▼
Job Queue
  │
  ├──────────────► AI Worker
  │
  └──────────────► PDF Worker
                         │
                         ▼
                    Object Storage
```

Potential technologies:

-   Redis
-   BullMQ
-   RabbitMQ
-   AWS S3
-   Docker
-   Load balancer
-   Multiple Node.js instances

This would prevent long-running AI/PDF tasks from blocking normal API
requests.

------------------------------------------------------------------------

## 🧪 Testing

The project currently does not include a complete automated test suite.

Recommended future tests:

### Backend

-   Registration validation
-   Login validation
-   JWT middleware
-   Logout/token blacklist
-   Interview report authorization
-   Resume upload validation
-   AI service error handling

### Frontend

-   Login form
-   Registration form
-   Protected routes
-   Interview form
-   Loading/error states
-   Report rendering

Suggested tools:

-   Jest
-   Supertest
-   React Testing Library

------------------------------------------------------------------------

## 🚧 Known Limitations

-   AI-generated match scores are model-based and are not a
    deterministic ATS score.
-   AI responses depend on model availability and API quotas.
-   PDF processing currently focuses on PDF resume input.
-   AI generation and PDF generation are synchronous.
-   Uploaded resume content is processed in memory.
-   The application would benefit from stronger production-level rate
    limiting and monitoring.

------------------------------------------------------------------------

## 🔮 Future Enhancements

-   Real-time AI mock interview with voice input
-   Speech-to-text interview answers
-   AI evaluation of spoken answers
-   Coding interview mode
-   DSA question generation
-   System-design interview mode
-   Interview difficulty selection
-   Company-specific interview preparation
-   Job-board integration
-   Resume ATS scoring
-   Skill recommendation engine
-   Progress tracking across interviews
-   Redis caching
-   Background AI processing
-   Email interview reminders
-   Admin analytics dashboard

------------------------------------------------------------------------

## 💡 Example Use Case

A candidate applying for a Software Engineer position can:

1.  Log in.
2.  Paste the job description.
3.  Upload their resume.
4.  Generate an AI interview report.
5.  Review their match score.
6.  Identify missing skills.
7.  Practice technical and behavioral questions.
8.  Follow the personalized preparation plan.
9.  Generate a job-tailored ATS-friendly resume.

------------------------------------------------------------------------

## 🎯 Interview Talking Points

If this project is discussed in a technical interview, the main
engineering topics include:

-   React component architecture
-   Context API and custom hooks
-   REST API design
-   Express middleware
-   JWT authentication
-   HTTP-only cookies
-   Password hashing
-   MongoDB/Mongoose schema design
-   File uploads with Multer
-   PDF text extraction
-   LLM integration
-   Structured AI output
-   Zod validation
-   Prompt design
-   Error handling
-   PDF generation with Puppeteer
-   Serverless deployment
-   Scalability and production architecture

------------------------------------------------------------------------

## 👩‍💻 Author

**Astha Jha**

B.Tech --- Electronics and Communication Engineering\
NIT Delhi

GitHub: https://github.com/astha-2004-code

------------------------------------------------------------------------

## 📄 License

This project is intended for educational, portfolio, and
interview-preparation purposes.

