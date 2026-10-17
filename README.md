# NEXO

Juego de conexiones para móvil, con **250 retos en 51 fases**, guías interactivas y música ambiental original. Recuperado a partir de la copia `NEXO-web.zip` del usuario. El código, la copia original y los descargables están versionados en este repositorio.

## Jugar sin instalar

Descargar [NEXO-PC-v11.zip](downloads/NEXO-PC-v11.zip), extraerlo y abrir `NEXO/index.html`. También se puede descargar y abrir el [HTML autónomo](downloads/NEXO-preview-v11.html). En GitHub hay que usar el botón de descarga del archivo: la vista de código no ejecuta HTML.

No requiere servidor ni conexión. El navegador puede limitar el almacenamiento al abrir archivos locales. En Ajustes → Mis datos se puede descargar y restaurar el progreso. No se envían datos a ningún servicio.

Para hosting tradicional, extraer [NEXO-web-v11.zip](downloads/NEXO-web-v11.zip) en una carpeta del servidor. Las rutas son relativas; puede funcionar en raíz o subcarpeta. Usar HTTPS para instalación PWA y caché offline tras la primera visita. Este repositorio no implica que se haya publicado un sitio público.

## Experiencia acordada

El inicio tiene exactamente **Jugar** (o **Continuar** si hay progreso), **Un reto** y **Ajustes**. Jugar abre directamente el punto pendiente de la aventura; Un reto abre una partida independiente. Sin barra lateral, paneles de información permanentes ni mensajes de guardar y salir.

Un nivel es un puzzle y una fase agrupa varios. Las tres primeras fases contienen 3, 3 y 4 puzzles ordinarios, con dos guías introductorias adicionales. Se añaden 48 fases de cinco puzzles, hasta 250. Aventura avanza dentro de la fase con una transición breve y ofrece un cierre al terminarla. No hay mapa, selector de páginas, catálogo ni elección de mundo antes de jugar. Las ambientaciones Umbral, Corriente y Órbita cambian automáticamente. Un reto retoma el puzzle independiente pendiente o propone el siguiente sin resolver; al terminar, Otro reto inicia uno nuevo con un toque.

La primera conexión de cada fase, estilo o regla es guiada dentro del propio tablero. Se elige el origen y después el destino. En propagación se ve primero el intercambio; después se predice qué posición recibirá la onda siguiendo una secuencia numerada visible. El tutorial explica que la onda sigue los números, no las líneas, y enseña el ciclo de símbolos. Las respuestas incorrectas no gastan movimientos. Por último se observa la onda, sin aplicar otra conexión. Luego se termina ese mismo puzzle sin guía. Las guías y las partidas conservan su paso al recargar.

Los dos modos tienen guardados y resoluciones independientes. Guardado silencioso, flecha discreta para salir, sin rachas ni avisos de retorno. Completar el último reto por acceso directo no concede la finalización de todos los anteriores. Los guardados de la aventura anterior pueden continuar en el 11.

## Reglas y dificultad

Copia el objetivo por número de posición. Los símbolos permiten distinguir piezas sin depender del color. El número de posición aparece debajo de cada pieza, fuera del círculo, dejando solo el símbolo dentro. Toca dos piezas o arrastra entre extremos unidos por una línea. Teclado: Tab y Enter/Espacio; Escape cancela la selección.

- Intercambio: los extremos intercambian símbolos.
- Propagación: después del intercambio, la pieza siguiente al destino en sentido horario cambia `● → ≋ → + → ●`. Sigue la numeración; tras la última vuelve la 1. La pieza afectada puede ser el origen. La dirección importa.

El límite habitual es la solución mínima más un movimiento. Reto exacto exige el mínimo al empezar un nuevo puzzle. Deshacer recupera movimientos, reiniciar restaura el presupuesto y las pistas no gastan. Si desde el estado actual no hay solución dentro del presupuesto, la ayuda indica que hace falta deshacer o reiniciar. Al agotar los movimientos sin resolverlo, Reiniciar aparece como botón principal grande; Deshacer sigue disponible.

El catálogo se genera de forma determinista antes de distribuirse. Los tableros, objetivos y IDs de los diez retos originales se conservan, corrigiendo mínimos si fuese necesario. Los nuevos tienen soluciones verificadas y se descartan copias por cambios de paleta, rotación o reflejo. Tamaño y profundidad crecen por tramos; no hay garantía de dificultad estrictamente creciente. Las firmas canónicas no sustituyen revisión de diseño con personas.

Los 5–10 minutos son una referencia para sesiones voluntarias más profundas, no un temporizador ni una duración medida. Los primeros aprendizajes pueden ser breves.

## Música y estética

Tres mundos: Umbral, Corriente y Órbita, con color, iluminación y arreglos a 66, 78 y 90 BPM. Se alternan al avanzar por las fases; no son 51 composiciones distintas. La música posterior a V1 no estaba en la copia disponible y se ha recreado con síntesis original en `src/soundtrack.js`, siguiendo la dirección ambiental acordada. No es una recuperación idéntica de las composiciones perdidas.

Acordes, bajo, arpegios, panorámica y ecos se generan con Web Audio, después de una interacción. El audio se pausa en menú, ayuda, pestaña oculta y cierre de fase. Música y volumen, efectos, vibración, movimiento y tema se controlan por separado. Presentación tranquila por defecto; animación optativa y respeto al movimiento reducido del sistema.

Las [muestras WAV](downloads/NEXO-musica-v9.zip) son opcionales; el juego no descarga música ni depende de ellas. No se copian recursos de Tetris Effect.

No se afirma que NEXO trate TDAH, mejore inteligencia ni produzca efectos clínicos. TDA/AACC no implican una tolerancia uniforme a estímulos. Quedan pendientes pruebas con personas y dispositivos físicos.

## Desarrollo y validación

Node >=22 (validado con 24), npm, Python 3 para ZIPs y Chromium para pruebas:

```sh
npm ci
npm run dev
npm run check
npm run export
```

El servidor escucha en `0.0.0.0:5173`, configurable con `HOST` y `PORT`. `npm run build` genera `dist/`; `npm start` sirve esa compilación. Las pruebas de navegador levantan y cierran su propio servidor en el puerto 5183. Usan `/usr/bin/chromium`, `CHROMIUM_PATH` o el Chromium instalado por Playwright. No presentar direcciones locales como previews públicas.

`npm run check` incluye 264 pruebas del motor/campaña, build, escenarios funcionales en navegador y comprobación del ZIP extraído sin conexión. El navegador administrado bloquea `file:`: se ejecuta el HTML exacto del ZIP en un origen vacío sin red. Esto comprueba que es autónomo; no valida cada navegador de escritorio. Véase [validación](docs/VALIDATION.md).

`npm run author` reproduce el catálogo desde `src/intro-levels.json`; no es necesario para arrancar. `node scripts/render-music.mjs` genera tres WAV de 36 segundos en un ZIP, usando el mismo código musical del juego.

## Copias y continuidad

- `downloads/NEXO-original-recuperado.zip`: copia original entregada por el usuario, conservada intacta.
- `downloads/`: preview autónoma y ZIPs de la versión reconstruida, guardados en Git.
- `AGENTS.md`: exige confirmar y subir los cambios terminados a `origin/main`, y verificar el resultado remoto.
- GitHub Actions: ejecuta las comprobaciones en cada push/PR y guarda los descargables como artefactos si pasan. Su ejecución remota debe comprobarse por separado; las validaciones locales no prueban un resultado de CI.

No guardar la única copia del trabajo en carpetas temporales ni dejarla sin seguimiento. Antes de comunicar una entrega, regenerar descargables, confirmar código y archivos, hacer push y comparar el hash remoto. El repositorio permite reconstruirlos si una preview del chat caduca.

El [documento de producto original](docs/PRODUCT.md) se conserva como referencia histórica; las decisiones posteriores del usuario prevalecen. Aplicaciones nativas, reglas ECO/INVERSIÓN/REESCRITURA/SÍNTESIS, pruebas humanas y piloto longitudinal siguen pendientes, como antes de la recuperación. No se presentan como implementados.
