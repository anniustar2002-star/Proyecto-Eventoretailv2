# Informe 01: Cimientos + Pantalla 1 (Inicio)

Estado: **lista para revisión del usuario**. Captura: `01-inicio.png` (compara con `Carrera-de-escaneo-imagenes/.../gs1_market_pantalla_tv_interactiva/screen.png`).

## Qué se hizo
**Cimientos (`gs1-market/`)**: Electron + Vite + React + TypeScript estricto + Tailwind. Fuentes Inter y Plus Jakarta Sans empaquetadas (sin CDN).
- `electron/main.cjs` y `preload.cjs`: ventana a pantalla completa y guardado de datos en archivo JSON local (en navegador cae a `localStorage`).
- `src/data/products.ts`: los 10 productos con GTIN de prueba (único lugar a cambiar).
- `src/lib/`: reglas (1:30, +5 s), validación de GTIN, orden aleatorio y orden de desempate sin coincidencias, ranking (más productos, luego menor tiempo), formato de reloj, almacenamiento.
- `src/hooks/useBarcodeScanner.ts`: escucha la pistola USB (teclea dígitos y Enter).

**Pantalla 1 (Inicio)**: título, 3 tarjetas (10 productos, 2 por equipo, 1:30), botón "¡Comenzar partida!", prueba de pistola (real o botón de simulación, con contador x/10), Top 3 real desde los resultados guardados, "Reglas Rápidas" (modal) y "Ver Tabla de Posiciones".

## Cambios respecto a la maqueta
- **Sin fecha** del evento (ni en cabecera, chips ni pie). El reloj muestra solo la hora.
- 8 SKU -> 10 productos; "máx. 5 por equipo" -> 2; "60s" -> 1:30; "Leídos 0/8" -> 0/10.
- Se quitó el botón de sonido y el pie de página con fecha. "Ver Récords del Día" -> "Ver Tabla de Posiciones".
- Se mantiene la sede "Hotel Eurobuilding • Caracas".
- El simulador ahora reconoce los GTIN reales de la canasta y avisa si el código no pertenece.

## Verificación
- `tsc --noEmit` sin errores; `vitest`: 8 pruebas pasan (GTIN válidos y únicos, orden, desempate, ranking, formato).
- `vite build` correcto, fuentes incluidas en `dist/`.
- Captura con Chromium a 1600 px: sin errores de consola y sin texto de fecha.
- **No verificado**: la ventana de Electron (no se pudo abrir aquí). Solo se comprobó la sintaxis de `main.cjs` y `preload.cjs`. Falta probarlo en Windows, y probar la pistola real.

## Para revisar
- ¿Coincide con lo que querías? ¿Se queda "Ver Tabla de Posiciones" o prefieres otro texto?
- La barra de navegación inferior de la maqueta no se incluyó (tapaba contenido); la navegación será con los botones de cada pantalla.
