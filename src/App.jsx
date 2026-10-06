import { useState } from 'react';
import { Auth } from './components/Auth';
import { PrizeList } from './components/PrizeList';
import { Notification } from './components/Notification';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [notification, setNotification] = useState({ message: '', type: 'error' });

    const showNotification = (message, type = 'error') => {
        setNotification({ message, type });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f4f6f8', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', color: '#2b580c' }}>Premio Manfroni</h1>

            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: 'error' })}
            />

            {isAuthenticated ? (
                <PrizeList onLogout={handleLogout} showNotification={showNotification} />
            ) : (
                <Auth onLoginSuccess={() => setIsAuthenticated(true)} showNotification={showNotification} />
            )}
        </div>
    );
}

export default App;