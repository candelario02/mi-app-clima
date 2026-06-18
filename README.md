# App del Clima

App del clima en tiempo real construida con React + Vite.

## Configuración

1. Clona el repositorio
2. Crea un archivo `.env` en la raíz con tu API key de OpenWeatherMap:

```
VITE_API_KEY=tu_api_key_aqui
```

3. Instala dependencias:

```bash
npm install
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

## Uso

Escribe el nombre de una ciudad y presiona Enter o haz clic en "Buscar Clima". La app muestra temperatura actual, sensación térmica, humedad, velocidad del viento, mín/máx, y la hora local de la ciudad consultada.

El fondo se adapta según el clima (despejado, nublado, lluvia) y si es de día o de noche.
