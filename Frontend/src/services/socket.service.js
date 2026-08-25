import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
    if (socket) return socket;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || "";
    
    socket = io(socketUrl, {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => {
    if (!socket) {
        return connectSocket();
    }
    return socket;
};

export const subscribeToInterviewProgress = (generationId, callbacks) => {
    const s = getSocket();
    
    const onProgress = (data) => {
        if (data.generationId === generationId && callbacks.onProgress) {
            callbacks.onProgress(data);
        }
    };

    const onCompleted = (data) => {
        if (data.generationId === generationId && callbacks.onCompleted) {
            callbacks.onCompleted(data);
        }
    };

    const onError = (data) => {
        if (data.generationId === generationId && callbacks.onError) {
            callbacks.onError(data);
        }
    };

    const onStarted = (data) => {
        if (data.generationId === generationId && callbacks.onStarted) {
            callbacks.onStarted(data);
        }
    };

    s.on("interview:progress", onProgress);
    s.on("interview:completed", onCompleted);
    s.on("interview:error", onError);
    s.on("interview:started", onStarted);

    // Return a cleanup function
    return () => {
        s.off("interview:progress", onProgress);
        s.off("interview:completed", onCompleted);
        s.off("interview:error", onError);
        s.off("interview:started", onStarted);
    };
};
