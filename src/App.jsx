import { useState } from 'react'
import './App.css'

function App() {
  const [ciudad, setCiudad] = useState('')
  const [clima, setClima] = useState(null)

  const fetchClima = async () => {
    const API_KEY = '4f89bdddcd34913cecd9de966eed5f19' 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`
    
    try {
      const response = await fetch(url)
      const data = await response.json()
      if (data.cod === 200) {
        setClima(data)
      } else {
        alert("Ciudad no encontrada")
      }
    } catch (error) {
      console.error("Error al obtener el clima", error)
    }
  }

  // Define el color del cielo exterior
  const obtenerCieloExterior = () => {
    if (!clima) return 'app-main default-sky';
    const temp = clima.main.temp;
    const estado = clima.weather[0].main.toLowerCase();

    if (temp > 28 || estado.includes('clear')) return 'app-main sunny-sky';
    if (estado.includes('cloud')) return 'app-main cloudy-sky';
    if (estado.includes('rain')) return 'app-main rainy-sky';
    return 'app-main default-sky';
  };

  return (
    <div className={obtenerCieloExterior()}>
      <div className="glass-card">
        <h1>Estado del Clima</h1>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Buscar ciudad..." 
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />
          <button onClick={fetchClima}>Buscar</button>
        </div>

        {clima && (
          <div className="weather-data">
            <h2>{clima.name}, {clima.sys.country}</h2>
            
            {/* Imagen ilustrativa dentro del cuadro */}
            <div className="illustration-container">
              <img 
                src={`https://openweathermap.org/img/wn/${clima.weather[0].icon}@4x.png`} 
                alt="weather-illustration" 
                className="big-icon"
              />
            </div>

            <p className="big-temp">{Math.round(clima.main.temp)}°C</p>
            <p className="status-text">{clima.weather[0].description}</p>
            
            <div className="info-grid">
              <p>Humedad: {clima.main.humidity}%</p>
              <p>Viento: {clima.wind.speed} m/s</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App