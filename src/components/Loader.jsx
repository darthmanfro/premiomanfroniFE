export function Loader({ active, message = "Attendere prego..." }) {
    if (!active) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            color: '#fff',
            fontFamily: 'sans-serif'
        }}>
            <div style={{
                width: '48px',
                height: '48px',
                border: '5px solid #fff',
                borderBottomColor: 'transparent',
                borderRadius: '50%',
                animation: 'rotation 1s linear infinite',
                marginBottom: '16px'
            }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{message}</p>

            <style>{`
        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}