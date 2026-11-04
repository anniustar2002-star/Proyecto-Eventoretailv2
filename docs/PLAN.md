# Plan de trabajo: GS1 Market, La Carrera de Escaneo

> Documento vivo. Si la sesión se corta, retomar leyendo este archivo, `PROGRESO.md` y el último informe en `informes/`.

## Decisiones tomadas
- La app anterior (`remix-reto-del-escaneo-gs1/`) **ya no se usa**. Se trabaja solo con la maqueta nueva.
- La **fecha del evento se elimina** de todo el diseño (no aparece en pantallas, textos ni datos).
  Tampoco se menciona la fecha en el código ni en los datos de ejemplo.
- Se trabaja **pantalla por pantalla**: la siguiente empieza solo cuando la anterior está lista y revisada por el usuario.
- Fuente de verdad visual: `Carrera-de-escaneo-imagenes/stitch_spanish_conversation_assistant/` (PNG + HTML por pantalla) y `.../retail_speed_sprint/DESIGN.md`.
- Ignorar `Carrera-de-escaneo/code.html` (script roto). `Carrera-de-escaneo/DESIGN.md` solo como referencia de reglas de negocio.

## Reglas de negocio confirmadas por el usuario
- **10 productos** (ver `datos-productos.md`): Leche, Mantequilla, Pasta, Cereal, Aceite, Lata de Maíz, Jarabe para la tos, Jabón Facial, Caja de Acetaminofén, Barra de Chocolate. GTIN de prueba generados por Claude.
- **Escaneo con pistola USB** (modo teclado): la app tiene un campo siempre enfocado donde se transcribe el código al escanear (termina con Enter).
- **El orden de escaneo lo marca la "pista"** del producto actual (nivel de dificultad). El orden es **distinto por jugador y por partida**.
- **El contador** arranca al empezar la partida y se detiene al escanear el último producto; ese tiempo va a la tabla. **Gana el menor tiempo.** **Tiempo máximo por partida: 1:30.**
- **Penalización:** escanear un código que no corresponde a la pista suma **+5 s** al tiempo del equipo.
- **Equipos:** cada caja = 1 equipo de **2 participantes**; 3 cajas = 3 equipos. Juegan **uno a la vez**. Al registrar se escribe el nombre del equipo y los nombres de ambos integrantes (se guardan). Gana el **equipo** con menor tiempo.
- **Empate:** partida extra con un orden completamente distinto al anterior.
- **Una caja a la vez**, no simultáneas. No hace falta sincronizar entre cajas.
- **Sin internet:** se distribuye como app de escritorio con **Electron**, compilada. Datos guardados localmente en el equipo.
- La carpeta de la app anterior se deja por ahora; se borra más adelante.

## Stack propuesto (actualizado)
Electron + Vite + React + TypeScript + Tailwind. Destino: **Windows**; el instalador se hace en la **última fase**. Sin CDN: fuentes Inter y Plus Jakarta Sans empaquetadas. Pensado para TV 50-55" en pantalla completa.
Se cambia Next.js por Vite porque con Electron no aporta (no hay servidor) y complica el empaquetado.
Persistencia: archivo JSON local gestionado por el proceso principal de Electron.
Proyecto nuevo en `gs1-market/`.

## Fase 0: Cimientos (antes de la pantalla 1)
- [ ] Crear `gs1-market/` con Electron + Vite + React, TypeScript estricto y ESLint.
- [ ] Tokens de diseño (colores GS1, tipografía, radios, sombras) desde `DESIGN.md`.
- [ ] Layout base: cabecera (logo, sede, reloj en vivo) y barra de navegación.
- [ ] Modelo de datos y estado compartido (equipos, canasta, partida).
- [ ] Datos de los 10 productos desde `datos-productos.md` (GTIN de prueba) en un único archivo.
- [ ] Generador de orden aleatorio por jugador y de orden de desempate sin coincidencias.
- [ ] `.gitignore`, scripts `dev`, `build`, `typecheck`, `lint`.

## Fase 1: Pantallas (una por una)
Cada pantalla pasa por: **construir → verificar (typecheck, lint, build, captura vs PNG) → informe → revisión del usuario → siguiente**.

| # | Pantalla | Referencia | Estado |
|---|---|---|---|
| 1 | Inicio / Hub | `gs1_market_pantalla_tv_interactiva` | Pendiente |
| 2 | Registro de escuadrón | `gs1_market_registro_de_equipo_tv_interactiva` | Pendiente |
| 3 | Desafío en vivo | `gs1_market_desaf_o_en_vivo_tv_interactiva` | Pendiente |
| 4 | Tabla de posiciones | `gs1_market_tabla_de_posiciones_tv_interactiva` | Pendiente |

### Pantalla 1: Inicio / Hub
Título, tres tarjetas (8 SKU, máx. 5 por equipo, 60 s), botón "¡Comenzar partida!", simulador de haz óptico, tabla rápida Top 3, enlaces a récords y reglas. **Sin fecha del evento.**

### Pantalla 2: Registro de escuadrón
Selección de caja (1/2/3), cadena/escuadrón, integrantes (1 a 5, con rol), canasta de 8 SKU, estado del torneo.

### Pantalla 3: Desafío en vivo
Cronómetro, progreso, producto en curso, mira láser, tique en vivo, panel de jueces (faltas, +5 s, finalizar). Hook de pistola USB (teclado global, Enter) con validación GTIN-13 y beep sintetizado.

### Pantalla 4: Tabla de posiciones
Podio Top 3, tabla de equipos, filtros, récords. Se alimenta de las partidas finalizadas.

## Fase 2: Cierre
- [ ] (ÚLTIMA FASE) Empaquetar la app Electron en instalador de Windows y probar sin internet.
- [ ] Pruebas con pistola real.
- [ ] Pruebas de TV (1920x1080 y 4K) y revisión final.

## Preguntas abiertas
1. GTIN reales (hoy de prueba).
2. Si se llega al 1:30 sin terminar los 10 productos: ¿la partida se corta y queda "no terminó" (con cuántos productos llevaba), o se registra 1:30 más penalizaciones? (propuesta: se corta; se clasifica primero por productos escaneados y luego por tiempo).
3. Las 3 cajas/equipos se registran de antemano o se crean al jugar? (propuesta: Registro crea el equipo y lo asigna a Caja 1, 2 o 3).
4. Marca: unificar logo y colores de "GS1 Market".
