import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const { loading, error, setError, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ localError, setLocalError ] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLocalError(null)
        setError(null)

        if (!email.trim() || !password.trim()) {
            setLocalError("Email and password are required.")
            return
        }

        try {
            await handleLogin({ email, password })
            navigate('/')
        } catch (err) {
            setLocalError(err.message || "Failed to log in.")
        }
    }

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>

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
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p>Don't have an account? <Link to={"/register"}>Register</Link> </p>
            </div>
        </main>
    )
}

export default Login