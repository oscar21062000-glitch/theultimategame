# NEXO — Documento de producto y diseño

**Versión:** 1.0 · 16 de octubre de 2026  
**Tipo:** Documento de definición de producto, experiencia de usuario, mecánicas, dirección visual, progresión, accesibilidad y plan de desarrollo.  
**Estado:** Propuesta de diseño para validar. La originalidad de la mecánica y la disponibilidad del nombre no están verificadas.

> **Un reto. Una solución. Y sigues con tu día.**

---

## Índice

- [01 · Resumen ejecutivo](#01-resumen-ejecutivo)
- [02 · Audiencia y problema](#02-audiencia-y-problema)
- [03 · Pilares de diseño](#03-pilares-de-diseño)
- [04 · Mecánica principal: conectar para transformar](#04-mecánica-principal-conectar-para-transformar)
- [05 · Primer minuto: onboarding jugable](#05-primer-minuto-onboarding-jugable)
- [06 · Ejemplo de puzzle funcional](#06-ejemplo-de-puzzle-funcional)
- [07 · Arquitectura de la partida](#07-arquitectura-de-la-partida)
- [08 · Modos de uso](#08-modos-de-uso)
- [09 · Dirección visual y lenguaje gráfico](#09-dirección-visual-y-lenguaje-gráfico)
- [10 · Storyboard de pantallas](#10-storyboard-de-pantallas)
- [11 · Accesibilidad y carga cognitiva](#11-accesibilidad-y-carga-cognitiva)
- [12 · Sistema de niveles y dificultad](#12-sistema-de-niveles-y-dificultad)
- [13 · Arquitectura técnica recomendada](#13-arquitectura-técnica-recomendada)
- [14 · Roadmap y criterios de aceptación](#14-roadmap-y-criterios-de-aceptación)
- [15 · Riesgos y decisiones pendientes](#15-riesgos-y-decisiones-pendientes)
- [16 · Fundamentación y límites de evidencia](#16-fundamentación-y-límites-de-evidencia)
- [17 · Brief final para desarrollo](#17-brief-final-para-desarrollo)

---

## 01 · Resumen ejecutivo

NEXO es un videojuego móvil de puzzles visuales autocontenidos. Cada partida dura aproximadamente 2 a 5 minutos, empieza en pocos segundos y termina con un cierre deliberado. El jugador manipula relaciones entre objetos geométricos para descubrir cómo funciona un sistema y alcanzar un estado objetivo.

No busca maximizar sesiones, tiempo de pantalla ni retornos diarios. Su hipótesis de producto es que un reto lógico breve, interesante y con final claro puede convertirse en una alternativa atractiva al consumo impulsivo de contenido, especialmente para usuarios que desean estimulación intelectual sin entrar en una experiencia interminable.

**Promesa central** — «Abre, comprende, resuelve, cierra». No es una aplicación médica, ni promete mejorar los síntomas del TDAH o el rendimiento cognitivo general.

### Decisiones innegociables

- Una mecánica principal, no una colección de minijuegos.

- Pantallas muy limpias, con una palabra dominante como guía contextual.

- Controles táctiles simples; profundidad procedente de las reglas, no de gestos complicados.

- Partidas con principio y final, sin reproducción automática de otra.

- Reto diario opcional, sin rachas, penalizaciones ni FOMO.

- Dificultad elevada posible con pocos elementos visibles.

- Sin anuncios intersticiales ni monetización basada en permanencia.

## 02 · Audiencia y problema

Audiencia principal: personas adultas que disfrutan resolviendo problemas y buscan un descanso cognitivo breve. Se prestará especial atención a experiencias de TDAH y altas capacidades (AACC), sin asumir que constituyen un perfil homogéneo ni que un juego pueda sustituir apoyos clínicos o hábitos de sueño.

| Situación | Necesidad | Respuesta del producto |
|---|---|---|
| Al despertarse | Actividad activa, con poca fricción | Reto diario suave, sin presión ni reloj |
| Impulso de abrir redes | Estimulación breve y cerrada | Una partida de 2–3 min y salida clara |
| Bloqueo o aburrimiento | Novedad y sensación de progreso | Problema autocontenido con descubrimiento |
| Descanso voluntario | Desafío más profundo, sin ruido | Partida de 4–5 min, sin interrupciones |

## 03 · Pilares de diseño

**Comprensión instantánea** — La primera acción se entiende mediante disposición visual, movimiento demostrativo y respuesta inmediata.

**Profundidad emergente** — Las mismas acciones generan consecuencias nuevas al combinar reglas y estados.

**Satisfacción finita** — El momento de resolver es el clímax; no existe una segunda capa de recompensa que exija continuar.

**Autonomía** — Se puede pausar, pedir pista, abandonar o volver sin castigo.

**Calma visual** — Una sola tarea por pantalla; sin efectos de atención competitiva.

## 04 · Mecánica principal: conectar para transformar

Regla de interacción: el usuario selecciona un nodo y lo conecta con otro mediante un deslizamiento. En accesibilidad, puede tocar primero un nodo y luego el segundo. El sistema ejecuta una transformación determinista y anima el resultado.

Los nodos poseen propiedades discretas (color, forma, orientación, estado). Las aristas representan relaciones posibles. El objetivo es igualar un patrón mostrado en la parte superior o en una vista fantasma.

### Vocabulario de acciones

| Acción | Gesto | Resultado |
|---|---|---|
| Conectar | Arrastrar de nodo A a nodo B | Aplica la regla activa de esa relación |
| Inspeccionar | Pulsación larga opcional | Reproduce el último cambio visualmente |
| Deshacer | Botón discreto o gesto explícito | Revierte exactamente un movimiento |
| Reiniciar | Menú contextual | Restaura el estado inicial sin penalización |
| Pista | Icono de ayuda discreto | Revela una relación gradualmente |

Importante: se descartan como controles principales «girar» y «transferir» independientes. En la propuesta anterior complicaban innecesariamente el aprendizaje. Rotación y transferencia pasan a ser efectos de una conexión, no gestos adicionales.

**Modelo técnico mínimo** — Un puzzle se define como P = (V, E, S0, T, R, L): conjunto de nodos V, conexiones permitidas E, estado inicial S0, estado objetivo T, reglas de transición R y límite orientativo de movimientos L (opcional). Cada acción válida (A, B) calcula un nuevo estado mediante una función determinista R(S, A, B).

Cada nivel debe ser reproducible, tener al menos una solución verificada y permitir deshacer. En fases avanzadas, R puede depender del historial acotado de acciones; el historial debe representarse visualmente para evitar carga de memoria arbitraria.

## 05 · Primer minuto: onboarding jugable

| Momento | Palabra en pantalla | Lo que sucede |
|---|---|---|
| 0–5 s | TOCA. | Un círculo reacciona al toque y se divide en dos. |
| 5–12 s | UNE. | Una guía animada muestra un arrastre; el jugador conecta los nodos. |
| 12–20 s | CAMBIA. | Los colores se intercambian y se destaca el resultado. |
| 20–40 s | ORDENA. | Aparece un objetivo de dos o tres elementos. |
| 40–60 s | HECHO. | Microanimación y cierre, sin botón dominante de siguiente. |

El onboarding no debe depender de leer estas palabras. Cada pantalla necesita una señal visual inequívoca y feedback inmediato; las palabras son identidad editorial, no instrucciones suficientes por sí solas.

## 06 · Ejemplo de puzzle funcional

Objetivo: ordenar cuatro círculos para igualar una secuencia de colores. Estado inicial: [Ámbar, Turquesa, Lavanda, Ámbar]. Objetivo: [Turquesa, Ámbar, Ámbar, Lavanda]. Regla: conectar dos círculos intercambia sus posiciones de color.

Solución de referencia: intercambiar posiciones 1 y 2; después 3 y 4. El resultado coincide con el objetivo. Son dos movimientos y el juego debe reconocer cualquier otra secuencia válida.

Este ejemplo sirve para enseñar el gesto, no constituye la innovación del producto: intercambiar posiciones es una mecánica conocida. La novedad a prototipar aparece cuando la conexión altera tanto el estado como la regla que regirá la próxima conexión.

**Ejemplo de regla avanzada: ECO** — Un nodo con marca de eco recuerda el último color recibido. Al conectar ese nodo por segunda vez, transmite al destino el color anterior en lugar del actual. El jugador debe anticipar una transformación diferida. El símbolo de eco y un pequeño rastro visual indican esta memoria; nunca se exige recordar información invisible.

**Ejemplo de regla avanzada: INVERSIÓN** — En una conexión dirigida, A→B rota el destino una posición a la derecha, mientras B→A lo rota a la izquierda. La dirección del gesto importa y se representa mediante una flecha tenue. Esto introduce planificación sin aumentar el número de controles.

**Ejemplo de regla avanzada: REESCRITURA** — Una conexión especial cambia temporalmente la función de otra arista (por ejemplo, de intercambiar a invertir). La arista modificada cambia de forma y color para que el usuario vea qué regla está activa. El objetivo requiere preparar primero el sistema y ejecutar después la conexión decisiva.

## 07 · Arquitectura de la partida

| Fase | Duración orientativa | Propósito | Interfaz |
|---|---|---|---|
| DESCUBRE. | 20–45 s | Inferir o recordar una relación | Pocas piezas; experimento libre |
| TRANSFORMA. | 40–90 s | Aplicar la regla con un objetivo | Estado objetivo visible |
| RESUELVE. | 60–150 s | Combinar dos efectos o un cambio de regla | Tablero compacto; deshacer/pista |
| HECHO. | 5–10 s | Confirmar y cerrar | Animación sutil y salida principal |

La duración es un objetivo de diseño, no un límite de tiempo. Si alguien necesita ocho minutos, el juego no lo penaliza. La dificultad se ajustará entre sesiones, nunca mediante presión artificial durante una partida.

## 08 · Modos de uso

**DESPIERTA. · reto del día** — Un reto diario único y opcional, accesible desde widget o acceso directo. Comienza con una interacción de baja fricción, incluye un pequeño descubrimiento y termina en 2–4 minutos. Si no se juega, no se pierde ninguna recompensa ni aparece un aviso de racha rota.

No se presupone que el puzzle mejore la activación cerebral de forma duradera. Se validará si es un ritual más agradable que abrir redes al levantarse y si facilita comenzar la siguiente actividad.

**REINICIA. · reset breve** — Una partida de 2–3 minutos para momentos de aburrimiento, transición o impulso de scroll. Acceso directo desde inicio; un solo puzzle con dificultad adaptada y salida inmediata al resolverlo.

**PROFUNDIZA. · reto concentrado** — Una partida de 4–5 minutos con mayor interacción entre reglas, pero la misma gramática táctil. No introduce ruido visual, temporizadores ni presión social.

### Política de fin de sesión

- Pantalla «HECHO.» con una composición visual resuelta y la acción principal «Cerrar».

- La opción «Otra partida» puede existir en un menú secundario, nunca en autoplay.

- Sin contadores de racha, cajas sorpresa, recompensas variables ni mensajes de escasez.

- No bloquear a la fuerza el juego tras una partida: preservar la autonomía y medir uso real.

## 09 · Dirección visual y lenguaje gráfico

Dirección: minimalismo editorial, atmósfera tranquila, geometría precisa y microanimaciones con intención. La experiencia debe sentirse más próxima a una pieza de diseño interactivo que a una aplicación de entrenamiento cerebral.

| Elemento | Especificación |
|---|---|
| Paleta oscura | Fondo `#101820`; pizarra `#253441`; marfil `#F0EDE5` |
| Acentos | Ámbar `#E8AA72`; turquesa `#7CB7AC`; lavanda `#D7D4ED` |
| Tema claro | Marfil cálido con contraste AA; preferencia manual o del sistema |
| Tipografía | Sans geométrica; una palabra dominante y apoyo breve |
| Movimiento | 150–350 ms; opción de reducir movimiento |
| Audio | Tonos discretos opcionales, sin sonidos de casino |
| Háptica | Pulsos sutiles configurables, nunca imprescindibles |
| Tablero | 3–7 nodos en MVP, espacio vacío amplio y objetivo visible |

## 10 · Storyboard de pantallas

| Entrada | Partida | Cierre |
|---|---|---|
| **DESPIERTA.** | **UNE.** | **HECHO.** |
| Tu reto de hoy | Desliza entre dos piezas | Ahora sigue con tu día |

Pantalla A: DESPIERTA. Entrada editorial con una única palabra, un elemento central y acceso directo al reto. Pantalla B: UNE. El tablero ocupa el centro; el objetivo y los controles auxiliares se subordinan a la interacción. Pantalla C: HECHO. Los nodos forman una composición estable y el cierre se presenta sin estímulos de continuación.

### Jerarquía exacta en partida

- Parte superior: NEXO pequeño a la izquierda; progreso «02 / 03» a la derecha.

- Zona de título: palabra única en mayúsculas, p. ej. «ORDENA.»; debajo, ayuda contextual de máximo una frase si hace falta.

- Zona central: tablero, mínimo 60 % de la altura útil y áreas táctiles generosas.

- Zona inferior: objetivo visual y botones secundarios «deshacer» / «pista», sin menús invasivos.

- Resolución: animación de convergencia, palabra «HECHO.», texto «Ahora sigue con tu día».

Microcopy propuesto Entrada: «DESPIERTA.» / «REINICIA.» / «PROFUNDIZA.». Durante el aprendizaje: «TOCA.» / «UNE.» / «CAMBIA.» / «ORDENA.». Resolución: «HECHO.». Los verbos deben describir acciones reales y consistentes: no usar «RESPIRA.» si el juego no propone un ejercicio de respiración.

## 11 · Accesibilidad y carga cognitiva

- No depender exclusivamente del color: cada estado debe poder distinguirse por forma, patrón u orientación.

- Tamaños táctiles recomendados de al menos 44 × 44 pt equivalentes; soporte para selección por dos toques.

- Alternativa a animaciones, control de vibración, silencio completo y contraste suficiente.

- Deshacer ilimitado y pistas en tres escalones: dónde mirar, qué relación importa y primer paso.

- Mostrar información necesaria en pantalla; no exigir memoria de cambios invisibles.

- No confundir alta dificultad lógica con interfaz recargada o carga de memoria excesiva.

## 12 · Sistema de niveles y dificultad

| Familia | Niveles MVP | Regla principal | Reto mental |
|---|---|---|---|
| RESONANCIA | 1–10 | Intercambio y transmisión | Aprender la gramática |
| PROPAGACIÓN | 11–20 | Un gesto afecta a vecinos | Anticipación |
| ECO | 21–30 | Estados anteriores afectan al presente | Secuencias causales |
| INVERSIÓN | 31–40 | Dirección y orden importan | Planificación |
| REESCRITURA | 41–50 | Acciones modifican otras reglas | Pensamiento de segundo orden |
| SÍNTESIS | 51–60 | Combinaciones de dos reglas | Deducción avanzada |

Nota de producto: estos 60 niveles son una propuesta de contenido inicial, no 60 niveles ya creados. Para validar la mecánica se construirán primero 10 puzzles con dos reglas y se observará si los jugadores entienden la causa de sus resultados.

### Generación y validación de puzzles

- Definir un conjunto pequeño de estados y transiciones válidas por familia.

- Generar un estado objetivo alcanzable a partir de un estado inicial.

- Resolver automáticamente mediante búsqueda en anchura o A* cuando sea apropiado.

- Rechazar niveles sin solución, triviales, excesivamente largos o con soluciones por azar.

- Estimar dificultad con longitud mínima de solución, ramificación y número de reglas interdependientes.

- Revisar manualmente claridad, elegancia y legibilidad de los niveles de lanzamiento.

**Adaptación sin infantilizar** — Registrar de forma local y opcional tiempo de resolución, número de movimientos, uso de pistas y reinicios. Ajustar gradualmente complejidad de reglas y longitud de solución, no aumentar arbitrariamente el número de elementos. Ofrecer «quiero un reto mayor» como preferencia explícita.

## 13 · Arquitectura técnica recomendada

Stack de MVP: Flutter + motor de estados puro en Dart, o Godot 4 si las animaciones y transiciones físicas terminan siendo centrales. Para este concepto, Flutter es una opción razonable por su interfaz editorial, control táctil y despliegue iOS/Android. La lógica del puzzle debe ser independiente del renderizado.

- Modelo: definición de niveles JSON versionada; nodos, aristas, reglas, estado inicial y objetivo.

- Motor: reducer determinista que recibe acción y devuelve nuevo estado + eventos visuales.

- Validador: solver automatizado y pruebas unitarias por familia de reglas.

- Presentación: renderer vectorial, animaciones discretas, gestos táctiles y alternativa accesible.

- Persistencia: progreso y preferencias locales; backend innecesario para el primer prototipo.

- Analítica: opt-in, mínima y agregada, con especial cuidado al registrar comportamiento de uso.

## 14 · Roadmap y criterios de aceptación

| Fase | Entregable | Criterio de salida |
|---|---|---|
| 0. Exploración | Revisión de referentes y riesgos de similitud | Propuesta diferenciada y nombre provisional |
| 1. Prototipo | 10 puzzles, 2 reglas, 1 pantalla jugable | La mayoría entiende el gesto sin explicación verbal |
| 2. Prueba de juego | Sesiones observadas con usuarios variados | Resolución atribuida a comprensión, no azar |
| 3. Vertical slice | 3 modos, 20 puzzles, sonido y cierre | Partidas finitas y final satisfactorio |
| 4. MVP | 60 puzzles, accesibilidad, progreso local | Estabilidad y dificultad equilibrada |
| 5. Piloto | Prueba longitudinal de 2 semanas | Uso voluntario, cierre natural y feedback positivo |

### Indicadores de éxito

- Tiempo desde abrir la app hasta primera acción válida: objetivo de producto inferior a 10 s.

- Porcentaje de nuevos jugadores que comprenden el gesto principal sin tutorial textual.

- Tasa de puzzles resueltos, abandonos por frustración y uso de pistas por dificultad.

- Proporción de sesiones que finalizan tras una partida, sin impedir seguir jugando.

- Autoevaluación voluntaria: «¿Te ha ayudado a hacer una pausa útil?» y «¿Has podido retomar lo que ibas a hacer?».

- Para modo matinal: preferencia y adherencia voluntaria, sin afirmar efectos cognitivos no demostrados.

## 15 · Riesgos y decisiones pendientes

| Riesgo | Mitigación |
|---|---|
| Parecido a puzzles existentes | Investigación comparativa antes de afirmar originalidad; iterar mecánica |
| Aprendizaje demasiado abstracto | Primer gesto guiado por animación y feedback; test de cinco segundos |
| Experimentación al azar | Pistas causales, reglas legibles y validación de soluciones |
| Frustración en dificultad alta | Deshacer ilimitado, pistas graduales y dificultad adaptativa |
| Sesiones demasiado largas | Fin explícito, sin autoplay y sin bucles de recompensas |
| Promesas de salud no sustentadas | Posicionamiento como entretenimiento y bienestar digital, no tratamiento |
| Nombre NEXO no disponible | Comprobar marcas, tiendas de apps y dominios antes de registrar |

## 16 · Fundamentación y límites de evidencia

El diseño se inspira en literatura sobre motivación, preferencias por recompensas inmediatas, entrenamiento cognitivo y heterogeneidad de perfiles con TDAH y altas capacidades. Sin embargo, ningún estudio citado aquí valida específicamente NEXO. Las decisiones concretas son hipótesis de producto que deben ponerse a prueba.

### Qué es razonable afirmar

- El juego ofrece resolución de problemas, feedback inmediato y una experiencia delimitada.

- La dificultad y el tipo de desafío pueden ajustarse sin incrementar el ruido visual.

- Es posible investigar si este ritual resulta preferible a abrir aplicaciones de consumo pasivo.

### Qué no se debe afirmar

- Que NEXO «libera la cantidad justa de dopamina»: no es una variable controlable de ese modo.

- Que jugar tres minutos al despertar mejora de forma demostrada la función ejecutiva del resto del día.

- Que el juego trata el TDAH, sustituye medicación o mejora la inteligencia.

- Que la mecánica es única en el mercado sin una búsqueda comparativa y, si procede, asesoramiento de propiedad intelectual.

### Referencias para investigación posterior

- Cortese, S. et al. (2015). Cognitive training for attention-deficit/hyperactivity disorder: meta-analysis of clinical outcomes. Journal of the American Academy of Child & Adolescent Psychiatry.

- Sonuga-Barke, E. J. S. et al. (2013). Nonpharmacological interventions for ADHD: systematic review and meta-analyses of randomized controlled trials. American Journal of Psychiatry.

- Deci, E. L. y Ryan, R. M. (2000). The “what” and “why” of goal pursuits: human needs and self-determination of behavior. Psychological Inquiry.

- Sweller, J. (1988). Cognitive load during problem solving: effects on learning. Cognitive Science.

Estas referencias aportan contexto teórico; deben revisarse en profundidad antes de utilizar sus resultados en materiales comerciales o alegaciones de eficacia.

## 17 · Brief final para desarrollo

Construir primero: una pantalla vertical con tres a cinco nodos, conexión por arrastre y por doble toque, una regla de intercambio, una segunda regla de propagación, objetivo visual, deshacer, pista y pantalla final «HECHO.». Crear diez puzzles verificables y probarlos con usuarios.

No construir todavía: cuenta de usuario, tienda, ranking, rachas, notificaciones de retención, generación ilimitada, red social, logros o animaciones complejas.

La pregunta central del primer test es: «¿Se entiende en segundos, se disfruta al descubrir la regla y se puede cerrar con satisfacción después de resolver?» Si no se cumplen las tres condiciones, debe revisarse la mecánica antes de ampliar el contenido.

NEXO · Una experiencia breve, inteligente y con final.
