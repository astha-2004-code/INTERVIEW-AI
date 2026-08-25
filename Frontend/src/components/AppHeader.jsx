import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import NotificationBell from '../features/notifications/components/NotificationBell';

const AppHeader = ({ title = "INTERVIEW-AI", subtitle = "" }) => {
    const { handleLogout, user } = useAuth();
    const navigate = useNavigate();

    const onLogout = async () => {
        await handleLogout();
        navigate('/login');
    };

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                <h1 style={{ 
                    margin: 0, 
                    fontSize: '1.5rem', 
                    fontWeight: 700, 
                    background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    cursor: 'pointer'
                }} onClick={() => navigate('/')}>
                    {title}
                </h1>
                {subtitle && <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{subtitle}</span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {user && <NotificationBell />}
                
                {user && (
                    <button
                        onClick={onLogout}
                        className="logout-btn"
                        aria-label="Logout"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(236, 72, 153, 0.1)',
                            border: '1px solid rgba(236, 72, 153, 0.2)',
                            borderRadius: '6px',
                            color: '#fdf2f8',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(236, 72, 153, 0.2)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(236, 72, 153, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(236, 72, 153, 0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span style={{ display: 'none' }} className="logout-text">Logout</span>
                        <style>
                            {`
                                @media (min-width: 640px) {
                                    .logout-btn .logout-text { display: inline !important; }
                                }
                            `}
                        </style>
                    </button>
                )}
            </div>
        </header>
    );
};

export default AppHeader;
