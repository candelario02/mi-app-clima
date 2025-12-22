import { useState } from 'react'
import './App.css'

function App() {
  const [ciudad, setCiudad] = useState('')
  const [clima, setClima] = useState(null)
  const [horaLocal, setHoraLocal] = useState('')

  const fetchClima = async () => {
    const API_KEY = '4f89bdddcd34913cecd9de966eed5f19' 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`
    
    try {
      const response = await fetch(url)
      const data = await response.json()
      if (data.cod === 200) {
        setClima(data)
        // Cálculo de hora local sin errores
        const ahora = new Date()
        const utc = ahora.getTime() + (ahora.getTimezoneOffset() * 60000)
        const fechaCiudad = new Date(utc + (1000 * data.timezone))
        setHoraLocal(fechaCiudad.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }))
      } else {
        alert("Ciudad no encontrada")
      }
    } catch (error) {
      console.error("Error", error)
    }
  }

  return (
    <div className="main-viewport">
      <div className="weather-glass-card">
        <h1 className="title">Estado del Clima</h1>
        
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Escribe una ciudad..." 
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />
          <button onClick={fetchClima}>BUSCAR</button>
        </div>

        {clima && (
          <div className="result-container">
            {/* Aquí usamos horaLocal para que desaparezca el error */}
            <p className="local-hour">{horaLocal}</p>
            <h2 className="city-title">{clima.name}, {clima.sys.country}</h2>
            
            <div className="visual-block">
              <img 
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20Places/Sun%20with%20Face.png" 
                alt="sol animado" 
                className="sun-icon-animated"
              />
              <p className="temperature">{Math.round(clima.main.temp)}°C</p>
            </div>

            <p className="weather-desc">{clima.weather[0].description}</p>
            
            <div className="bottom-stats">
              <div className="stat-unit">
                <span>Humedad</span>
                <strong>{clima.main.humidity}%</strong>
              </div>
              <div className="stat-unit">
                <span>Viento</span>
                <strong>{clima.wind.speed} m/s</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App