import { useState } from 'react'
import './App.css'

function App() {
  const [ciudad, setCiudad] = useState('')
  const [clima, setClima] = useState(null)

  const fetchClima = async () => {
    const API_KEY = '4f89bdddcd34913cecd9de966eed5f19' // Luego te ayudo a conseguirla
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

  return (
    <div className="weather-container">
      <h1>Estado del Clima</h1>
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Escribe una ciudad..." 
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
        />
        <button onClick={fetchClima}>Buscar</button>
      </div>

      {clima && (
        <div className="weather-info">
          <h2>{clima.name}, {clima.sys.country}</h2>
          <p className="temp">{Math.round(clima.main.temp)}°C</p>
          <p className="desc">{clima.weather[0].description}</p>
          <div className="details">
            <span>Humedad: {clima.main.humidity}%</span>
            <span>Viento: {clima.wind.speed} m/s</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default App