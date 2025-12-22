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
        calcularHora(data.timezone)
      } else {
        alert("Ciudad no encontrada")
      }
    } catch (error) {
      console.error("Error al obtener el clima", error)
    }
  }

  // Función para calcular la hora del país buscado
  const calcularHora = (timezoneOffset) => {
    const d = new Date()
    const localTime = d.getTime()
    const localOffset = d.getTimezoneOffset() * 60000
    const utc = localTime + localOffset
    const ciudadTime = utc + (1000 * timezoneOffset)
    const fechaCiudad = new Date(ciudadTime)
    setHoraLocal(fechaCiudad.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  }

  const obtenerCieloExterior = () => {
    if (!clima) return 'app-wrapper cielo-default';
    const estado = clima.weather[0].main.toLowerCase();
    if (estado.includes('clear')) return 'app-wrapper cielo-despejado';
    if (estado.includes('cloud')) return 'app-wrapper cielo-nubes';
    if (estado.includes('rain')) return 'app-wrapper cielo-lluvia';
    return 'app-wrapper cielo-default';
  };

  return (
    <div className={obtenerCieloExterior()}>
      <div className="main-container">
        <div className="search-section">
          <input 
            type="text" 
            className="big-input"
            placeholder="¿Qué ciudad buscas?" 
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />
          <button className="big-button" onClick={fetchClima}>BUSCAR</button>
        </div>

        {clima && (
          <div className="weather-card-dynamic">
            <p className="local-time">Hora local: {horaLocal}</p>
            <h2 className="city-name">{clima.name}, {clima.sys.country}</h2>
            
            <div className="main-visual">
              {/* Icono del sol o clima mucho más grande */}
              <img 
                src={`https://openweathermap.org/img/wn/${clima.weather[0].icon}@4x.png`} 
                alt="weather-sun" 
                className="giant-weather-icon"
              />
              <span className="big-temp-text">{Math.round(clima.main.temp)}°C</span>
            </div>

            <p className="weather-desc">{clima.weather[0].description}</p>
            
            <div className="bottom-details">
              <div className="detail-item">
                <p>Humedad</p>
                <strong>{clima.main.humidity}%</strong>
              </div>
              <div className="detail-item">
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