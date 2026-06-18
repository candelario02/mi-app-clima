import { useState } from 'react'
import HoraLocal from './components/HoraLocal'
import './index.css'

const fondosClima = {
  Clear: 'linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%)',
  Clouds: 'linear-gradient(to bottom, #bdc3c7, #2c3e50)',
  Rain: 'linear-gradient(to bottom, #4b6cb7, #182848)',
  Noche: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)',
}

function App() {
  const [inputCiudad, setInputCiudad] = useState('')
  const [clima, setClima] = useState(null)
  const [fondoActual, setFondoActual] = useState(fondosClima.Noche)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const esDeNoche = (data) => {
    const ahoraUTC = Math.floor(Date.now() / 1000)
    return ahoraUTC < data.sys.sunrise || ahoraUTC > data.sys.sunset
  }

  const buscarClima = async () => {
    if (!inputCiudad.trim()) return
    const API_KEY = import.meta.env.VITE_API_KEY || ''
    if (!API_KEY) {
      setError('API Key no configurada. Crea un archivo .env con VITE_API_KEY.')
      return
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputCiudad}&appid=${API_KEY}&units=metric&lang=es`

    setCargando(true)
    setError('')

    try {
      const response = await fetch(url)
      const data = await response.json()
      if (data.cod === 200) {
        setClima(data)
        setFondoActual(esDeNoche(data) ? fondosClima.Noche : (fondosClima[data.weather[0].main] || fondosClima.Clear))
      } else {
        setError(data.message === 'city not found' ? 'Ciudad no encontrada' : data.message)
      }
    } catch {
      setError('Error de conexión. Verifica tu internet.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="app-viewport" style={{ background: fondoActual }}>
      <div className="overlay">
        <div className="search-container animate-fade-down">
          <input
            type="text"
            placeholder="Buscar ciudad..."
            value={inputCiudad}
            onChange={(e) => setInputCiudad(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && buscarClima()}
          />
          <button onClick={buscarClima} disabled={cargando}>
            {cargando ? 'Buscando...' : 'Buscar Clima'}
          </button>
        </div>

        {error && <p className="error-msg">{error}</p>}

        {clima && !cargando && (
          <main className="main-weather animate-fade-up">
            <div className="header-info">
              <h2>{clima.name}, {clima.sys.country}</h2>
              <HoraLocal timezone={clima.timezone} />
            </div>
            <div className="hero-temp">
              <h1 className="temp-pulse">{Math.round(clima.main.temp)}°</h1>
              <p className="condition">{clima.weather[0].description}</p>
            </div>
            <div className="details-grid">
              {[
                { label: 'Sensación', val: `${Math.round(clima.main.feels_like)}°` },
                { label: 'Humedad', val: `${clima.main.humidity}%` },
                { label: 'Viento', val: `${clima.wind.speed} m/s` },
                { label: 'Mín / Máx', val: `${Math.round(clima.main.temp_min)}° / ${Math.round(clima.main.temp_max)}°` },
              ].map((item, i) => (
                <div key={i} className="detail-item">
                  <span>{item.label}</span>
                  <p>{item.val}</p>
                </div>
              ))}
            </div>
          </main>
        )}
      </div>
    </div>
  )
}

export default App
