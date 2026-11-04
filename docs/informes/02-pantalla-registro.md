# Informe 02: Pantalla 2 (Registro de Equipos) — versión 2

Estado: **lista para revisión del usuario**. Capturas: `02-registro.png` (3 cajas) y `02-registro-ventana.png` (ventana de creación).

## Flujo (según indicaciones del usuario; sin interruptores de activar)
1. "¡Comenzar partida!" abre el Registro y, si no hay equipos, **aparece una ventana emergente "Crear equipo"** (Caja 1).
2. En la ventana se elige **Equipo** (nombre del equipo + jugador 1 + jugador 2 opcional) o **Individual** (solo el nombre del participante, que es también el nombre del "equipo"). Se pulsa **Aceptar**.
3. Se crea la tarjeta de la **Caja 1**. Con "Agregar otro equipo" se abre la misma ventana y se crea la Caja 2, y luego la Caja 3 (máximo 3).
4. Las tarjetas **se centran solas**: 1 al centro, 2 simétricas, 3 en fila (verificado: centros 960 / 674-1246 / 388-960-1532 px).
5. Cada tarjeta tiene "Jugar con este equipo", editar (lápiz) y eliminar (con confirmación). Al eliminar una caja, su número queda libre y el siguiente equipo nuevo lo ocupa.
6. Cancelar la primera ventana sin crear nada vuelve al inicio.

## Detalles
- Nombre repetido entre equipos: se marca en rojo y bloquea "Aceptar". Enter acepta, Esc cierra.
- Los equipos se guardan al instante y se recuperan al recargar.
- Franja inferior con los 10 productos (icono y nombre, sin GTIN) y las reglas (orden sorteado, máx. 1:30, +5 s).
- Cabe en el lienzo 1920x1080, sin scroll.

## Cambios respecto a la versión 1 y a la maqueta
- Quitados los interruptores y las 3 cajas fijas de la v1. Quitados también cadena comercial, cuenta regresiva, estado del torneo, roles y barra inferior de la maqueta.

## Verificación
- `tsc` y build sin errores. Prueba automatizada en navegador: ventana al entrar, crear individual y equipos de 2, centrado con 1/2/3 cajas, nombre duplicado bloquea, Enter acepta, eliminar y reutilizar caja, persistencia tras recarga, "Jugar" abre el Desafío con el equipo, sin errores de consola.
- **No verificado**: Electron (archivo JSON) ni pantalla táctil.

## Para revisar
- Al eliminar la Caja 2, las cajas quedan "Caja 1" y "Caja 3" (no se renumeran, porque la caja es una estación física). ¿Prefieres que se renumeren?
