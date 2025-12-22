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
        // Cálculo de hora local
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
    <div className="contenedor-principal">
      <div className="tarjeta-clima">
        <h1 className="titulo">Estado del Clima</h1>
        
        <div className="caja-busqueda">
          <input 
            type="text" 
            placeholder="Ej: Barcelona" 
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />
          <button className="boton-buscar" onClick={fetchClima}>BUSCAR</button>
        </div>

        {clima && (
          <div className="contenido-clima">
            {/* Usamos horaLocal aquí para eliminar el error de VS Code */}
            <p className="reloj-digital">{horaLocal}</p>
            <h2 className="nombre-ciudad">{clima.name}, {clima.sys.country}</h2>
            
            <div className="area-visual">
              {/* Imagen de sol garantizada que no falla */}
              <img 
                src="https://fonts.gstatic.com/s/i/short-term/release/googlestylesheet/sunny/v11/512.png" 
                alt="Sol animado" 
                className="icono-sol-gigante"
              />
              <p className="temp-valor">{Math.round(clima.main.temp)}°C</p>
            </div>

            <p className="clima-descripcion">{clima.weather[0].description}</p>
            
            <div className="bloque-detalles">
              <div className="dato">
                <span>Humedad</span>
                <strong>{clima.main.humidity}%</strong>
              </div>
              <div className="dato">
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