# Validación de la reconstrucción

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
