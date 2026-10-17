# Recuperación del 17 de octubre de 2026

La preview previa apuntaba a `/workspace/exports/NEXO-preview-v8.html`, ausente en el entorno actual. La carpeta del proyecto solo contenía `.git`, sin commits ni objetos recuperables; la consulta remota tampoco devolvía referencias. El trabajo anterior no estaba respaldado en Git.

El usuario proporcionó `NEXO-web.zip`, con el motor, diez retos, estilos y aplicación originales. Se conservó íntegro en `downloads/NEXO-original-recuperado.zip` y se confirmó el contenido antes de cambiarlo, en `e3f44b1`. Ese commit se subió a `origin/main` y se comprobó su resultado. También se recuperó el documento de producto original desde el archivo adjunto anterior.

La reconstrucción incorpora las decisiones de la conversación: interfaz de juego vertical, menú de tres botones, Aventura/Juego libre, fases con varios retos y cierre voluntario, guías interactivas, presupuesto, pistas, deshacer, guardados separados y silenciosos, tres atmósferas con música, preferencias y 250 retos en 51 fases. La música se ha recreado, no recuperado de una copia posterior. No se puede afirmar identidad de código, composiciones o catálogo con la preview perdida.

Se añadieron descarga/restauración del progreso, rutas relativas para hosting en subcarpeta, pruebas reproducibles y una regla explícita de subir el trabajo terminado a GitHub. Los HTML y ZIP de entrega están versionados dentro de `downloads/`. Los nuevos commits y la copia original permiten restaurar el proyecto sin depender de enlaces temporales.

No se modifican ni garantizan condiciones de facturación o cómputo de tokens; eso no está bajo control del agente.
