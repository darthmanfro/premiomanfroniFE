import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

export function PrizeList({ onLogout, showNotification }) {
    const [prizes, setPrizes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadPrizes = async () => {
            try {
                const data = await apiFetch('/prizes');

                // Verifica che data sia un array o estrai la proprietà array
                const prizeArray = Array.isArray(data) ? data : (data.prizes || data.data || []);

                const sorted = [...prizeArray].sort((a, b) => {
                    const dateA = new Date(a.startDate || a.dataInizio);
                    const dateB = new Date(b.startDate || b.dataInizio);
                    return dateB - dateA;
                });

                if (isMounted) {
                    setPrizes(sorted);
                }
            } catch (err) {
                if (isMounted) {
                    showNotification(err.message, 'error');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadPrizes();

        return () => {
            isMounted = false;
        };
    }, []); // <-- Array vuoto: viene eseguito UNA SOLA VOLTA all'avvio del componente!

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Elenco Premi</h2>
                <button onClick={onLogout} style={{ padding: '8px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Logout
                </button>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Caricamento premi in corso...</p>
            ) : prizes.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Nessun premio trovato.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {prizes.map((p) => {
                        const dateStr = p.startDate || p.dataInizio
                            ? new Date(p.startDate || p.dataInizio).toLocaleDateString('it-IT')
                            : 'N/D';

                        return (
                            <div key={p.prizeId || p._id || Math.random()} style={{ padding: '16px', borderLeft: '4px solid #2b580c', background: '#fff', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <h3 style={{ margin: '0 0 8px 0' }}>{p.name || p.titolo || 'Senza nome'}</h3>
                                <span style={{ fontSize: '0.85rem', color: '#666' }}>Inizio: {dateStr}</span>
                                <p style={{ margin: '8px 0 0 0' }}>{p.description || p.descrizione || ''}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}