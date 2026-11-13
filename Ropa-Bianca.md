# Ropa — Memoria de revisión visual de Bianca

**Responsable:** Bianca, UI/UX Reviewer.  
**Solicitante:** Nico.  
**Fecha:** 12 de noviembre de 2026, Argentina/Uruguay (UTC−03).  
**Demo:** https://nicodelos24.github.io/Ropa/?demo=1  
**Chat de origen:** `th_9f4ae5e0addf43aa`, «Auditoría visual de la app Ropa».

## 1. Resultado y estado de la entrega

Completé el recorrido visual solicitado de Inicio, Agenda, Pedidos, Inventario, Clientas, Historial y Ajustes, en claro y oscuro. Revisé las hojas de alta, detalle y edición disponibles para pedidos, productos y clientas, los modos «Del inventario» y «Escribir a mano», las cuotas, los filtros, estados sin coincidencias y las zonas inferiores alcanzables por desplazamiento.

**No daría el OK visual todavía.** Las prioridades siguen siendo evitar que el botón + tape información o fechas, corregir el desplazamiento heredado entre secciones y mejorar los contrastes de acciones y estados. No hace falta rediseñar la app: la base de tarjetas, jerarquía y animación es amable y ordenada.

### Cambios de estado respecto del primer informe

- **Historial: fallo de apertura resuelto en la segunda pasada.** Ahora muestra cinco movimientos de ejemplo; probé Todos y Socia, y Socia deja dos movimientos de esa autora. Verificado en oscuro y claro, también a 393 px.
- **Agenda: ausencia de fechas resuelta en las listas generales.** Ahora cada tarjeta de esas listas muestra su fecha. No mantener vigente el hallazgo anterior de «entregas sin fecha» para esta versión.
- **Agenda: duplicación del día seleccionado sigue pendiente.** Seleccionar el 13 y desplegar otras entregas muestra dos veces a María Fernanda.
- **Nuevo pedido desde Agenda:** comprobé que el botón + conserva el día seleccionado: con el 15 de noviembre seleccionado, el formulario abre con `2026-11-15`. No registrar este comportamiento como un error.
- El resto de los puntos se detalla abajo con su alcance y evidencia; los hallazgos de la primera pasada se conservan en la transcripción, pero no todos siguen vigentes.

## 2. Alcance, método y límites

### Condiciones de revisión

1. Usé exclusivamente la URL `?demo=1`; no trabajé con cuentas ni datos reales.
2. Primera pasada: navegador a aproximadamente **1280 × 722 px**, claro y oscuro, más una revisión móvil parcial en oscuro.
3. Continuación: completé los pendientes usando un **viewport de 393 px de ancho** dentro de un iframe de la misma demo, en mi propio navegador. El alto disponible pasó de 722 a 522 px durante la revisión. Esto permite revisar el layout responsive real de la página, pero **no equivale a una prueba en un teléfono físico**.
4. La herramienta no ofrecía redimensionado del viewport ni referencias accesibles a controles dentro del iframe. Para esa comprobación creé un contenedor temporal de revisión en mi pestaña y usé JavaScript para accionar los mismos botones, desplazar el contenido y medir geometría/estilos. No cambié CSS ni código de la app publicada. Al terminar cancelé el formulario abierto y retiré el contenedor temporal.
5. Miré capturas reales del navegador; complementé lo observado con texto, geometría, hit testing y estilos calculados. Descargué el HTML público para contrastar el comportamiento con sus reglas de layout.
6. No guardé pedidos, productos ni clientas durante esta revisión visual. No envié WhatsApp, no importé ni borré datos, no hice pagos, no hice commit ni push. El QA funcional de Orion es trabajo separado.

### Versión de la continuación

- Commit local verificado: **`01e0f28`** — `historial: fix crash con datos raros (bug de bianca), filete anti-crash en vistas, fechas en entregas de agenda, chips con mas contraste`.
- El SHA-256 de `index.html` local coincidió con el HTML descargado de la publicación, tanto al comenzar como al cerrar la continuación:

```text
ec89394b80a16e8ec128d35a0270ec0a9989cddf576bd954a02b4e990c66ef08
```

- El HTML de la continuación pesaba 94050 bytes; el de la primera pasada pesaba 93249 bytes. Son dos estados distintos: no atribuir al estado actual el fallo inicial de Historial.
- Última comprobación de hash registrada: **2026-11-12 23:34:32 −03:00**.

### Cobertura consolidada

| Vista / hoja | Oscuro | Claro | Qué revisé |
|---|---|---|---|
| Inicio | Revisado | Revisado | Resúmenes, SVG/acento por tarjeta, agenda próxima, pendientes, accesos a Pedidos |
| Agenda | Revisado | Revisado | Calendario, selección de día con/sin entregas, otras entregas, fechas, scroll y alta |
| Pedidos | Revisado | Revisado | Listado, filtros, búsqueda, cuotas, detalle, edición y alta |
| Pedido: inventario / manual | Revisado | Revisado | Selector, nombre/precio, estados, fecha, guardar/cancelar, zonas inferiores |
| Inventario | Revisado | Revisado | Grilla, nombres, precios, categorías, acciones y superposición del + |
| Producto: alta / edición | Revisado | Revisado | Foto/galería como controles, categorías, nombre, precio y acciones al final |
| Clientas | Revisado | Revisado | Listado, nombre largo de ejemplo, teléfono y búsqueda sin coincidencias |
| Clienta: detalle / alta / edición | Revisado | Revisado | Pedidos asociados, teléfono ausente, formulario, guardar/eliminar/cancelar |
| Historial actual | Revisado | Revisado | Apertura, movimientos, fechas/autoras y filtros Todos/Socia |
| Ajustes | Revisado | Revisado | Cuenta, apariencia, prefijo, respaldo, instalación, borrado y vuelta |

**Fuera del alcance de esta revisión visual:** funcionamiento completo de exportar/importar, borrado, envío de mensajes, autenticación, carga real de fotos, teclado virtual y safe areas en iOS/Android físicos. La demo trae productos sin fotos reales; no afirmo haber validado el recorte de fotos reales. Tampoco hice una auditoría integral de accesibilidad por teclado/lector de pantalla.

## 3. Observaciones vigentes, priorizadas

P1 = corregir antes del OK visual. P2 = claridad o uso cotidiano. P3 = prolijidad y consistencia.

### B01 — P1 — El botón + tapa información y puede impedir elegir una fecha

**Dónde:** Agenda, Inventario y Pedidos; ambos temas.

**Evidencia:**

- En la primera pasada tapó el importe de Rosita en Agenda y parte del progreso de cuotas en Pedidos.
- A 393 px, en Inventario claro, se superpone con el nombre/precio/categoría de la tarjeta derecha de la primera fila, Camisa blanca.
- En **393 × 522 px**, con Agenda arriba del todo, el + queda encima del **28 de noviembre**. El centro de esa celda devuelve `BUTTON#fab` al hacer hit testing, no la celda. No es solo una proximidad visual: el toque en ese punto iría a crear un pedido.

```text
Viewport: 393 × 522
Celda 28/11: x=305.84375, y=376.421875, ancho=43.140625, alto=43.140625
Elemento en el centro de la celda: BUTTON, id=fab, texto=+
```

**Qué corregir:** reservar una zona que no contenga información ni controles debajo del botón, o cambiar su disposición en esos tamaños. El espacio de seguridad al final del documento no evita las superposiciones durante el scroll.

### B02 — P1 — El scroll de otra sección se hereda al navegar

**Dónde:** navegación inferior, cambios desde Agenda/Inventario/Ajustes a otras secciones.

**Evidencia:** al pasar desde una zona inferior a Pedidos o Clientas, las primeras tarjetas quedan arriba del área visible, bajo la cabecera fija. En la continuación, al usar «Volver a pedidos» desde Ajustes, la pantalla de destino conservó aproximadamente **944 px de desplazamiento** antes de que yo la llevara arriba para inspeccionarla.

**Qué corregir:** abrir cada sección arriba o recuperar la posición propia de esa sección. No usar la posición de la sección anterior.

### B03 — P1 — Contraste insuficiente de texto blanco sobre fondos de acción/estado

**Dónde:** Guardar y otras acciones turquesas, Pagado, Mensaje enviado y WhatsApp.

Medí estas relaciones en los colores efectivos del tema claro durante la continuación:

| Combinación | Contraste |
|---|---:|
| Blanco sobre Guardar turquesa | 3.04:1 |
| Blanco sobre verde Pagado | 2.24:1 |
| Blanco sobre naranja Mensaje enviado | 2.26:1 |
| Blanco sobre verde WhatsApp | 1.98:1 |

Esas etiquetas son texto normal, no texto grande: el objetivo de referencia es **4.5:1**. El problema no se resuelve solo haciendo más contrastados los chips inactivos.

**Qué corregir:** ajustar fondo o color del texto de cada combinación sin abandonar la paleta. En oscuro también observé el ícono nativo del selector de fecha casi negro sobre el campo oscuro; aplicar una apariencia de controles nativos compatible con el tema y comprobarlo en los navegadores objetivo.

### B04 — P2 — Campo de producto manual demasiado angosto en móvil

**Dónde:** Pedidos → editar → Escribir a mano, a 393 px.

**Evidencia:** el campo del nombre mide aproximadamente **124.34 px**, incluido el padding; el del precio ocupa 110 px, más cámara, borrar y separaciones. Incluso «Pantalón negro» deja parte del nombre fuera de la vista inicial del campo. No hay desbordamiento horizontal de la hoja, pero sí pérdida de legibilidad del dato que se está editando.

**Qué corregir:** dar más ancho útil al nombre; por ejemplo, separar el nombre de la fila de precio/acciones en móvil. No hace falta cambiar el formulario completo.

### B05 — P2 — Estado y controles de cuotas poco claros

**Dónde:** filtros, tarjetas y detalle de pedido.

- La etiqueta «En 2 cuotas» es fija aunque Lucía tiene **3 cuotas**.
- En el detalle de Lucía, «Pagó 1 de 3» se comprime en **tres líneas** entre − Cuota y + Cuota; se reproduce también a 393 px.
- La demo muestra María Fernanda con dos cuotas pagadas de dos y, aun así, como En cuotas/pendiente. Esto puede depender de la coherencia de los datos de ejemplo, pero no es una presentación clara para explicar el negocio.

**Qué corregir:** usar «En cuotas» para el estado genérico y la cantidad real en el detalle; dar ancho propio al resumen de cuotas. Revisar por separado, con QA funcional, la coherencia entre cuotas pagadas y estado.

### B06 — P2 — La búsqueda sin coincidencias se confunde con una app vacía

**Dónde:** Pedidos, Inventario y Clientas.

**Evidencia:** buscar `zzzz` en Clientas mantiene el contador de cuatro clientas arriba, pero muestra «Aún no hay clientes» y explica que se guardarán al registrar un pedido. Inventario/Pedidos presentan el mismo tipo de confusión entre falta de coincidencias y falta de datos.

**Qué corregir:** distinguir «Sin resultados para …» de la primera carga vacía y ofrecer limpiar la búsqueda. Evitar que la usuaria crea que perdió datos o que tiene que volver a cargarlos.

### B07 — P2 — «Otras entregas» repite el día seleccionado

**Dónde:** Agenda → seleccionar 13 de noviembre → Ver otras entregas.

**Evidencia:** la secuencia de tarjetas pasa a ser María Fernanda, María Fernanda, Rosita, Paco, Lucía. La primera corresponde al día seleccionado y la segunda vuelve a aparecer en la lista general. El contador de «otras» incluye ese día.

**Qué corregir:** excluir el día ya visible del listado y del contador de otras entregas. Las fechas agregadas en la nueva versión ayudan, pero no eliminan la duplicación.

### B08 — P2 — Los accesos de Inicio no cumplen del todo lo que sugieren

**Dónde:** Inicio, resúmenes y tarjetas de Pendientes de cobro.

- Al tocar **Cobrado**, abre Pedidos con **Todos** seleccionado y los cinco pedidos, no los cobrados.
- Al tocar una tarjeta de **Pendientes de cobro**, por ejemplo Rosita, no abre el detalle. El mismo aspecto de tarjeta en Pedidos sí permite abrirlo; además, la tarjeta tiene respuesta visual al pulsar.

**Qué corregir:** aplicar el filtro que promete cada resumen y hacer consistentes los accesos a los detalles. Evitar señales de interactividad si no hay una acción.

### B09 — P2 — Textos y destino inconsistentes en Ajustes

**Dónde:** Apariencia y botón inferior de vuelta.

- Al cambiar a claro con el botón de tema superior, el botón de Apariencia sigue diciendo **«Cambiar a modo claro»**. Verificado en la continuación: `data-theme=light`, etiqueta todavía de pasar a claro.
- **«Volver a pedidos» abre Inicio**, no Pedidos. Lo comprobé accionando el botón: quedó Inicio seleccionado y el subtítulo «Todo tu negocio en un vistazo».

**Qué corregir:** actualizar el texto con el tema y alinear etiqueta/destino de la vuelta.

### B10 — P2 — Escala excesiva en escritorio y salida poco accesible en hojas largas

**Dónde:** Agenda, Inventario y selector de productos del pedido, en la primera pasada a 1280 px.

- El calendario medía aproximadamente **977 px de alto**.
- Las imágenes cuadradas de Inventario crecen hasta sacar nombres/acciones del primer pantallazo.
- Una hoja de edición de pedido con selector de inventario tenía aproximadamente **1705 px de contenido**.
- En las hojas largas, el cierre/cancelación queda abajo y no hay un cierre siempre disponible arriba. Las acciones se alcanzan desplazándose y no encontré un menú o + por encima de las hojas; el problema es la distancia y pérdida de contexto, no un recorte permanente del pie.

**Qué corregir:** limitar tamaños/ancho en pantallas grandes y dar una salida visible a las hojas largas. Mantener el diseño actual.

### B11 — P3 — Orden temporal del Historial de demo

**Dónde:** Historial actual → Todos.

**Evidencia:** los movimientos de ejemplo se muestran del **6 al 10 de noviembre**, del más antiguo al más reciente, por lo que lo nuevo queda al final.

**Qué corregir:** para un historial operativo conviene ordenar por fecha descendente, no depender de la posición del elemento en el array. Hallazgo acotado a la demo revisada; no afirmo que todo dato real llegue en ese mismo orden.

### B12 — P3 — Lenguaje de íconos y acentos por sección incompleto

**Dónde:** Inicio frente al menú y el resto de las vistas.

- Inicio tiene SVG con los seis acentos pedidos; en oscuro se ven suaves y agradables.
- Menta y verde agua son cercanos entre sí; se distinguen mejor por la forma del ícono que por el color.
- El menú usa gris y un mismo azul activo para todas las secciones, y Ajustes/productos mezclan emojis con los SVG.

**Qué corregir:** trasladar los acentos a los identificadores de cada sección y unificar el lenguaje de íconos donde corresponda. No colorear todo ni aclarar colores al punto de perder contraste. Conservar la estructura y el sistema actual.

### B13 — P3 — Detalle de copia

**Dónde:** resumen de productos, por ejemplo el pedido de Medias lanas en el detalle de Rosita.

Se ve el número **2** junto a **«producto»** en singular cuando hay una línea de producto con cantidad dos. La lista de líneas y la cantidad de unidades se usan como si fueran el mismo conteo.

**Qué corregir:** acordar si el resumen expresa unidades o productos distintos y pluralizar de forma consistente. Es menor, pero importa para la prolijidad de una app comercial.

## 4. Aspectos que conservaría

- Tarjetas redondeadas, separación visual y jerarquía de títulos/importes.
- Tono general amable, sin una estética infantil.
- SVG de Inicio y el uso moderado de seis acentos.
- Entradas y respuestas de pulsación sutiles. El CSS contempla `prefers-reduced-motion`; no detecté una animación intrusiva que justifique rediseñarlas.
- En los formularios revisados a 393 px no medí desbordamiento horizontal de toda la hoja: `scrollWidth` coincidió con el ancho útil. Las categorías envuelven en varias filas y los botones inferiores se pueden alcanzar haciendo scroll.
- Historial ahora abre y el filtro Socia devuelve dos filas de Socia en claro y oscuro.
- El + de Agenda precarga correctamente el día seleccionado en el formulario nuevo.

## 5. Evidencia y continuidad para otras sesiones

### Referencias de la continuación

Las capturas se generaron con `browser_snapshot` en este chat. Se mantienen en el chat original; este Markdown conserva la transcripción textual y los resultados, no archivos de imagen incrustados.

| Evidencia | Referencia de snapshot / dato |
|---|---|
| + sobre nombre/precio de Inventario claro | `1950257627725276333.1.20` |
| + cubre celda 28 de Agenda clara | `1950257627725276333.1.27`; hit test devuelve `BUTTON#fab` |
| Producto manual angosto | `1950257627725276333.1.19`; nombre 124.34375 px |
| Contrastes y pie de edición | `1950257627725276333.1.18`; relaciones 3.04 / 2.24 / 2.26 / 1.98 |
| Cobrado abre Todos | `1950257627725276333.1.15`; cinco pedidos |
| Pendiente de Inicio no abre detalle | `1950257627725276333.1.14`; `sheetOpen=false` tras tocar Rosita |
| Etiqueta de tema desactualizada | `1950257627725276333.1.10` y `.1.11`; tema light y texto pasar a claro |
| Volver a pedidos abre Inicio | `1950257627725276333.1.13`; selección Inicio y scroll heredado 944 px |
| Repetición del día seleccionado | `1950257627725276333.1.36`; nombres MF, MF, Rosita, Paco, Lucía |
| Búsqueda vacía contradictoria | `1950257627725276333.1.37`; cuatro clientas y «Aún no hay clientes» |
| Historial claro y filtro Socia | `1950257627725276333.1.30` / `.1.31` |
| Historial oscuro actual | `1950257627725276333.1.32` y `.1.42` |
| Hojas de clienta claro | `.1.24` / `.1.25` / `.1.26` |
| Hojas de clienta oscuro | `.1.38` / `.1.39` / `.1.40` |
| Alta de producto claro / oscuro, pie alcanzable | `.1.22` / `.1.41` |

### Archivos auxiliares y trabajo separado

- Descargas de referencia de esta continuación:
  - `/tmp/apx-scratch-4f023747/th_9f4ae5e0addf43aa/ropa-publicada-continuacion.html`
  - `/tmp/apx-scratch-4f023747/th_9f4ae5e0addf43aa/ropa-publicada-cierre.html`
- Son temporales: la evidencia durable es este documento, los resultados transcriptos y el chat. No depender de que esos archivos temporales sigan existiendo.
- Tarea APX relacionada: `task_694ea2a436dd4a1e`, «QA de punta a punta de Ropa en modo demo». Dejé constancia de que mi revisión es visual y el QA funcional de Orion es independiente. No cerrar esa tarea por terminar este informe.
- Para retomar: abrir la demo, verificar primero el hash/versión vigente y volver a probar B01–B03. No asumir que un hallazgo viejo sigue abierto ni dar por corregido algo solo por el texto de un commit.
- No autoricé ni realicé commit, merge o push. El único archivo del proyecto creado por mí para esta entrega es `Ropa-Bianca.md`.

## 6. Copia textual del chat

Transcripción íntegra de los mensajes de Nico y las respuestas visibles de Bianca hasta este cierre. APX agrupa los comentarios de avance y el cierre de una misma respuesta; aquí se conservan en orden. Se mantienen los mensajes históricos tal como fueron emitidos, incluso cuando un hallazgo fue corregido después. Las capturas y los resultados técnicos no se reproducen como imágenes en este archivo: sus referencias y resultados relevantes están en las secciones anteriores.

### Nico — pedido inicial — 12/11/2026, 22:21 −03

Recorré TODAS las vistas de https://nicodelos24.github.io/Ropa/?demo=1 en modo oscuro y claro: inicio, agenda, pedidos, inventario, clientas, historial, ajustes y las hojas de detalle/edición. Buscá: textos cortados, elementos tapados por el botón + o el menú, contrastes malos, íconos SVG con colores pastel por sección (menta, verde agua, ámbar, celeste, rosa, lila) que se distingan, animaciones sutiles, prolijidad general. Es una app para una clienta joven con su primer negocio: vistoso y amable pero profesional. Lista de observaciones con dónde y qué.

### Bianca — avance de la primera pasada

Ya encontré dos problemas importantes: Historial queda mostrando la pantalla anterior, y Agenda lista entregas sin indicar sus fechas. También vi pérdida de contexto al cambiar de sección y contrastes flojos en botones; sigo con la pasada en claro y las hojas.

### Bianca — primer informe

**No lo daría por OK todavía.** Revisé las siete secciones en claro y oscuro, con las hojas de alta, detalle y edición de pedidos, productos y clientas. También hice comprobaciones a **393 px en oscuro**. No modifiqué código ni publiqué nada.

### Corregir primero

| Dónde | Qué observé y qué corregir |
|---|---|
| **Historial · ambos temas** | Cambian el título y la selección del menú, pero **queda el contenido de la sección anterior**. Desde Clientas seguí viendo las cuatro clientas, sin movimientos ni filtros. Es bloqueante: aparenta estar en Historial, pero muestra otra información. |
| **Agenda y Pedidos · botón +** | El botón flotante **se superpone con información de las tarjetas**. En Agenda clara quedó sobre el importe de Rosita; en Pedidos tapa parte del progreso de cuotas. El margen al final permite descubrir la última tarjeta, pero no evita estas superposiciones durante el recorrido. |
| **Navegación entre secciones** | Se conserva el desplazamiento de la pantalla anterior. Al pasar desde el fondo de Agenda o Inventario a Pedidos/Clientas, **las primeras tarjetas quedan ocultas bajo la cabecera fija**. Cada sección debería abrir arriba o recuperar su propia posición, no la de otra. |
| **Agenda · listas inferiores** | “Próximas entregas” muestra pedidos de distintos días **sin indicar sus fechas**. Además, al desplegar “otras entregas” reaparece el pedido del día seleccionado. Agrupar por fecha o mostrarla en cada tarjeta y excluir el día ya visible. |
| **Botones, estados y fechas · ambos temas** | El blanco pierde fuerza sobre turquesa, verde y naranja: **Guardar, estados seleccionados y WhatsApp** son los casos más visibles. En oscuro, el ícono nativo del calendario queda casi negro sobre el campo oscuro. Ajustaría estas combinaciones sin cambiar la paleta general. |

### Claridad y prolijidad

| Dónde | Qué observé y qué corregir |
|---|---|
| **Pedidos · cuotas y detalle** | El filtro y las etiquetas dicen **“En 2 cuotas”**, pero Lucía tiene **3 cuotas**. Usaría “En cuotas” para el estado y la cantidad real en el detalle. Entre los botones −/+ el texto “Pagó 1 de 3” queda apretado en tres líneas, incluso en escritorio. |
| **Búsqueda · Pedidos, Inventario y Clientas** | Una búsqueda sin coincidencias muestra **“Sin pedidos”, “Sin productos” o “Sin clientes”**, con invitación a crear uno. Confunde “no encontré resultados” con “todavía no cargaste nada”. Mostrar “Sin resultados para…” y una acción para limpiar la búsqueda. |
| **Agenda, Inventario y selector de productos · escritorio** | Los elementos crecen demasiado con el ancho: medí un calendario de aproximadamente **977 px de alto**; las imágenes de Inventario dejan nombres y acciones fuera del primer pantallazo; la hoja de pedido llega a unos **1705 px de contenido**. Limitar ancho/tamaño en pantallas grandes. En los formularios largos también falta un cierre siempre accesible arriba. |
| **Ajustes · Apariencia** | Si cambio a claro con el botón superior, el botón de Ajustes **sigue diciendo “Cambiar a modo claro”**. El texto tiene que actualizarse junto con el tema. |
| **Iconografía y colores por sección** | Los seis colores están presentes en los SVG de **Inicio**, pero no se sostienen en el resto: el menú usa gris y un mismo azul activo, y Ajustes mezcla emojis con los SVG. Menta y verde agua también se parecen bastante. Unificar el lenguaje de íconos y trasladar los acentos a las secciones, sin colorear todo ni sacrificar contraste. |

**Lo que mantendría:** las tarjetas redondeadas, la jerarquía general y las animaciones de entrada/pulsación. La base se siente amable y ordenada; no necesita un rediseño.

**Límite de la revisión:** Historial no pudo evaluarse más allá del fallo de apertura. La pasada móvil completa quedó pendiente: falta claro y completar Agenda/Ajustes a 393 px.

### Nico — continuación — 12/11/2026, 23:14 −03

Continúa por favor

### Bianca — avance de la continuación

La demo cambió entre pasadas: ahora Historial abre y las entregas de Agenda muestran fecha. Ya comprobé esas mejoras; estoy completando la revisión móvil sobre la versión actual para no dejarte observaciones desactualizadas.

### Nico — documento y memoria — 12/11/2026, 23:31 −03

Cuando termines genera un documento llamado Ropa-Bianca.md para que tengas toda la memoria de lo que hiciste y toda la copia de este chat por favor

### Bianca — confirmación del documento — 12/11/2026, 23:32 −03

Lo sumo al cierre: voy a dejar **Ropa-Bianca.md** en el proyecto, con la revisión, los hallazgos actualizados y la copia del chat. Voy a separar claramente lo que sigue pendiente de lo que ya cambió en la demo.

### Bianca — cierre de esta entrega

Terminé la pasada pendiente a **393 px, en claro y oscuro**, y creé **Ropa-Bianca.md** con la memoria de trabajo, los hallazgos actualizados y la copia textual del chat.

**Dos puntos del primer informe ya están resueltos:** Historial abre y sus filtros funcionan; Agenda ahora muestra fechas en las entregas.

Lo más importante que confirmé o sumé:

- **Botón +:** en Inventario tapa nombre/precio de Camisa blanca. En Agenda a **393 × 522**, queda sobre el día **28** e intercepta el toque.
- **Edición manual:** el nombre del producto queda con unos **124 px**; hasta “Pantalón negro” se ve cortado.
- **Inicio:** “Cobrado” abre todos los pedidos, sin filtrar; las tarjetas de pendientes no abren su detalle.
- **Ajustes:** “Volver a pedidos” lleva a Inicio. Sigue pendiente la etiqueta de tema que no se actualiza.
- **Contraste:** medí **3.04:1** en Guardar y **1.98:1** en WhatsApp, por debajo del **4.5:1** de referencia para esas etiquetas.

También siguen el scroll heredado, la repetición del día seleccionado en “otras entregas”, los estados de cuotas y los mensajes engañosos de búsqueda vacía. Todo quedó documentado con pasos y evidencia.

No modifiqué código ni hice push; agregué únicamente el documento.

---

## Continuación · 13 de noviembre de 2026 · Revisión de v23

**Esta sección es memoria resumida de una ronda nueva, no parte de la transcripción histórica anterior.** Nico pidió revisar los cambios de Alba y mostrárselos al terminar. Los hallazgos del informe/transcripción de arriba son históricos: no reutilizarlos como pendientes de v23 sin cotejar cada caso.

- Base: `b25482f`, HTML publicado/local idéntico, SHA-256 `b76393d126ac5a2e8a601c337da9afd625ca7813896ab9acb1c15deccaa9371d`.
- Veredicto: **NO OK todavía**. Informe completo con pasos y criterios en la entrada final de `Bianca-Emite.md`, «Revisión de v23 / BV-13 implementado», R23-01 a R23-06. Aviso agregado a `Alba-Recibe.md`.
- Bien: acciones SVG sobre foto/placeholder, separación de cierre al pie, borde/check de selección inicial y sin salto de layout, acceso compacto de WhatsApp y URL de contactos sin `text`.
- Por corregir: logo gigante en botones grandes de WhatsApp; timeout del primer modal que oculta la segunda confirmación de Borrar todo; foco destructivo y sin retorno; errores con check verde/default ok; + superpuesto y Sin WA inerte; X no persistente y scroll heredado de hojas.
- Cobertura: escritorio; matrices de selección/contactos 320/360/393 × 600 en claro/oscuro; ficha/lista 393 × 522; modal 320 en ambos temas. Iframe de la demo real, no teléfono físico. Selección: estado/total correctos al alternar dos veces, sin guardar. Imagen sintética adjuntada por el input de producto para verificar las acciones sobre foto.
- Probé cancelar/aceptar un borrado de pedido de muestra y recargué para regenerar los cinco pedidos. No completé Borrar todo ni envié WhatsApp. URL de contacto interceptada temporalmente para verificar destino sin navegar, restaurando el método original. Contenedor de revisión retirado.
- Evidencia preservada en `task_611c67d04f724048`: lámina `ropa-v23-revision-visual.png`, matrices y capturas. Solo documentación modificada; sin commit, push o publicación.
- Pendientes explícitos: correcciones de Alba, regresión funcional amplia con Orion; no aprobados consola, teclado/lector completo, zoom 200 %, dispositivo físico, importación ni borrado total final. Ver límites del informe antes de declarar algo verificado.
