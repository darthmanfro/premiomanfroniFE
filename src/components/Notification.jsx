import { useEffect } from 'react';

export function Notification({ message, type, onClose, duration = 4000 }) {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null;

    const isError = type === 'error';
    const style = {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '12px 24px',
        borderRadius: '6px',
        fontWeight: 'bold',
        backgroundColor: isError ? '#f8d7da' : '#d4edda',
        color: isError ? '#721c24' : '#155724',
        border: `1px solid ${isError ? '#f5c6cb' : '#c3e6cb'}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
    };

    return <div style={style}>{message}</div>;
}