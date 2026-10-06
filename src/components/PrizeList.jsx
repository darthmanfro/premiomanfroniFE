import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

export function PrizeList({ onLogout, showNotification }) {
    const [prizes, setPrizes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPrizes = async () => {
            try {
                const data = await apiFetch('/prizes');

                // Ordina dal più recente al meno recente
                const sorted = [...data].sort((a, b) => {
                    const dateA = new Date(a.startDate || a.dataInizio);
                    const dateB = new Date(b.startDate || b.dataInizio);
                    return dateB - dateA;
                });

                setPrizes(sorted);
            } catch (err) {
                showNotification(err.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        loadPrizes();
    }, [showNotification]);

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Elenco Premi</h2>
                <button onClick={onLogout} style={{ padding: '8px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
            </div>

            {loading ? (
                <p>Caricamento premi...</p>
            ) : prizes.length === 0 ? (
                <p>Nessun premio trovato.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {prizes.map((p) => {
                        const dateStr = new Date(p.startDate || p.dataInizio).toLocaleDateString('it-IT');
                        return (
                            <div key={p.prizeId || p._id} style={{ padding: '16px', borderLeft: '4px solid #2b580c', background: '#fff', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <h3 style={{ margin: '0 0 8px 0' }}>{p.name || p.titolo}</h3>
                                <span style={{ fontSize: '0.85rem', color: '#666' }}>Inizio: {dateStr}</span>
                                <p style={{ margin: '8px 0 0 0' }}>{p.description || p.descrizione}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}