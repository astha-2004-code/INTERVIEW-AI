import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Register = () => {
    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ localError, setLocalError ] = useState(null)

    const { loading, error, setError, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLocalError(null)
        setError(null)

        if (!username.trim() || !email.trim() || !password.trim()) {
            setLocalError("All fields are required.")
            return
        }

        try {
            await handleRegister({ username, email, password })
            navigate("/")
        } catch (err) {
            setLocalError(err.message || "Failed to register.")
        }
    }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>

                {localError && (
                    <div className="error-banner">
                        <p>{localError}</p>
                        <button className="close-btn" onClick={() => setLocalError(null)}>×</button>
                    </div>
                )}
                {error && !localError && (
                    <div className="error-banner">
                        <p>{error}</p>
                        <button className="close-btn" onClick={() => setError(null)}>×</button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            value={username}
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text" 
                            id="username" 
                            name='username' 
                            placeholder='Enter username' 
                            disabled={loading}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" 
                            id="email" 
                            name='email' 
                            placeholder='Enter email address' 
                            disabled={loading}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" 
                            id="password" 
                            name='password' 
                            placeholder='Enter password' 
                            disabled={loading}
                        />
                    </div>

                    <button className='button primary-button' disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p>Already have an account? <Link to={"/login"}>Login</Link> </p>
            </div>
        </main>
    )
}

export default Register