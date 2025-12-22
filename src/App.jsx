import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [inputCiudad, setInputCiudad] = useState('')
  const [clima, setClima] = useState(null)
  const [horaLocal, setHoraLocal] = useState('')
  const [fondoActual, setFondoActual] = useState('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000')

  const fondosClima = {
    Clear: 'https://images.unsplash.com/photo-1506452305024-9d3f02d1c9b5?q=80&w=1000',
    Clouds: 'https://images.unsplash.com/photo-1483977399921-6cf3810ff51a?q=80&w=1000',
    Rain: 'https://images.unsplash.com/photo-1534274988757-a28bf1f539cf?q=80&w=1000',
    Noche: 'https://images.unsplash.com/photo-1506606401543-2e73709cebb4?q=80&w=1000'
  }

  const calcularHora = (timezone) => {
    const fechaActual = new Date();
    const utc = fechaActual.getTime() + (fechaActual.getTimezoneOffset() * 60000);
    return new Date(utc + (1000 * timezone));
  }

  // Actualiza el reloj cada segundo automáticamente
  useEffect(() => {
    if (!clima) return;
    const intervalo = setInterval(() => {
      const fecha = calcularHora(clima.timezone);
      setHoraLocal(fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    }, 1000);
    return () => clearInterval(intervalo);
  }, [clima]);

  const buscarClima = async () => {
    if (!inputCiudad) return;
    const API_KEY = 'TU_API_KEY_AQUI'; // Reemplaza esto con tu llave real
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputCiudad}&appid=${API_KEY}&units=metric&lang=es`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.cod === 200) {
        setClima(data);
        const fecha = calcularHora(data.timezone);
        const horaDigit = fecha.getHours();
        
        // Lógica de fondo: Noche o Clima
        if (horaDigit >= 19 || horaDigit <= 6) {
          setFondoActual(fondosClima.Noche);
        } else {
          setFondoActual(fondosClima[data.weather[0].main] || fondosClima.Clear);
        }
      } else { alert("Ciudad no encontrada"); }
    } catch (error) { console.error(error); }
  };

  return (
    <div className="app-viewport" style={{ backgroundImage: `url(${fondoActual})` }}>
      <div className="overlay">
        <div className="search-container animate-fade-down">
          <input 
            type="text" 
            placeholder="Buscar ciudad..." 
            value={inputCiudad}
            onChange={(e) => setInputCiudad(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && buscarClima()}
          />
          <button onClick={buscarClima}>🔍</button>
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
            </div>
          </main>
        ) : (
          <div className="welcome-message animate-pulse-soft">
            <h2>🌤️ ¡Hola Candelario!</h2>
            <p>Busca una ciudad para ver su clima y hora exacta.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;