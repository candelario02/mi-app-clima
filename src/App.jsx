import { useState } from 'react'
import './App.css'

function App() {
  const [inputCiudad, setInputCiudad] = useState('') // Para lo que escribes
  const [clima, setClima] = useState(null) // Empieza vacío (null)

  const buscarClima = async () => {
    if (!inputCiudad) return
    
    // Reemplaza 'TU_API_KEY' con tu llave de OpenWeatherMap
    const API_KEY = '4f89bdddcd34913cecd9de966eed5f19' 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputCiudad}&appid=${API_KEY}&units=metric&lang=es`

    try {
      const response = await fetch(url)
      const data = await response.json()
      if (data.cod === 200) {
        setClima(data)
      } else {
        alert("Ciudad no encontrada")
      }
    } catch (error) {
      console.error("Error al obtener datos", error)
    }
  }

  return (
    <div className="app-viewport">
      <div className="overlay">
        {/* BUSCADOR DINÁMICO */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Buscar ciudad..." 
            value={inputCiudad}
            onChange={(e) => setInputCiudad(e.target.value)}
          />
          <button onClick={buscarClima}>🔍</button>
        </div>

        {clima ? (
          <main className="main-weather">
            <header className="app-header">
              <h2>{clima.name}, {clima.sys.country}</h2>
            </header>

            <div className="hero-temp">
              <h1>{Math.round(clima.main.temp)}°</h1>
              <p className="condition">{clima.weather[0].description}</p>
              <p className="feels-like">
                Humedad: {clima.main.humidity}% • Viento: {clima.wind.speed} m/s
              </p>
            </div>

            <section className="forecast-section">
              <div className="forecast-card">
                <h3>🕒 Información Detallada</h3>
                <div className="forecast-grid">
                  <div className="day-item active">
                    <span>Mín</span>
                    <span className="temps">{Math.round(clima.main.temp_min)}°</span>
                  </div>
                  <div className="day-item active">
                    <span>Máx</span>
                    <span className="temps">{Math.round(clima.main.temp_max)}°</span>
                  </div>
                </div>
              </div>
            </section>
          </main>
        ) : (
          <div className="welcome-message">
            <h2>🌤️ ¡Bienvenido!</h2>
            <p>Escribe el nombre de una ciudad para ver el clima</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App