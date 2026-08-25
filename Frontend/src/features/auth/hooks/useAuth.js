import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";
import { disconnectSocket } from "../../../services/socket.service";

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    const { user, setUser, loading, setLoading, error, setError } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        setError(null)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return data.user
        } catch (err) {
            console.error("Error in handleLogin hook:", err)
            const errMsg = err.response?.data?.message || err.message || "Failed to log in. Please check your credentials."
            setError(errMsg)
            throw new Error(errMsg)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        setError(null)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            return data.user
        } catch (err) {
            console.error("Error in handleRegister hook:", err)
            const errMsg = err.response?.data?.message || err.message || "Registration failed. Please try again."
            setError(errMsg)
            throw new Error(errMsg)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        setError(null)
        try {
            await logout()
            setUser(null)
            disconnectSocket()
        } catch (err) {
            console.error("Error in handleLogout hook:", err)
            const errMsg = err.response?.data?.message || err.message || "Logout failed."
            setError(errMsg)
            throw new Error(errMsg)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) {
                // Ignore silent errors during initialization (e.g. guest users)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()
    }, [setUser, setLoading])

    return { user, loading, error, setError, handleRegister, handleLogin, handleLogout }
}