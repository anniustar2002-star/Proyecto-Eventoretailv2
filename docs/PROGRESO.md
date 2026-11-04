# Progreso

Última actualización: ver historial de git de este archivo.

## Estado actual
- Fase 0 (cimientos): **hecha** (`gs1-market/`).
- Pantalla 1 (Inicio): **CERRADA / aprobada** (`informes/01-pantalla-inicio.md`).
- Pantalla 2 (Registro): **CERRADA / aprobada** (`informes/02-pantalla-registro.md`).
- Pantalla 3 (Desafío): **lista, esperando revisión del usuario** (`informes/03-pantalla-desafio.md`).
- Pantalla 4 (Posiciones): pendiente.

## Siguiente paso
Revisión de la pantalla 3. Con su visto bueno: pantalla 4 (Tabla de posiciones). Debe caber en el lienzo 1920x1080 sin scroll.
Comandos: `cd gs1-market && npm install && npm run dev` (navegador), `npm test`, `npm run build`.

## Bitácora
- Informe 00: análisis de la app anterior (descartada) y de la maqueta nueva. Ver `informes/00-analisis-inicial.md`.
- Decisión: eliminar la fecha del evento del diseño. App anterior descartada.
- Respuestas del usuario: 10 productos, orden por jugador, gana el menor tiempo, empate con orden distinto, una caja a la vez, Electron sin internet. GTIN de prueba en `datos-productos.md`.
- Respuestas 2: error de escaneo = +5 s, máximo 1:30, cada caja = equipo de 2 participantes, Windows con instalador al final.
- Cambio de flujo: botón único INICIAR JUEGO, cola de equipos por orden de caja, "Siguiente" sin volver al Registro, Tabla al final. Pista con foto (pendientes las fotos del usuario, carpeta `gs1-market/src/assets/products/`).
