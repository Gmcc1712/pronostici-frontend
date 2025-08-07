import React, { useEffect, useState } from 'react';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllPronostics, setShowAllPronostics] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);

  // Funzione per ottenere data di oggi in formato YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  };

  // Funzione per caricare partite
  const loadMatches = (date = '') => {
    setLoading(true);
    setError(null);
    setDebugInfo(null);
    
    const url = date 
      ? `https://pronostici-backend.onrender.com/api/matches?date=${date}`
      : 'https://pronostici-backend.onrender.com/api/matches';
    
    console.log(`🔄 Caricando partite da: ${url}`);
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Errore nel caricamento');
        return res.json();
      })
      .then(data => {
        setMatches(data);
        setLoading(false);
        
        // Debug info per capire cosa sta succedendo
        if (data.length === 0) {
          console.log('⚠️ Nessuna partita ricevuta, controllo info debug...');
          loadDebugInfo();
        }
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Funzione per caricare info debug sui campionati
  const loadDebugInfo = () => {
    fetch('https://pronostici-backend.onrender.com/api/status')
      .then(res => res.json())
      .then(data => {
        setDebugInfo(data);
        console.log('📊 Debug info:', data);
      })
      .catch(err => {
        console.error('Errore caricamento debug info:', err);
      });
  };

  // Carica partite di oggi al primo avvio
  useEffect(() => {
    const today = getTodayString();
    setSelectedDate(today);
    loadMatches(today);
  }, []);

  // Gestisce cambio data
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    loadMatches(newDate);
    setShowAllPronostics({});
  };

  const getPronosticoColor = (probabilita) => {
    if (probabilita >= 75) return '#4CAF50';
    if (probabilita >= 65) return '#8BC34A';
    if (probabilita >= 55) return '#FF9800';
    return '#9E9E9E';
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

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    const dateStr = date.toISOString().slice(0, 10);
    const todayStr = today.toISOString().slice(0, 10);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);
    
    if (dateStr === todayStr) return '🗓️ Oggi';
    if (dateStr === tomorrowStr) return '🗓️ Domani';
    
    return `🗓️ ${date.toLocaleDateString('it-IT', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    })}`;
  };

  // Funzione per formattare correttamente l'orario (FIX TIMEZONE)
  const formatMatchTime = (utcDateString) => {
    const date = new Date(utcDateString);
    return date.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Europe/Rome' // CORREZIONE: Forza timezone italiano CEST (GMT+2)
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>🤖 AI Super-Intelligente</div>
        <div>Analizzando partite per {selectedDate ? formatDateForDisplay(selectedDate) : 'oggi'}...</div>
        <div style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
          Mercati: 1X2 • Doppia Chance • Under/Over • Goal/No Goal
        </div>
        <div style={{ marginTop: '15px', color: '#888', fontSize: '12px' }}>
          Con debug avanzato per controllo campionati europei
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        ❌ Errore: {error}
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => loadMatches(selectedDate)}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            🔄 Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>🤖 AI Super-Intelligente</h1>
        <div style={{ color: '#666', marginBottom: '20px' }}>
          Pronostici automatici con analisi di 16 mercati diversi
        </div>
        
        {/* SELETTORE DATA */}
        <div style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '15px', 
          borderRadius: '12px', 
          marginBottom: '20px',
          display: 'inline-block'
        }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold', 
            color: '#333' 
          }}>
            📅 Seleziona data:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min="2025-01-01"
            max="2025-12-31"
            style={{
              padding: '10px 15px',
              fontSize: '16px',
              border: '2px solid #2196F3',
              borderRadius: '8px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          />
          {selectedDate && (
            <div style={{ marginTop: '8px', color: '#555', fontSize: '14px' }}>
              {formatDateForDisplay(selectedDate)}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', fontSize: '12px' }}>
          <span style={{ backgroundColor: '#2196F3', color: 'white', padding: '3px 8px', borderRadius: '10px' }}>1X2</span>
          <span style={{ backgroundColor: '#FF9800', color: 'white', padding: '3px 8px', borderRadius: '10px' }}>Doppia Chance</span>
          <span style={{ backgroundColor: '#9C27B0', color: 'white', padding: '3px 8px', borderRadius: '10px' }}>Under/Over</span>
          <span style={{ backgroundColor: '#4CAF50', color: 'white', padding: '3px 8px', borderRadius: '10px' }}>Goal/No Goal</span>
        </div>

        {/* DEBUG INFO quando non ci sono partite */}
        {debugInfo && matches.length === 0 && (
          <div style={{ 
            marginTop: '20px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '15px',
            fontSize: '12px',
            textAlign: 'left'
          }}>
            <strong>🔍 Info Debug API:</strong>
            <div>• Richieste utilizzate: {debugInfo.requestCount}/{debugInfo.requestLimit}</div>
            <div>• Richieste rimanenti: {debugInfo.remainingRequests}</div>
            <div>• Reset tra: {debugInfo.resetTime}</div>
            {debugInfo.supportedCompetitions && (
              <div>• Campionati supportati: {debugInfo.supportedCompetitions.join(', ')}</div>
            )}
          </div>
        )}
      </header>
      
      {/* MESSAGGIO QUANDO NON CI SONO PARTITE */}
      {matches.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px',
          backgroundColor: '#f9f9f9',
          borderRadius: '15px',
          border: '2px dashed #ccc'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>😴</div>
          <h3>Nessuna partita per {formatDateForDisplay(selectedDate)}</h3>
          <p style={{ color: '#666' }}>
            {selectedDate === '2025-08-23' ? (
              <>
                <strong>Nota sulla Serie A:</strong><br />
                Se la Serie A dovrebbe iniziare il 23 agosto 2025, potrebbero esserci questi motivi:<br />
                • L'API Football-Data.org non ha ancora i calendari aggiornati per la stagione 2025-26<br />
                • I campionati potrebbero essere disponibili solo a ridosso dell'inizio effettivo<br />
                • Il piano gratuito potrebbe avere limitazioni sui campionati europei<br />
                <br />
              </>
            ) : null}
            Prova a selezionare un'altra data o controlla nei giorni successivi.<br />
            <small style={{ color: '#888' }}>
              Al momento sono disponibili principalmente campionati brasiliani, portoghesi e MLS che sono attivi tutto l'anno.
            </small>
          </p>
          
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={() => loadMatches(selectedDate)}
              style={{
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              🔄 Ricarica
            </button>
            <button 
              onClick={loadDebugInfo}
              style={{
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              🔍 Aggiorna Debug Info
            </button>
          </div>
        </div>
      )}
      
      {/* LISTA PARTITE */}
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
              ⏰ {formatMatchTime(match.utcDate)} {/* ORARIO CORRETTO CON TIMEZONE */}
              <br />
              🏆 {match.competition?.name || 'Campionato'}
              <br />
              📅 {new Date(match.utcDate).toLocaleDateString('it-IT')}
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
                <span>💪 Casa: {match.aiPronostico.datiStatistici.homeStrength}/10</span>
                <span>💪 Trasferta: {match.aiPronostico.datiStatistici.awayStrength}/10</span>
                <span>⚽ Gol attesi: {match.aiPronostico.datiStatistici.expectedGoals}</span>
              </div>
            )}
          </div>
          
          {/* Pronostico principale */}
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

          {/* Tutti i pronostici */}
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
        🤖 AI Super-Intelligente • 16 mercati analizzati per partita • Seleziona qualsiasi data
        <br />
        ⚠️ I pronostici sono generati automaticamente e non garantiscono risultati reali
        <br />
        <small style={{ color: '#888' }}>
          🔧 Con debug avanzato per controllo problemi API e campionati
        </small>
      </footer>
    </div>
  );
}

export default App;
