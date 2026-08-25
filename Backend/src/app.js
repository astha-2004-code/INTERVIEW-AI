const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const connectToDB = require("./config/database")

const app = express()

app.use(express.json())
app.use(cookieParser())

// Health check endpoint (bypasses database and CORS middleware)
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is healthy",
        timestamp: new Date()
    })
})

const corsOrigin = process.env.CORS_ORIGIN || process.env.FRONTEND_URL;

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000"
        ];

        if (corsOrigin) {
            allowedOrigins.push(corsOrigin);
        }

        const isAllowed = allowedOrigins.includes(origin) || origin.endsWith(".vercel.app");

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}))

// Database connection middleware to ensure MongoDB is ready
app.use(async (req, res, next) => {
    try {
        await connectToDB()
        next()
    } catch (err) {
        res.status(500).json({
            message: "Database connection failed",
            error: err.message
        })
    }
})


/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")
const aiRouter = require("./routes/ai.routes")
const notificationRouter = require("./routes/notification.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/ai", aiRouter)
app.use("/api/notifications", notificationRouter)



module.exports = app