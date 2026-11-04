# Informe 04: Pantalla 4 (Tabla de posiciones)

Estado: **lista para revisión del usuario**. Capturas: `04-posiciones.png` (con un equipo que no terminó), `04-posiciones-empate.png` (empate pendiente).
Referencia: `gs1_market_tabla_de_posiciones_tv_interactiva`, adaptada a las reglas acordadas.

## Qué muestra (`src/screens/LeaderboardScreen.tsx`)
- **Podio** con 1º, 2º y 3º (corona al líder, iniciales del equipo, tiempo). Marca OFICIAL o PROVISIONAL (si hay desempate pendiente).
- **Tabla** completa: puesto, equipo (con integrantes y nº de partidas), productos x/10, faltas, tiempo y diferencia con el líder (+x.xx s). Líder resaltado; equipos que no terminaron muestran "No terminó" (x/10).
- Se usa la **mejor partida de cada equipo**. Orden: más productos, luego menor tiempo; el desempate del primer puesto se resuelve con las rondas extra.
- **Empate en el primer puesto**: franja naranja con "Jugar desempate", que abre el Desafío con los empatados (cola de juego).
- Botones: **Registro**, **Reiniciar resultados** (con confirmación; borra tiempos y mantiene los equipos) e **Inicio**.
- Sin resultados: mensaje "Aún no hay resultados".
- Cabe en 1920x1080, sin scroll.

## Cambios respecto a la maqueta
- Quitados: filtros por categoría (Retail/Consumo), estándares GS1 por equipo, "Simular nueva marca", "Nuevo equipo a pista", cronómetro maestro, panel de jueces y barra inferior.
- Añadidos: reiniciar resultados, estado "no terminó", diferencia con el líder.

## Verificación
- `tsc`, build y 15 pruebas unitarias OK.
- Prueba en navegador con datos sembrados: vacío, tres equipos (uno que no terminó), empate (aparece el aviso y "Jugar desempate" abre el Desafío con "DESEMPATE 1" y "PARTIDA 1 DE 2"), reiniciar resultados (borra resultados y conserva los 3 equipos). Sin errores de consola ni scroll.
- **No verificado**: flujo real de principio a fin con pistola física, Electron.

## Nota
- El Inicio muestra datos de ejemplo mientras no hay resultados reales; esta tabla muestra el estado vacío real (no usa datos de ejemplo).
