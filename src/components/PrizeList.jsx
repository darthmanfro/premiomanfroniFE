import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

const DAYS_OF_WEEK = [
    { label: 'Dom', value: 0 },
    { label: 'Lun', value: 1 },
    { label: 'Mar', value: 2 },
    { label: 'Mer', value: 3 },
    { label: 'Gio', value: 4 },
    { label: 'Ven', value: 5 },
    { label: 'Sab', value: 6 },
];

export function PrizeList({ onLogout, showNotification, setLoading }) {
    const [prizes, setPrizes] = useState([]);
    const [loadingList, setLoadingList] = useState(true);

    // Stato form
    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4, 5, 6]); // Tutti selezionati di default
    const [participantsInput, setParticipantsInput] = useState('');

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

    const handleDayToggle = (dayValue) => {
        if (selectedDays.includes(dayValue)) {
            setSelectedDays(selectedDays.filter((d) => d !== dayValue));
        } else {
            setSelectedDays([...selectedDays, dayValue].sort());
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!title.trim() || !startDate || !endDate) {
            showNotification('Titolo, Data Inizio e Data Fine sono obbligatori.', 'error');
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            showNotification('La Data Fine non può essere antecedente alla Data Inizio.', 'error');
            return;
        }

        if (setLoading) setLoading(true, "Salvataggio premio in corso...");

        // Conversione stringa partecipanti in array
        const participants = participantsInput
            .split(',')
            .map((p) => p.trim())
            .filter((p) => p.length > 0);

        const payload = {
            title,
            name: title, // Per retrocompatibilità
            startDate,
            endDate,
            description,
            days: selectedDays,
            daysOfWeek: selectedDays,
            participants
        };

        try {
            await apiFetch('/prizes', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            showNotification('Premio creato con successo!', 'success');

            // Reset campi
            setTitle('');
            setStartDate('');
            setEndDate('');
            setDescription('');
            setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
            setParticipantsInput('');
            setIsCreating(false);

            await loadPrizes();
        } catch (err) {
            showNotification(err.message, 'error');
        } finally {
            if (setLoading) setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '650px', margin: '40px auto', padding: '20px' }}>

            {/* VISTA FORM CREAZIONE */}
            {isCreating ? (
                <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0 }}>Nuovo Premio</h2>
                        <button
                            onClick={() => setIsCreating(false)}
                            style={{ padding: '8px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            &larr; Indietro
                        </button>
                    </div>

                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Titolo Premio */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Titolo Premio *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Es. Premio Infamia del Mese"
                                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>

                        {/* Date Inizio e Fine */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Data Inizio *</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>

                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Data Fine *</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>
                        </div>

                        {/* Giorni della settimana (0-6) */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Giorni Validi</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {DAYS_OF_WEEK.map((d) => {
                                    const isChecked = selectedDays.includes(d.value);
                                    return (
                                        <button
                                            type="button"
                                            key={d.value}
                                            onClick={() => handleDayToggle(d.value)}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                border: '1px solid #2b580c',
                                                background: isChecked ? '#2b580c' : '#fff',
                                                color: isChecked ? '#fff' : '#2b580c',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            {d.label} ({d.value})
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Partecipanti */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Partecipanti</label>
                            <input
                                type="text"
                                value={participantsInput}
                                onChange={(e) => setParticipantsInput(e.target.value)}
                                placeholder="Separati da virgola (es. Mario, Luigi, Anna)"
                                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <span style={{ fontSize: '0.8rem', color: '#666' }}>I nomi/username verranno salvati come elenco.</span>
                        </div>

                        {/* Descrizione */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Descrizione</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="Descrizione o note sul premio..."
                                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>

                        {/* Pulsanti Salva e Annulla */}
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                style={{ padding: '10px 18px', background: '#e0e0e0', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Annulla
                            </button>
                            <button
                                type="submit"
                                style={{ padding: '10px 24px', background: '#2b580c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Salva
                            </button>
                        </div>

                    </form>
                </div>
            ) : (
                /* VISTA ELENCO PREMI */
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0 }}>Elenco Premi</h2>
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
                        <div style={{ textAlign: 'center', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: '0 0 15px 0', color: '#555' }}>Nessun premio trovato.</p>
                            <button
                                onClick={() => setIsCreating(true)}
                                style={{ padding: '8px 16px', background: '#2b580c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Crea il primo premio
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {prizes.map((p) => {
                                const startStr = p.startDate ? new Date(p.startDate).toLocaleDateString('it-IT') : 'N/D';
                                const endStr = p.endDate ? new Date(p.endDate).toLocaleDateString('it-IT') : 'N/D';

                                return (
                                    <div key={p.prizeId || p._id || Math.random()} style={{ padding: '16px', borderLeft: '4px solid #2b580c', background: '#fff', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                        <h3 style={{ margin: '0 0 8px 0' }}>{p.title || p.name || 'Senza titolo'}</h3>
                                        <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '8px' }}>
                                            Dal {startStr} al {endStr}
                                        </div>
                                        {p.description && <p style={{ margin: '0 0 8px 0', color: '#333' }}>{p.description}</p>}
                                        {p.participants && p.participants.length > 0 && (
                                            <div style={{ fontSize: '0.8rem', color: '#555' }}>
                                                <strong>Partecipanti:</strong> {Array.isArray(p.participants) ? p.participants.join(', ') : p.participants}
                                            </div>
                                        )}
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