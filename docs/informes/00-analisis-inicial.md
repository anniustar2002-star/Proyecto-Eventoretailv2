# Informe 00: Análisis inicial

## App anterior (`remix-reto-del-escaneo-gs1/`) — descartada y eliminada del repositorio
Next.js 15 de un solo participante. Se revisó antes de descartarla; hallazgos que conviene **no repetir** en la nueva:
- Validación de códigos inexistente (aceptaba cualquier número de hasta 14 dígitos; `PRODUCT_BARCODES` sin usar).
- `toast()` dentro de updaters de estado (duplicados en Strict Mode).
- Pausa inconsistente y foco con closures obsoletos.
- Tabla recortada a 10 sin aviso; persistencia solo en `localStorage`.
- `ignoreBuildErrors` y `ignoreDuringBuilds` activados ocultaban errores de `tsc`.
- Clases `success-*` de Tailwind inexistentes; dependencias sin usar (genkit, firebase, recharts...).

## Maqueta nueva (`Carrera-de-escaneo-imagenes/`)
4 pantallas de TV: Inicio, Registro de escuadrón, Desafío en vivo, Tabla de posiciones, con PNG y HTML cada una más `DESIGN.md`.
Juego por equipos (1 a 5), 3 cajas, 8 SKUs con GTIN-13, cronómetro de 60 s, penalización 5 s, panel de jueces, pistola USB en modo teclado.

## Inconsistencias de la maqueta
1. 60 s vs tiempos de 41 s a 1:24 en la tabla.
2. "36 SKUs" en la tabla vs 8 del reto.
3. Registro y Desafío muestran listas de 8 productos distintas.
4. La barra inferior tapa contenido en 3 capturas.
5. Logo y colores de marca inconsistentes entre pantallas.
6. Los HTML usan Tailwind y fuentes por CDN (requieren internet).
7. `Carrera-de-escaneo/code.html` está roto (markdown dentro de un `<script>`).
8. La fecha del evento aparece en varias pantallas: **se elimina por decisión del usuario**.
