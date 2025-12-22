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

  const obtenerFondo = () => {
    if (!clima) return 'default-bg';
    const main = clima.weather[0].main.toLowerCase();
    if (main.includes('clear')) return 'sunny-bg';
    if (main.includes('rain')) return 'rainy-bg';
    if (main.includes('cloud')) return 'cloudy-bg';
    return 'default-bg';
  };

  return (
    <div className={`main-container ${obtenerFondo()}`}>
      {/* Capas de animación reales */}
      <div className="weather-overlay"></div>
      
      <div className="glass-card">
        <h1 className="main-title">Estado del Clima</h1>
        
        <div className="search-group">
          <input 
            type="text" 
            placeholder="Escribe una ciudad..." 
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />
          <button onClick={fetchClima}>BUSCAR</button>
        </div>

        {clima && (
          <div className="weather-data">
            <p className="time-now">{horaLocal}</p>
            <h2 className="city-name">{clima.name}, {clima.sys.country}</h2>
            
            <div className="visual-weather">
              {/* Usamos el icono oficial pero con efectos CSS para que brille */}
              <img 
                src={`https://openweathermap.org/img/wn/${clima.weather[0].icon}@4x.png`} 
                alt="icono clima" 
                className="weather-icon-animate"
              />
              <p className="temp-big">{Math.round(clima.main.temp)}°C</p>
            </div>

            <p className="weather-desc">{clima.weather[0].description}</p>
            
            <div className="info-grid">
              <div className="info-box"><span>Humedad</span><strong>{clima.main.humidity}%</strong></div>
              <div className="info-box"><span>Viento</span><strong>{clima.wind.speed} m/s</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App