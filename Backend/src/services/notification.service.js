const notificationModel = require("../models/notification.model");
const { getIo } = require("../socket/socket");

/**
 * Service to create a notification in DB and emit via Socket.IO
 */
async function createAndEmitNotification({ userId, type, title, message }) {
    try {
        const notification = await notificationModel.create({
            userId,
            type,
            title,
            message
        });

        const io = getIo();
        if (io) {
            io.to(`user:${userId}`).emit("notification:new", notification);
        }

        return notification;
    } catch (err) {
        console.error("Error creating/emitting notification:", err);
        // Do not throw, because notification failure shouldn't crash the main flow
        return null;
    }
}

module.exports = {
    createAndEmitNotification
};
