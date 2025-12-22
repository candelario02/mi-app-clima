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
        // Cálculo de hora local para que no tenga desfase
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
    <div className="main-screen">
      <div className="glass-card">
        <h1 className="title">Estado del Clima</h1>
        
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Introduce ciudad..." 
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />
          <button className="btn-buscar" onClick={fetchClima}>BUSCAR</button>
        </div>

        {clima && (
          <div className="weather-content">
            <p className="time-text">{horaLocal}</p>
            <h2 className="city-text">{clima.name}, {clima.sys.country}</h2>
            
            <div className="icon-container">
              {/* Sol con cara animado idéntico al ejemplo */}
              <img 
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20Places/Sun%20with%20Face.png" 
                alt="sol" 
                className="animated-sun"
              />
              <p className="temp-text">{Math.round(clima.main.temp)}°C</p>
            </div>

            <p className="description">{clima.weather[0].description}</p>
            
            <div className="footer-info">
              <div className="item">
                <small>Humedad</small>
                <p>{clima.main.humidity}%</p>
              </div>
              <div className="item">
                <small>Viento</small>
                <p>{clima.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App