import React, { useEffect, useState } from 'react';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p>Errore: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lista Partite Calcio</h1>
      {matches.length === 0 && <p>Nessuna partita trovata.</p>}
      <ul>
        {matches.map(match => (
          <li key={match.id}>
            {match.homeTeam.name} - {match.awayTeam.name} | Data:{' '}
            {new Date(match.utcDate).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
