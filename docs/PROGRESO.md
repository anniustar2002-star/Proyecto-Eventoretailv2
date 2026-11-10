# Progreso

Última actualización: ver historial de git de este archivo.

## Estado actual
- Fase 0 (cimientos): **hecha** (`gs1-market/`).
- Pantalla 1 (Inicio): **CERRADA / aprobada** (`informes/01-pantalla-inicio.md`).
- Pantalla 2 (Registro): **CERRADA / aprobada** (`informes/02-pantalla-registro.md`).
- Pantalla 3 (Desafío): **CERRADA / aprobada** (`informes/03-pantalla-desafio.md`).
- Pantalla 4 (Posiciones): **CERRADA / aprobada** (`informes/04-pantalla-posiciones.md`).

## Siguiente paso
Subir los cambios, ejecutar el workflow de GitHub Actions para obtener el instalador, y hacer las pruebas finales en Windows con la pistola real y la TV (ver `informes/05-informe-final.md`, sección "Pendientes").
Comandos: `cd gs1-market && npm install && npm run dev` (navegador), `npm test`, `npm run electron:zip` (versión portátil de Windows).

## Bitácora
- Informe 00: análisis de la app anterior (descartada) y de la maqueta nueva. Ver `informes/00-analisis-inicial.md`.
- Decisión: eliminar la fecha del evento del diseño. App anterior descartada.
- Respuestas del usuario: 10 productos, orden por jugador, gana el menor tiempo, empate con orden distinto, una caja a la vez, Electron sin internet. GTIN de prueba en `datos-productos.md`.
- Respuestas 2: error de escaneo = +5 s, máximo 1:30, cada caja = equipo de 2 participantes, Windows con instalador al final.
- Cambio de flujo: botón único INICIAR JUEGO, cola de equipos por orden de caja, "Siguiente" sin volver al Registro, Tabla al final. Pista con foto (pendientes las fotos del usuario, carpeta `gs1-market/src/assets/products/`).
- Fotos de productos recibidas: 01-05 (leche, mantequilla, pasta, cereal, aceite) en `gs1-market/src/assets/products/` (SVG). Faltan 06-10 (usan icono+nombre provisional). Las SVG traen el nombre impreso en el envase.
- Fotos de productos 06-10 recibidas: ya están las 10 (SVG) en `gs1-market/src/assets/products/`. Siguiente: pantalla 4 (Tabla de posiciones).
- Podio corregido (oro más alto). Juego terminado => siguiente juego desde cero (Inicio vuelve a datos de ejemplo). Cancelar partida => cancela el juego completo y vuelve al Inicio.
- Fase final: compilación para Electron/Windows hecha (zip portátil + workflow de GitHub Actions para el instalador). Informe final: `informes/05-informe-final.md`.
