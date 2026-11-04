# Plan de trabajo: GS1 Market, La Carrera de Escaneo

> Documento vivo. Si la sesión se corta, retomar leyendo este archivo, `PROGRESO.md` y el último informe en `informes/`.

## Decisiones tomadas
- La app anterior (`remix-reto-del-escaneo-gs1/`) **ya no se usa**. Se trabaja solo con la maqueta nueva.
- La **fecha del evento se elimina** de todo el diseño (no aparece en pantallas, textos ni datos).
  Tampoco se menciona la fecha en el código ni en los datos de ejemplo.
- Se trabaja **pantalla por pantalla**: la siguiente empieza solo cuando la anterior está lista y revisada por el usuario.
- Fuente de verdad visual: `Carrera-de-escaneo-imagenes/stitch_spanish_conversation_assistant/` (PNG + HTML por pantalla) y `.../retail_speed_sprint/DESIGN.md`.
- Ignorar `Carrera-de-escaneo/code.html` (script roto). `Carrera-de-escaneo/DESIGN.md` solo como referencia de reglas de negocio.

## Stack propuesto
Next.js (App Router) + TypeScript + Tailwind, fuentes Inter y Plus Jakarta Sans empaquetadas localmente (sin CDN), pensado para TV 50-55" y sin depender de internet.
Proyecto nuevo en `gs1-market/`.

## Fase 0: Cimientos (antes de la pantalla 1)
- [ ] Crear `gs1-market/` con Next.js, TypeScript estricto y ESLint (sin `ignoreBuildErrors`).
- [ ] Tokens de diseño (colores GS1, tipografía, radios, sombras) desde `DESIGN.md`.
- [ ] Layout base: cabecera (logo, sede, reloj en vivo) y barra de navegación.
- [ ] Modelo de datos y estado compartido (equipos, canasta, partida).
- [ ] Datos de ejemplo de los 8 productos (marcados como provisionales hasta tener los GTIN reales).
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
- [ ] Sincronización entre las 3 cajas (según la decisión de arquitectura).
- [ ] Modo sin conexión y pruebas con pistola real.
- [ ] Pruebas de TV (1920x1080 y 4K) y revisión final.

## Preguntas abiertas (bloquean datos reales, no la maqueta)
1. Los 8 productos definitivos con GTIN-13 reales (Registro y Desafío muestran listas distintas en el diseño).
2. Reglas del 60 s: ¿se corta a los 60 s o es tiempo objetivo? Penalización: 5 s por error (según captura).
3. ¿Las 3 cajas juegan a la vez y se ven en una TV central? Define la sincronización.
4. ¿Hay internet en el sitio?
5. Los "36 SKUs" de la tabla contradicen los 8 del reto: ¿cuál vale?
6. Barras inferiores que tapan contenido en el diseño: ¿se mantienen en TV?
7. Marca: unificar logo/colores de "GS1 Market".
8. ¿Se elimina del repo la carpeta de la app anterior?
