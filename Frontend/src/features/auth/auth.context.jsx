import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";
import { connectSocket, disconnectSocket } from "../../services/socket.service";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => { 
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Check session exactly once on app load
    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        getAndSetUser()
    }, [])

    // Manage socket lifecycle: one connection per authenticated session
    useEffect(() => {
        if (user) {
            connectSocket();
        } else {
            disconnectSocket();
        }
    }, [user])

    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading,error,setError}} >
            {children}
        </AuthContext.Provider>
    )
}