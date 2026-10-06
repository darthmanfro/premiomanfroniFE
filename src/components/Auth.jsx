import { useState } from 'react';
import { apiFetch } from '../services/api';

export function Auth({ onLoginSuccess, showNotification }) {
    const [tab, setTab] = useState('login'); // 'login' oppure 'register'

    // Campi form
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');

    const [regUser, setRegUser] = useState('');
    const [regPass, setRegPass] = useState('');
    const [regConfirmPass, setRegConfirmPass] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username: loginUser, password: loginPass }),
            });

            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            onLoginSuccess();
        } catch (err) {
            showNotification(err.message, 'error');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (regPass !== regConfirmPass) {
            showNotification('Le password non coincidono', 'error');
            return;
        }

        try {
            await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username: regUser, password: regPass }),
            });

            // Reset form di registrazione
            setRegUser('');
            setRegPass('');
            setRegConfirmPass('');

            // Torna al login e mostra successo
            setTab('login');
            showNotification('Registrazione completata! Ora puoi effettuare il login.', 'success');
        } catch (err) {
            showNotification(err.message, 'error');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
            <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '2px solid #eee' }}>
                <button
                    onClick={() => setTab('login')}
                    style={{ flex: 1, padding: '10px', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer', borderBottom: tab === 'login' ? '3px solid #2b580c' : 'none', color: tab === 'login' ? '#2b580c' : '#666' }}
                >
                    Login
                </button>
                <button
                    onClick={() => setTab('register')}
                    style={{ flex: 1, padding: '10px', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer', borderBottom: tab === 'register' ? '3px solid #2b580c' : 'none', color: tab === 'register' ? '#2b580c' : '#666' }}
                >
                    Registrati
                </button>
            </div>

            {tab === 'login' ? (
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input type="text" placeholder="Username" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} required style={{ padding: '8px' }} />
                    <input type="password" placeholder="Password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} required style={{ padding: '8px' }} />
                    <button type="submit" style={{ padding: '10px', background: '#2b580c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Login</button>
                </form>
            ) : (
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input type="text" placeholder="Username" value={regUser} onChange={(e) => setRegUser(e.target.value)} required style={{ padding: '8px' }} />
                    <input type="password" placeholder="Password" value={regPass} onChange={(e) => setRegPass(e.target.value)} required style={{ padding: '8px' }} />
                    <input type="password" placeholder="Ripeti Password" value={regConfirmPass} onChange={(e) => setRegConfirmPass(e.target.value)} required style={{ padding: '8px' }} />
                    <button type="submit" style={{ padding: '10px', background: '#2b580c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Registrati</button>
                </form>
            )}
        </div>
    );
}