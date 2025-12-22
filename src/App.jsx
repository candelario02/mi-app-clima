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
      } else { alert("Ciudad no encontrada") }
    } catch (error) { console.error("Error", error) }
  }

  return (
    <div className={`contenedor-clima ${clima ? clima.weather[0].main.toLowerCase() : 'clear'}`}>
      {/* Fondo de nubes animadas con CSS */}
      <div className="nubes-animadas"></div>

      <div className="tarjeta-cristal">
        <h1 className="titulo-app">Estado del Clima</h1>
        <div className="buscador">
          <input type="text" placeholder="iquitos..." value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
          <button onClick={fetchClima}>BUSCAR</button>
        </div>

        {clima && (
          <div className="info-principal">
            <p className="hora">{horaLocal}</p>
            <h2 className="ciudad">{clima.name}, {clima.sys.country}</h2>
            
            <div className="icono-contenedor">
              {/* Sol con cara dibujado con CSS para que no falle */}
              {clima.weather[0].main === 'Clear' ? (
                <div className="sol-cara-css">
                  <div className="ojos"></div>
                  <div className="boca"></div>
                </div>
              ) : (
                <span className="emoji-clima">
                  {clima.weather[0].main === 'Rain' ? '🌧️' : '☁️'}
                </span>
              )}
              <p className="temp">{Math.round(clima.main.temp)}°C</p>
            </div>

            <p className="desc">{clima.weather[0].description}</p>
            <div className="detalles">
              <div><span>Humedad</span><strong>{clima.main.humidity}%</strong></div>
              <div><span>Viento</span><strong>{clima.wind.speed} m/s</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App