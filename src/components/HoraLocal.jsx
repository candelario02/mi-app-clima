import { useState, useEffect } from 'react'

function obtenerFechaLocal(timezone) {
  const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000
  return new Date(utc + 1000 * timezone)
}

export default function HoraLocal({ timezone }) {
  const [hora, setHora] = useState(() => obtenerFechaLocal(timezone))

  useEffect(() => {
    const tick = () => setHora(obtenerFechaLocal(timezone))
    const intervalo = setInterval(tick, 1000)
    return () => clearInterval(intervalo)
  }, [timezone])

  return (
    <p className="local-time-badge">
      🕒 {hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
    </p>
  )
}
