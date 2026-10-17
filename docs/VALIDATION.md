# Validación de la reconstrucción V9 (histórico)

Pruebas locales del 17 de octubre de 2026, con Node 24 y Chromium del sistema:

- 264 pruebas unitarias del motor y campaña: soluciones BFS de los 250 retos, mínimos exactos, límites, deshacer, invariantes, estados vecinos, conservación de los diez tableros originales, firmas de nuevas incorporaciones, 51 fases y guías.
- 15 escenarios de navegador: menú de tres botones, acceso a fases/retos finales, primera guía, tres niveles reales antes del primer cierre, modos independientes, presupuesto, pistas, teclado, arrastre, propagación por pasos, recarga, preferencias, primeras tres fases completas, último tramo, finalización honesta y migración de guardados.
- Descarga y restauración del progreso; JSON inválido no reemplaza la partida. Último guardado con 252 etapas resueltas, incluyendo dos tutoriales, exige todos los retos para el cierre global.
- Juego sin desbordamiento horizontal/vertical en 320 × 568, 390 × 844 y 1440 × 900, incluyendo guías y tableros de siete nodos. Capturas en `test-results/`, excluidas de Git.
- Auditorías axe WCAG A/AA sin incidencias en vistas evaluadas: menú, mapa, catálogo final, primera guía y tema claro. No equivalen a una certificación completa.
- Audio después de interacción y suspensión al terminar la fase; movimiento optativo y ajustes independientes. Muestras WAV con señal no silenciosa y sin recorte, a 22050 Hz estéreo durante 36 segundos, verificadas al renderizar.
- ZIP de PC extraído y ejecutado sin red: primeras tres fases, guías, límites/recuperación y reto 250, sin peticiones externas. Chromium administrado bloquea navegación `file:`; se ejecuta el HTML exacto en un origen vacío. Falta probar apertura directa en navegadores de PC físicos.
- Código, copia original y descargables subidos a GitHub en commits intermedios. La entrega final verifica hash local/remoto. La ejecución remota de GitHub Actions no se deduce de estas pruebas locales.

La composición posterior a V1 se ha recreado. Los nuevos puzzles se generan y resuelven de forma determinista: esto no garantiza dificultad uniforme, diversión ni tiempo por sesión. Quedan pendientes pruebas con personas, dispositivos móviles físicos, lectores de pantalla, nombre/originalidad y piloto longitudinal. No se afirman beneficios clínicos para TDA/AACC.

## Recuperación desde GitHub comprobada

Se clonó `origin/main` en `/tmp/nexo-restore-check`, sin copiar archivos de trabajo. Allí se ejecutaron `npm ci` con el lockfile, las 264 pruebas unitarias y la exportación. El HTML autónomo generado coincide byte a byte con el entregado: SHA-256 `1b7cc0fca19a0f821b2003b158f1c6c9b139e53dd4215ebc5c8bb0cb0e563c53`. La copia original archivada también coincide con el ZIP adjunto por SHA-256. Esto verifica que el repositorio remoto contiene lo necesario para recuperar la entrega, sin depender de los archivos temporales del chat.


## Inicio simplificado V10

Jugar/Continuar abre directamente el tablero pendiente. Un reto retoma o inicia un puzzle independiente; Otro reto inicia el siguiente sin mostrar un catálogo. Se retiraron mapa, páginas y selectores de rango. Los tres mundos son ambientaciones automáticas. Se conservan los 250 puzzles, las 51 agrupaciones de fase, las guías, los guardados y la música.

La suite actual comprueba entrada con un toque, ausencia de selectores visibles, reanudación directa, reto independiente y siguiente reto con un toque, además de las regresiones de motor, guía, límites, pantallas pequeñas, avance y guardados. Los escenarios de fases posteriores preparan el guardado como precondición; ya no navegan por un selector inexistente en el producto.

V10 pasó las 264 pruebas unitarias, 15 escenarios de navegador y la comprobación del ZIP autónomo extraído sin red, con cero peticiones externas. Se regeneraron y versionaron el HTML y ambos ZIP. Las comprobaciones de entrada directa y Otro reto utilizan los botones reales; el progreso posterior se prepara como fixture para probar la reanudación.


## Piezas y reinicio V11

El número de posición se sitúa visualmente debajo y fuera de cada círculo. Las guías, el objetivo y los nombres accesibles conservan la referencia por posición. Al agotar el presupuesto sin solución, aparece un único botón Reiniciar grande y se mantiene Deshacer. Ganar en el último movimiento o revisar una guía resuelta no presenta el estado de reinicio por fallo.

La suite de navegador comprueba números fuera de las piezas en varios tamaños, botón de reinicio de al menos 240 × 50 px en pantallas móviles, ausencia de duplicados, conservación al recargar y vuelta al estado normal tras deshacer/reiniciar.


## Explicación de propagación

La guía separa intercambio, predicción del destino de la onda y cambio de símbolo. Define destino como la segunda pieza tocada, muestra el orden con vuelta al 1 y explica que la onda sigue los números, no las líneas. La ayuda `?` ofrece tres pasos y un ejemplo concreto. La predicción incorrecta no consume conexiones y tanto ese paso como la observación pueden reanudarse. Se evita presentar el resultado como una flecha entre símbolos sin contexto.
