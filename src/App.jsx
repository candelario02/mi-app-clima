import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [inputCiudad, setInputCiudad] = useState('')
  const [clima, setClima] = useState(null)
  const [horaLocal, setHoraLocal] = useState('')
  const [cargando, setCargando] = useState(false)

  // Función mágica para calcular la hora de cualquier país
  const calcularHora = (timezone) => {
    const fechaActual = new Date();
    const utc = fechaActual.getTime() + (fechaActual.getTimezoneOffset() * 60000);
    const fechaCiudad = new Date(utc + (1000 * timezone));
    return fechaCiudad.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit', // Añadimos segundos para que veas que se mueve
      hour12: true
    });
  }

  // Este bloque elimina el error de "useEffect" y mantiene el reloj vivo
  useEffect(() => {
    if (!clima) return;

    const intervalo = setInterval(() => {
      setHoraLocal(calcularHora(clima.timezone));
    }, 1000); // Se actualiza cada segundo

    return () => clearInterval(intervalo);
  }, [clima]);

  const buscarClima = async () => {
    if (!inputCiudad) return
    setCargando(true)
    
    // RECUERDA: Debes poner tu API KEY real aquí para que funcione
    const API_KEY = '4f89bdddcd34913cecd9de966eed5f19' 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputCiudad}&appid=${API_KEY}&units=metric&lang=es`

    try {
      const response = await fetch(url)
      const data = await response.json()
      if (data.cod === 200) {
        setClima(data)
        setHoraLocal(calcularHora(data.timezone))
      } else {
        alert("Ciudad no encontrada")
      }
    } catch (error) {
      console.error("Error", error)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="app-viewport">
      <div className="overlay">
        <div className="search-container animate-fade-down">
          <input 
            type="text" 
            placeholder="Buscar ciudad (ej: Barcelona)..." 
            value={inputCiudad}
            onChange={(e) => setInputCiudad(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && buscarClima()}
          />
          <button onClick={buscarClima} disabled={cargando}>
            {cargando ? '...' : '🔍'}
          </button>
        </div>

        {clima ? (
          <main className="main-weather animate-fade-up">
            <div className="header-info">
              <h2>{clima.name}, {clima.sys.country}</h2>
              <p className="local-time-badge">🕒 Hora local: {horaLocal}</p>
            </div>

            <div className="hero-temp">
              <h1 className="temp-pulse">{Math.round(clima.main.temp)}°</h1>
              <p className="condition">{clima.weather[0].description}</p>
              <p className="details">Humedad: {clima.main.humidity}% • Viento: {clima.wind.speed} m/s</p>
            </div>
            
            <section className="forecast-section">
              <div className="forecast-card glass-morph">
                <h3>ℹ️ Información Detallada</h3>
                <div className="forecast-grid">
                  <div className="day-item active">
                    <span>Mín / Máx</span>
                    <span className="temps">{Math.round(clima.main.temp_min)}° / {Math.round(clima.main.temp_max)}°</span>
                  </div>
                </div>
              </div>
            </section>
          </main>
        ) : (
          <div className="welcome-message animate-pulse-soft">
            <h2>🌤️ ¡Hola Candelario!</h2>
            <p>Busca una ciudad para ver su clima y hora exacta.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App