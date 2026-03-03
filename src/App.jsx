import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [bilhetes, setBilhetes] = useState([])

  useEffect(() => {
    fetch('https://localhost:7002/cotas-disponiveis/3')
      .then(resposta => resposta.json()) 
      .then(dados => setBilhetes(dados)) 
  }, [])

  return (
    <div>
      <h1>Rifa do iPhone</h1>
      <p>Temos {bilhetes.length} bilhetes disponíveis!</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(10, 1fr)',
        gap: '10px', 
        maxWidth: '700px',
        margin: '20px auto'
      }}>
        {bilhetes.map(cota => (
          <div 
            key={cota.id} 
            onClick={() => alert(`Você selecionou o bilhete número ${cota.numero}!`)}
            style={{ 
              padding: '15px 0',
              backgroundColor: '#28a745', 
              color: 'white', 
              borderRadius: '8px', 
              fontWeight: 'bold',
              cursor: 'pointer',
              textAlign: 'center' 
            }}
          >
            {cota.numero}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App