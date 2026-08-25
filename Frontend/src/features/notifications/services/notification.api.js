import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "",
    withCredentials: true,
});

export const fetchNotifications = async () => {
    const res = await api.get("/api/notifications");
    return res.data.notifications;
};

export const markAsRead = async (id) => {
    const res = await api.patch(`/api/notifications/${id}/read`);
    return res.data.notification;
};

export const markAllAsRead = async () => {
    const res = await api.patch("/api/notifications/read-all");
    return res.data;
};

export const deleteNotification = async (id) => {
    const res = await api.delete(`/api/notifications/${id}`);
    return res.data;
};
