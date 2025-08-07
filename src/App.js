import React, { useEffect, useState } from 'react';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllPronostics, setShowAllPronostics] = useState({});

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

  const getPronosticoColor = (probabilita) => {
    if (probabilita >= 75) return '#4CAF50'; // Verde scuro - alta probabilità
    if (probabilita >= 65) return '#8BC34A'; // Verde chiaro
    if (probabilita >= 55) return '#FF9800'; // Arancione
    return '#9E9E9E'; // Grigio - bassa probabilità
  };

  const getMercatoColor = (mercato) => {
    switch(mercato) {
      case '1X2': return '#2196F3';
      case 'Doppia Chance': return '#FF9800';
      case 'Under/Over': return '#9C27B0';
      case 'Goal/No Goal': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const toggleAllPronostics = (matchId) => {
    setShowAllPronostics(prev => ({
      ...prev,
      [matchId]: !prev[matchId]
    }));
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>🤖 AI Super-Intelligente</div>
        <div>Analizzando partite future e calcolando probabilità...</div>
        <div style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
          Mercati: 1X2 • Doppia Chance • Under/Over • Goal/No Goal
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        ❌ Errore: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>🤖 AI Super-Intelligente</h1>
        <div style={{ color: '#666', marginBottom: '10px' }}>
          Pronostici automatici con analisi di 16 mercati diversi
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', fontSize: '12px' }}>
          <span style={{ backgroundColor: '#2196F3', color: 'white', padding: '3px 8px', borderRadius: '10px' }}>1X2</span>
          <span style={{ backgroundColor: '#FF9800', color: 'white', padding: '3px 8px', borderRadius: '10px' }}>Doppia Chance</span>
          <span style={{ backgroundColor: '#9C27B0', color: 'white', padding: '3px 8px', borderRadius: '10px' }}>Under/Over</span>
          <span style={{ backgroundColor: '#4CAF50', color: 'white', padding: '3px 8px', borderRadius: '10px' }}>Goal/No Goal</span>
        </div>
      </header>
      
      {matches.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          📅 Nessuna partita futura trovata per questo periodo
        </div>
      )}
      
      {matches.map(match => (
        <div key={match.id} style={{ 
          border: '2px solid #e0e0e0', 
          padding: '25px', 
          margin: '20px 0', 
          borderRadius: '15px',
          backgroundColor: '#f9f9f9',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          {/* Info partita */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>
              {match.homeTeam.name} vs {match.awayTeam.name}
            </h3>
            <div style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
              📅 {new Date(match.utcDate).toLocaleString()}
              <br />
              🏆 {match.competition?.name || 'Campionato'}
            </div>
            
            {/* Dati statistici */}
            {match.aiPronostico?.datiStatistici && (
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                fontSize: '12px', 
                color: '#555',
                flexWrap: 'wrap'
              }}>
                <span>📊 Casa: {match.aiPronostico.datiStatistici.homePosition}° posto</span>
                <span>📊 Trasferta: {match.aiPronostico.datiStatistici.awayPosition}° posto</span>
                <span>⚽ Gol attesi: {match.aiPronostico.datiStatistici.expectedGoals}</span>
              </div>
            )}
          </div>
          
          {/* Pronostico principale (il migliore) */}
          {match.aiPronostico?.pronosticoMigliore && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '12px',
                border: `3px solid ${getPronosticoColor(match.aiPronostico.pronosticoMigliore.probabilita)}`,
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '15px',
                  backgroundColor: getMercatoColor(match.aiPronostico.pronosticoMigliore.mercato),
                  color: 'white',
                  padding: '5px 12px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {match.aiPronostico.pronosticoMigliore.mercato}
                </div>
                
                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                        🎯 MIGLIOR PRONOSTICO: {match.aiPronostico.pronosticoMigliore.tipo}
                      </span>
                    </div>
                    <div style={{
                      backgroundColor: getPronosticoColor(match.aiPronostico.pronosticoMigliore.probabilita),
                      color: 'white',
                      padding: '8px 15px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {match.aiPronostico.confidenza}%
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '15px', color: '#555' }}>
                    <strong>💡 Analisi:</strong> {match.aiPronostico.reasoning}
                  </div>

                  {/* Barra di probabilità */}
                  <div style={{ 
                    width: '100%', 
                    backgroundColor: '#e0e0e0', 
                    borderRadius: '10px', 
                    height: '10px',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      width: `${match.aiPronostico.pronosticoMigliore.probabilita}%`,
                      backgroundColor: getPronosticoColor(match.aiPronostico.pronosticoMigliore.probabilita),
                      height: '100%',
                      borderRadius: '10px',
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottone per vedere tutti i pronostici */}
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <button
              onClick={() => toggleAllPronostics(match.id)}
              style={{
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              {showAllPronostics[match.id] ? '🔼 Nascondi tutti i pronostici' : '🔽 Vedi tutti i 16 pronostici'}
            </button>
          </div>

          {/* Tutti i pronostici (mostrati solo se richiesto) */}
          {showAllPronostics[match.id] && match.aiPronostico?.tuttiPronostici && (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '12px',
              border: '1px solid #ddd'
            }}>
              <h4 style={{ marginTop: '0', marginBottom: '15px', color: '#333' }}>
                📊 Tutti i pronostici analizzati dall'AI:
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '10px' 
              }}>
                {match.aiPronostico.tuttiPronostici
                  .sort((a, b) => b.probabilita - a.probabilita)
                  .map((pronostico, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      backgroundColor: index === 0 ? '#E8F5E8' : '#f5f5f5',
                      borderRadius: '8px',
                      border: index === 0 ? '2px solid #4CAF50' : '1px solid #ddd'
                    }}
                  >
                    <span style={{ 
                      fontSize: '13px',
                      fontWeight: index === 0 ? 'bold' : 'normal',
                      color: index === 0 ? '#2E7D32' : '#333'
                    }}>
                      {index === 0 && '👑 '}{pronostico.tipo}
                    </span>
                    <span style={{
                      backgroundColor: getMercatoColor(pronostico.mercato),
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {pronostico.probabilita}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      
      <footer style={{ textAlign: 'center', marginTop: '40px', color: '#666', fontSize: '12px' }}>
        🤖 AI Super-Intelligente • 16 mercati analizzati per partita
        <br />
        ⚠️ I pronostici sono generati automaticamente e non garantiscono risultati reali
      </footer>
    </div>
  );
}

export default App;
