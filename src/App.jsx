import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [inputCiudad, setInputCiudad] = useState('')
  const [clima, setClima] = useState(null)
  const [horaLocal, setHoraLocal] = useState('')
  const [fondoActual, setFondoActual] = useState('linear-gradient(to bottom, #2c3e50, #000000)')

  const fondosClima = {
    Clear: 'linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%)',
    Clouds: 'linear-gradient(to bottom, #bdc3c7, #2c3e50)',
    Rain: 'linear-gradient(to bottom, #4b6cb7, #182848)',
    Noche: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)'
  }

  const obtenerFechaLocal = (timezone) => {
    const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
    return new Date(utc + (1000 * timezone));
  }

  useEffect(() => {
    if (!clima) return;
    const tick = () => {
      const fecha = obtenerFechaLocal(clima.timezone);
      setHoraLocal(fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    tick(); // Ejecutar inmediatamente
    const intervalo = setInterval(tick, 1000);
    return () => clearInterval(intervalo);
  }, [clima]);

  const buscarClima = async () => {
    if (!inputCiudad) return;
    const API_KEY = '4f89bdddcd34913cecd9de966eed5f19'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputCiudad}&appid=${API_KEY}&units=metric&lang=es`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.cod === 200) {
        setClima(data);
        const hora = obtenerFechaLocal(data.timezone).getHours();
        setFondoActual((hora >= 19 || hora <= 6) ? fondosClima.Noche : (fondosClima[data.weather[0].main] || fondosClima.Clear));
      } else { alert("Ciudad no encontrada"); }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="app-viewport" style={{ background: fondoActual }}>
      <div className="overlay">
        <div className="search-container animate-fade-down">
          <input type="text" placeholder="Buscar ciudad..." value={inputCiudad} 
            onChange={(e) => setInputCiudad(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && buscarClima()} />
          <button onClick={buscarClima}>🔍</button>
        </div>

        {clima && (
          <main className="main-weather animate-fade-up">
            <div className="header-info">
              <h2>{clima.name}, {clima.sys.country}</h2>
              <p className="local-time-badge">🕒 {horaLocal}</p>
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
                { label: 'Mín / Máx', val: `${Math.round(clima.main.temp_min)}° / ${Math.round(clima.main.temp_max)}°` }
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
  );
}
export default App;