# Informe final: GS1 Market — La Carrera de Escaneo

Proyecto: aplicación de escritorio para Windows, sin internet, para un juego de velocidad con pistolas lectoras de códigos de barras GS1, pensada para una TV.
Este informe resume todo el proceso (ver también `PLAN.md`, `PROGRESO.md` y los informes 00 a 04).

## 1. Resumen
Se partió de una maqueta de Stitch (4 pantallas) y se descartó una app anterior. Se construyó `gs1-market/` (Electron + React + TypeScript + Vite + Tailwind), pantalla por pantalla, con revisión del usuario en cada una. Al final se compiló para Electron/Windows.

## 2. Reglas del juego (confirmadas por el usuario)
- **10 productos** (Leche, Mantequilla, Pasta, Cereal, Aceite, Lata de Maíz, Jarabe para la tos, Jabón Facial, Caja de Acetaminofén, Barra de Chocolate). GTIN de **prueba** (prefijo 759999, dígito verificador válido) en `gs1-market/src/data/products.ts`.
- Se escanea con **pistola USB** (modo teclado): un campo siempre enfocado recibe el código.
- La pista muestra la **foto** del producto (no el nombre); el **orden se sortea** en cada partida.
- Gana el **menor tiempo**. Máximo **1:30**. Cada código equivocado suma **+5 s**.
- Si no se completan los 10 productos, se clasifica por productos escaneados y luego por tiempo.
- **Desempate** en el primer puesto: ronda extra solo entre empatados, con un orden totalmente distinto al anterior (se repite si vuelven a empatar).
- Hasta **3 cajas**, cada una un equipo de 1 o 2 participantes (o individual). Juegan **uno tras otro** por orden de caja.
- Un juego terminado **no se repite con los mismos equipos**: el siguiente empieza desde cero. **Cancelar partida** cancela el juego completo.
- Sin fecha ni ubicación del evento en la app (se usa en varios eventos).

## 3. Flujo de uso
Inicio → **Comenzar partida** → ventana *Crear equipo* (se van creando Caja 1, 2, 3; las tarjetas se centran) → **INICIAR JUEGO** → cada equipo: ¿Listos? → 3-2-1 → escaneo → resultado → **Siguiente** → … → **Tabla de posiciones** (podio, tabla, desempate si lo hay). *Nuevo juego* o *Inicio* vuelve a empezar desde cero.

## 4. Pantallas
| Pantalla | Qué hace | Informe |
|---|---|---|
| Inicio | Presentación, reglas rápidas, récord y top 5 (datos de ejemplo mientras no hay resultados), ilustración animada | 01 |
| Registro | Ventana emergente para crear equipo (Equipo / Individual), cajas creadas a demanda y centradas, botón único INICIAR JUEGO, canasta con fotos | 02 |
| Desafío en vivo | Cronómetro, pista con foto, campo de la pistola, tique, penalizaciones, cuenta regresiva, sonidos, resultado y cola de equipos | 03 |
| Tabla de posiciones | Podio, tabla con diferencias, desempate, reiniciar resultados | 04 |

Todo el diseño cabe en un lienzo fijo de **1920×1080** que se escala a cualquier pantalla, **sin scroll**.

## 5. Arquitectura
- `electron/main.cjs` y `preload.cjs`: ventana a pantalla completa (F11 la alterna, Ctrl+Q cierra), instancia única, sin navegación externa, DevTools solo en desarrollo. Los datos se guardan en un archivo JSON (escritura atómica) en la carpeta de datos del usuario: `%APPDATA%\GS1 Market\gs1-market-data.json`.
- `src/lib/`: lógica pura y probada (`game.ts` reglas de partida, `ranking.ts` clasificación y desempate, `order.ts` sorteos, `gtin.ts` validación GS1).
- `src/screens/`: las 4 pantallas. `src/data/`: productos y datos de ejemplo. `src/assets/products/`: 10 ilustraciones SVG.
- Fuentes e imágenes empaquetadas: **sin CDN ni internet**. La app no hace ninguna petición de red.
- Sonidos sintetizados con Web Audio (sin archivos de audio).

## 6. Compilación para Electron / Windows
- **Versión portátil (zip)**: `npm run electron:zip` en `gs1-market/` genera `release/GS1-Market-Portable-0.1.0.zip` (~113 MB, Windows x64). Se descomprime y se ejecuta `GS1 Market.exe`; no necesita instalación. Windows puede mostrar el aviso de SmartScreen (la app no está firmada): *Más información → Ejecutar de todas formas*.
- **Instalador (NSIS)**: no se pudo generar en el entorno de desarrollo (Linux sin Wine). Se dejó el flujo `.github/workflows/build-windows.yml`: en GitHub, pestaña *Actions* → *Compilar GS1 Market para Windows* → *Run workflow*; entrega el instalador `GS1-Market-Setup-0.1.0.exe` y el zip como artefacto. **El workflow no se ha ejecutado todavía.**
- Icono: círculo GS1 (`build/icon.ico`). En la versión generada en Linux el `.exe` conserva el icono por defecto de Electron; en el workflow de Windows sí se incrusta.
- El paquete de la app (`app.asar`) pesa 1,9 MB: solo contiene `dist/`, `electron/` y `package.json`.

## 7. Verificación realizada
| Qué | Resultado |
|---|---|
| Comprobación de tipos (`tsc`) y `vite build` | Sin errores |
| Pruebas unitarias (GTIN, orden, desempate, ranking, partida, límite de tiempo, penalizaciones) | **15 de 15** |
| Pruebas en navegador (Playwright) por pantalla: flujos completos, errores, tiempo agotado, desempate, reinicio, cancelar, persistencia, sin scroll, sin errores de consola | OK |
| App **dentro de Electron** (build de Linux) y **empaquetada** (`app.asar` de la versión Windows): carga, título, fuentes, guardado en archivo JSON, recuperación al reabrir, partida completa de 2 equipos tecleando como una pistola, tabla final, juego marcado como terminado | OK, sin errores |
| Revisión de red: el `dist` no contiene URL externas que se descarguen (solo un texto de ayuda de React) | OK |
| Barras EAN-13 impresas (`docs/codigos-de-barras`): decodificadas con un lector independiente | 10 de 10 |

## 8. Lo que NO se ha podido verificar (pendientes)
1. **Ejecutar el `.exe` de Windows**: se verificó el mismo código en Electron para Linux y el `app.asar` empaquetado, pero no se arrancó el `.exe` en un Windows real.
2. **El instalador NSIS y el workflow de GitHub Actions**: sin ejecutar.
3. **Pistola física con la app empaquetada** en Windows (con el navegador sí se usó una pistola real y funcionó).
4. **Sonido en la TV** (volumen y salida de audio) y la lectura de las fotos a distancia.
5. **Pantalla 4K** y la TV real (el lienzo se escala, pero no se ha visto en la TV).
6. **GTIN reales**: los actuales son de prueba. Cambiarlos en `products.ts` y regenerar los códigos de barras con `node scripts/generar-codigos.mjs` (y volver a exportar el PDF).

## 9. Decisiones y límites conocidos
- El desempate se aplica **solo al primer puesto**.
- Al eliminar una caja, las demás **no se renumeran** (la caja es una estación física); el siguiente equipo nuevo reutiliza el número libre.
- Los datos de ejemplo del Inicio se apagan con `SHOW_DEMO_WHEN_EMPTY = false` en `src/data/demoResults.ts`.
- Las ilustraciones traen el nombre impreso en el envase (visible en la pista).
- La app anterior (`remix-reto-del-escaneo-gs1/`) y `Carrera-de-escaneo/code.html` (script roto) siguen en el repositorio y se pueden borrar.
- Sin firma de código: Windows mostrará el aviso de SmartScreen.

## 10. Guía rápida para el evento
1. Conectar la pistola (modo teclado/HID) y la TV; abrir **GS1 Market**.
2. *Comenzar partida*, crear los equipos (hasta 3) y pulsar **INICIAR JUEGO**.
3. Cada equipo: ¡INICIAR!, escanear los productos que muestra la pista. Al terminar, **Siguiente**.
4. Al final, la **Tabla de posiciones**. Si hay empate, **Jugar desempate**.
5. Para otro grupo: *Nuevo juego* / *Inicio* → *Comenzar partida* (empieza de cero).
- Salir: **Ctrl+Q**. Pantalla completa: **F11**. Datos en `%APPDATA%\GS1 Market\`.
