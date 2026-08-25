const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");
const interviewHandler = require("./interviewHandler");

let io;

const initSocket = (server) => {
    const corsOrigin = process.env.CORS_ORIGIN || process.env.FRONTEND_URL;
    const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ];

    if (corsOrigin) {
        allowedOrigins.push(corsOrigin);
    }

    io = new Server(server, {
        pingTimeout: 60000,
        pingInterval: 25000,
        transports: ['websocket', 'polling'],
        cors: {
            origin: function (origin, callback) {
                if (!origin) return callback(null, true);
                
                const isAllowed = allowedOrigins.includes(origin) || origin.endsWith(".vercel.app");
                
                if (isAllowed) {
                    callback(null, true);
                } else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            credentials: true
        }
    });

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            // Socket.io parses cookies into socket.request.headers.cookie
            const cookies = socket.request.headers.cookie;
            if (!cookies) {
                return next(new Error("Authentication error: No cookies provided"));
            }

            // Parse cookies manually
            const cookieArray = cookies.split(';');
            let token = null;
            for (let cookie of cookieArray) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'token') {
                    token = value;
                    break;
                }
            }

            if (!token) {
                return next(new Error("Authentication error: Token not found"));
            }

            const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });
            if (isTokenBlacklisted) {
                return next(new Error("Authentication error: Token is invalid"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id} for user ${socket.user.id}`);
        
        // Join user-specific room
        socket.join(`user:${socket.user.id}`);

        // Register handlers
        interviewHandler(io, socket);

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

// Helper function to emit progress
const emitInterviewProgress = ({ userId, generationId, stage, progress, message }) => {
    if (io) {
        io.to(`user:${userId}`).emit("interview:progress", {
            generationId,
            stage,
            progress,
            message
        });
    }
};

// Helper function to emit completion
const emitInterviewCompleted = ({ userId, generationId, interviewReport }) => {
    if (io) {
        io.to(`user:${userId}`).emit("interview:completed", {
            generationId,
            interviewReport
        });
    }
};

// Helper function to emit error
const emitInterviewError = ({ userId, generationId, message }) => {
    if (io) {
        io.to(`user:${userId}`).emit("interview:error", {
            generationId,
            message
        });
    }
};

// Helper function to emit start
const emitInterviewStarted = ({ userId, generationId, message }) => {
    if (io) {
        io.to(`user:${userId}`).emit("interview:started", {
            generationId,
            message
        });
    }
};

module.exports = {
    initSocket,
    getIo,
    emitInterviewStarted,
    emitInterviewProgress,
    emitInterviewCompleted,
    emitInterviewError
};
