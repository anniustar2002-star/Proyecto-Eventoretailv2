# Informe 03: Pantalla 3 (Desafío en vivo)

Estado: **lista para revisión del usuario**. Capturas: `03-desafio.png` (jugando, con un error), `03-desafio-resultado.png` (final).
Referencia: `gs1_market_desaf_o_en_vivo_tv_interactiva` (adaptada a las reglas acordadas).

## Flujo de una partida
1. Desde el Registro, "Jugar con este equipo" abre el Desafío del equipo. Estado **¿Listos?** con botón **¡INICIAR!**.
2. Cuenta regresiva **3-2-1** a pantalla completa (con sonido) y arranca el reloj.
3. La pantalla muestra la **pista**: producto a escanear (nombre + icono, sin GTIN). Un campo grande, **siempre enfocado**, recibe el código de la pistola (dígitos + Enter). Si se pierde el foco, se recupera solo.
4. Código correcto: avanza a la siguiente pista (sonido, check verde, parcial en el tique). Código incorrecto —incluido el GTIN válido de otro producto de la canasta—: **+5 s**, sonido de error, sacudida roja, contador de faltas.
5. Termina al escanear los 10 (**¡Carrera completada!**) o al llegar a **1:30** (**¡Se acabó el tiempo!**). Las penalizaciones cuentan para el límite.
6. La ventana final muestra tiempo, productos, faltas y puesto. El resultado se guarda solo, una vez. Botones: Registro / Ver posiciones.

## Elementos
- Cronómetro grande 00:00.00; naranja con menos de 10 s y rojo parpadeante con menos de 5 s. Barra de progreso x/10.
- **Tique de carrera**: productos escaneados con su tiempo parcial; el actual "EN CURSO"; el resto "Pista oculta" (el orden es la dificultad).
- Cancelar partida (con confirmación, no se guarda).
- Sonidos sintetizados (Web Audio): sin archivos, funcionan sin internet.

## Reglas implementadas (lógica pura en `src/lib/game.ts`, con pruebas)
- El orden se sortea en cada partida (distinto por equipo y por partida).
- Tiempo final = tiempo real + 5 s por falta. Máximo 1:30.
- **Si se corta por tiempo**: se guarda el nº de productos escaneados, `finished=false`, tiempo 1:30. En el ranking, más productos escaneados va primero y luego menor tiempo.
- **Desempate (primer puesto)**: si dos o más equipos empatan en su mejor partida, el Registro marca **DESEMPATE** en esos equipos y su botón pasa a "Jugar DESEMPATE". Cada uno juega con un orden sin ninguna coincidencia con su última partida. Si vuelven a empatar, se repite (ronda 2, 3...). Lógica en `src/lib/ranking.ts`.

## Verificación
- `tsc` y build sin errores. **15 pruebas unitarias** (GTIN, orden, desempate, ranking, partida, límite de tiempo, penalizaciones).
- Pruebas en navegador (Playwright): partida completa tecleando códigos como una pistola (10 productos + 1 error), foco recuperado tras clic fuera, resultado guardado, tiempo agotado simulado con reloj falso (guarda 0 productos, 1:30, no terminó), desempate de dos equipos (marca, orden distinto, mensaje de pendiente, resolución). Sin errores de consola ni scroll.
- **No verificado**: pistola física real, Electron, volumen del sonido en la TV.

## Para revisar / decidir
- El desempate solo se aplica al **primer puesto** (como pediste). Si lo quieres para otros puestos, se amplía.
- Textos de la pista y colores del cronómetro.
- La Tabla de posiciones (pantalla 4) mostrará los desempates.
