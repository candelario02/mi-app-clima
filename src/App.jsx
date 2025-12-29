import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [inputCiudad, setInputCiudad] = useState('')
  const [clima, setClima] = useState(null)
  const [horaLocal, setHoraLocal] = useState('')
  // Definimos el estado inicial con un gradiente neutro
  const [fondoActual, setFondoActual] = useState('linear-gradient(to bottom, #2c3e50, #000000)')

  const fondosClima = {
    Clear: 'linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%)', // Sol
    Clouds: 'linear-gradient(to bottom, #bdc3c7, #2c3e50)',       // Nubes
    Rain: 'linear-gradient(to bottom, #4b6cb7, #182848)',        // Lluvia
    Noche: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)' // Noche
  }

  const calcularHora = (timezone) => {
    const fechaActual = new Date();
    const utc = fechaActual.getTime() + (fechaActual.getTimezoneOffset() * 60000);
    return new Date(utc + (1000 * timezone));
  }

  useEffect(() => {
    if (!clima) return;
    const intervalo = setInterval(() => {
      const fecha = calcularHora(clima.timezone);
      setHoraLocal(fecha.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
      }));
    }, 1000);
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
        const fecha = calcularHora(data.timezone);
        const horaDigit = fecha.getHours();

        // Lógica de fondo por hora y estado del tiempo
        if (horaDigit >= 19 || horaDigit <= 6) {
          setFondoActual(fondosClima.Noche);
        } else {
          const estadoClima = data.weather[0].main;
          setFondoActual(fondosClima[estadoClima] || fondosClima.Clear);
        }
      } else { 
        alert("Ciudad no encontrada"); 
      }
    } catch (error) { 
      console.error(error); 
    }
  };

  return (
    // Usamos 'background' en lugar de 'backgroundImage' porque son gradientes
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

    {/* ESTA ES LA PARTE ÚTIL: Panel de detalles */}
    <div className="details-grid">
      <div className="detail-item">
        <span>Sensación</span>
        <p>{Math.round(clima.main.feels_like)}°</p>
      </div>
      <div className="detail-item">
        <span>Humedad</span>
        <p>{clima.main.humidity}%</p>
      </div>
      <div className="detail-item">
        <span>Viento</span>
        <p>{clima.wind.speed} m/s</p>
      </div>
      <div className="detail-item">
        <span>Mín / Máx</span>
        <p>{Math.round(clima.main.temp_min)}° / {Math.round(clima.main.temp_max)}°</p>
      </div>
    </div>
  </main>
)}
      </div>
    </div>
  );
}

export default App;