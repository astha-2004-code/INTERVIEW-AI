const notificationModel = require("../models/notification.model");

async function getNotifications(req, res) {
    try {
        const notifications = await notificationModel.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50); // Get recent 50
        
        return res.status(200).json({ notifications });
    } catch (err) {
        console.error("Error in getNotifications:", err);
        return res.status(500).json({ message: "Failed to fetch notifications" });
    }
}

async function markAsRead(req, res) {
    try {
        const { id } = req.params;
        const notification = await notificationModel.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        return res.status(200).json({ notification });
    } catch (err) {
        console.error("Error in markAsRead:", err);
        return res.status(500).json({ message: "Failed to mark notification as read" });
    }
}

async function markAllAsRead(req, res) {
    try {
        await notificationModel.updateMany(
            { userId: req.user.id, read: false },
            { read: true }
        );

        return res.status(200).json({ message: "All notifications marked as read" });
    } catch (err) {
        console.error("Error in markAllAsRead:", err);
        return res.status(500).json({ message: "Failed to mark all as read" });
    }
}

async function deleteNotification(req, res) {
    try {
        const { id } = req.params;
        const result = await notificationModel.findOneAndDelete({ _id: id, userId: req.user.id });

        if (!result) {
            return res.status(404).json({ message: "Notification not found" });
        }

        return res.status(200).json({ message: "Notification deleted" });
    } catch (err) {
        console.error("Error in deleteNotification:", err);
        return res.status(500).json({ message: "Failed to delete notification" });
    }
}

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
