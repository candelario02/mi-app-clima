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
        // Cálculo de hora local exacta
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

  const obtenerClaseFondo = () => {
    if (!clima) return 'app-container default-bg';
    const estado = clima.weather[0].main.toLowerCase();
    if (estado.includes('rain')) return 'app-container rain-bg';
    if (estado.includes('snow')) return 'app-container snow-bg';
    return 'app-container sunny-bg';
  };

  return (
    <div className={obtenerClaseFondo()}>
      {/* Capa de lluvia o nieve animada fuera del cuadro */}
      {clima?.weather[0].main.toLowerCase().includes('rain') && <div className="rain-animation"></div>}
      
      <div className="weather-card">
        <h1 className="main-title">Estado del Clima</h1>
        
        <div className="search-group">
          <input 
            type="text" 
            placeholder="Ej: Iquitos" 
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />
          <button onClick={fetchClima}>BUSCAR</button>
        </div>

        {clima && (
          <div className="weather-info">
            <p className="time-display">{horaLocal}</p>
            <h2 className="city-display">{clima.name}, {clima.sys.country}</h2>
            
            <div className="visual-section">
              <img 
                src={clima.weather[0].main === 'Clear' 
                  ? "https://cdn-icons-png.flaticon.com/512/4814/4814268.png" 
                  : `https://openweathermap.org/img/wn/${clima.weather[0].icon}@4x.png`
                } 
                alt="weather-status" 
                className="weather-icon-large"
              />
              <p className="temp-main">{Math.round(clima.main.temp)}°C</p>
            </div>

            <p className="desc-text">{clima.weather[0].description}</p>
            
            <div className="stats-grid">
              <div className="stat-box">
                <p>Humedad</p>
                <strong>{clima.main.humidity}%</strong>
              </div>
              <div className="stat-box">
                <p>Viento</p>
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