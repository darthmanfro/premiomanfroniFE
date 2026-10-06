import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

export function PrizeList({ onLogout, showNotification, setLoading }) {
    const [prizes, setPrizes] = useState([]);
    const [loadingList, setLoadingList] = useState(true);

    // Stato per gestire la vista della form di creazione
    const [isCreating, setIsCreating] = useState(false);

    // Campi del form di creazione
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [description, setDescription] = useState('');

    // Funzione per caricare la lista dei premi dal backend
    const loadPrizes = async () => {
        setLoadingList(true);
        try {
            const data = await apiFetch('/prizes');
            const prizeArray = Array.isArray(data) ? data : (data.prizes || data.data || []);

            const sorted = [...prizeArray].sort((a, b) => {
                const dateA = new Date(a.startDate || a.dataInizio);
                const dateB = new Date(b.startDate || b.dataInizio);
                return dateB - dateA;
            });

            setPrizes(sorted);
        } catch (err) {
            showNotification(err.message, 'error');
        } finally {
            setLoadingList(false);
        }
    };

    useEffect(() => {
        loadPrizes();
    }, []);

    // Invio della form per la creazione
    const handleSave = async (e) => {
        e.preventDefault();

        if (setLoading) setLoading(true, "Salvataggio premio in corso...");

        try {
            await apiFetch('/prizes', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    startDate,
                    description
                }),
            });

            showNotification('Premio creato con successo!', 'success');

            // Reset campi form e ritorno alla lista
            setName('');
            setStartDate('');
            setDescription('');
            setIsCreating(false);

            // Ricarica la lista per mostrare il nuovo premio
            await loadPrizes();
        } catch (err) {
            showNotification(err.message, 'error');
        } finally {
            if (setLoading) setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>

            {/* VISTA 1: FORM DI CREAZIONE PREMIO */}
            {isCreating ? (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2>Nuovo Premio</h2>
                        <button
                            onClick={() => setIsCreating(false)}
                            style={{ padding: '8px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            &larr; Indietro
                        </button>
                    </div>

                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Nome Premio *</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Es. Premio Infamia dell'anno"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Data Inizio *</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Descrizione</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Descrizione opzionale del premio..."
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                style={{ padding: '10px 16px', background: '#e0e0e0', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Annulla
                            </button>
                            <button
                                type="submit"
                                style={{ padding: '10px 20px', background: '#2b580c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Salva
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                /* VISTA 2: ELENCO PREMI */
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2>Elenco Premi</h2>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setIsCreating(true)}
                                style={{ padding: '8px 16px', background: '#2b580c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                + Crea Premio
                            </button>
                            <button
                                onClick={onLogout}
                                style={{ padding: '8px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {loadingList ? (
                        <p style={{ textAlign: 'center' }}>Caricamento premi in corso...</p>
                    ) : prizes.length === 0 ? (
                        <div style={{ textAlign: 'center', background: '#fff', padding: '30px', borderRadius: '8px' }}>
                            <p>Nessun premio trovato.</p>
                            <button
                                onClick={() => setIsCreating(true)}
                                style={{ marginTop: '10px', padding: '8px 16px', background: '#2b580c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Crea il primo premio
                            </button>
                        </div>
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
            )}
        </div>
    );
}