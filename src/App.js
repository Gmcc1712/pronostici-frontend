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

  const getPronosticoColor = (pronostico) => {
    switch(pronostico) {
      case '1': return '#4CAF50'; // Verde per vittoria casa
      case 'X': return '#FF9800'; // Arancione per pareggio
      case '2': return '#2196F3'; // Blu per vittoria trasferta
      default: return '#9E9E9E';
    }
  };

  const getPronosticoText = (pronostico, homeTeam, awayTeam) => {
    switch(pronostico) {
      case '1': return `1 - ${homeTeam}`;
      case 'X': return 'X - Pareggio';
      case '2': return `2 - ${awayTeam}`;
      default: return 'N/A';
    }
  };

  const getConfidenzaBar = (confidenza) => {
    return (
      <div style={{ 
        width: '100%', 
        backgroundColor: '#e0e0e0', 
        borderRadius: '10px', 
        height: '8px',
        marginTop: '5px'
      }}>
        <div style={{
          width: `${confidenza}%`,
          backgroundColor: confidenza > 70 ? '#4CAF50' : confidenza > 60 ? '#FF9800' : '#9E9E9E',
          height: '100%',
          borderRadius: '10px',
          transition: 'width 0.3s ease'
        }}></div>
      </div>
    );
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>🤖 L'IA sta analizzando le partite...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>❌ Errore: {error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>🤖 Pronostici AI Calcio</h1>
        <p style={{ color: '#666' }}>Pronostici generati automaticamente dall'intelligenza artificiale</p>
      </header>
      
      {matches.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          📅 Nessuna partita trovata per questo periodo
        </div>
      )}
      
      {matches.map(match => (
        <div key={match.id} style={{ 
          border: '2px solid #e0e0e0', 
          padding: '20px', 
          margin: '15px 0', 
          borderRadius: '12px',
          backgroundColor: '#f9f9f9',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {/* Info partita */}
          <div style={{ marginBottom: '15px' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>
              {match.homeTeam.name} vs {match.awayTeam.name}
            </h3>
            <div style={{ color: '#666', fontSize: '14px' }}>
              📅 {new Date(match.utcDate).toLocaleString()}
              <br />
              🏆 {match.competition?.name || 'Campionato'}
            </div>
          </div>
          
          {/* Pronostico AI */}
          {match.aiPronostico && (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '16px', marginRight: '10px' }}>🤖 Pronostico AI:</span>
                <span style={{
                  backgroundColor: getPronosticoColor(match.aiPronostico.pronostico),
                  color: 'white',
                  padding: '5px 12px',
                  borderRadius: '15px',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {getPronosticoText(match.aiPronostico.pronostico, match.homeTeam.name, match.awayTeam.name)}
                </span>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <strong>💡 Motivazione:</strong> {match.aiPronostico.reasoning}
              </div>
              
              <div>
                <strong>📊 Confidenza: {match.aiPronostico.confidenza}%</strong>
                {getConfidenzaBar(match.aiPronostico.confidenza)}
              </div>
            </div>
          )}
        </div>
      ))}
      
      <footer style={{ textAlign: 'center', marginTop: '40px', color: '#666', fontSize: '12px' }}>
        ⚠️ I pronostici sono generati automaticamente e non garantiscono risultati reali
      </footer>
    </div>
  );
}

export default App;
