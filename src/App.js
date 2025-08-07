import React, { useEffect, useState } from 'react';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pronostici, setPronostici] = useState({});

  useEffect(() => {
    fetch('https://pronostici-backend.onrender.com/api/matches')
      .then(res => {
        if (!res.ok) throw new Error('Errore nel caricamento');
        return res.json();
      })
      .then(data => {
        setMatches(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    // Carica pronostici salvati dal localStorage
    const savedPronostici = localStorage.getItem('pronostici');
    if (savedPronostici) {
      setPronostici(JSON.parse(savedPronostici));
    }
  }, []);

  const salvaPronostico = (matchId, risultato) => {
    const nuoviPronostici = { ...pronostici, [matchId]: risultato };
    setPronostici(nuoviPronostici);
    localStorage.setItem('pronostici', JSON.stringify(nuoviPronostici));
  };

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p>Errore: {error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>⚽ Pronostici Calcio</h1>
      {matches.length === 0 && <p>Nessuna partita trovata.</p>}
      
      {matches.map(match => (
        <div key={match.id} style={{ 
          border: '1px solid #ccc', 
          padding: '15px', 
          margin: '10px 0', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>{match.homeTeam.name} vs {match.awayTeam.name}</strong>
            <br />
            <small>📅 {new Date(match.utcDate).toLocaleString()}</small>
          </div>
          
          <div style={{ marginTop: '10px' }}>
            <strong>Il tuo pronostico:</strong>
            <div style={{ marginTop: '5px' }}>
              <button 
                onClick={() => salvaPronostico(match.id, '1')}
                style={{ 
                  padding: '8px 12px', 
                  margin: '0 5px', 
                  backgroundColor: pronostici[match.id] === '1' ? '#4CAF50' : '#e0e0e0',
                  color: pronostici[match.id] === '1' ? 'white' : 'black',
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                1 ({match.homeTeam.name})
              </button>
              <button 
                onClick={() => salvaPronostico(match.id, 'X')}
                style={{ 
                  padding: '8px 12px', 
                  margin: '0 5px', 
                  backgroundColor: pronostici[match.id] === 'X' ? '#4CAF50' : '#e0e0e0',
                  color: pronostici[match.id] === 'X' ? 'white' : 'black',
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                X (Pareggio)
              </button>
              <button 
                onClick={() => salvaPronostico(match.id, '2')}
                style={{ 
                  padding: '8px 12px', 
                  margin: '0 5px', 
                  backgroundColor: pronostici[match.id] === '2' ? '#4CAF50' : '#e0e0e0',
                  color: pronostici[match.id] === '2' ? 'white' : 'black',
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                2 ({match.awayTeam.name})
              </button>
            </div>
            {pronostici[match.id] && (
              <div style={{ marginTop: '5px', color: '#4CAF50', fontWeight: 'bold' }}>
                ✅ Pronostico salvato: {pronostici[match.id]}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
