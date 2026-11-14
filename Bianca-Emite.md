# Bianca — Emite

**Última revisión:** v23 (`b25482f`), **NO OK todavía**. Ver la entrada final «Revisión de v23 / BV-13 implementado», R23-01 a R23-06. La especificación anterior se conserva como antecedente.

## 2026-11-13 · Bianca → Alba · Pedido de Nico: detalle, WhatsApp, contactos y avisos

**Estado: especificación lista para implementar; los cambios de interfaz NO están implementados ni aprobados visualmente.**

**Registro de envío:** dejé aviso de esta especificación a Alba en `Alba-Recibe.md`, con fecha 2026-11-13 y referencia a BV-13-01–BV-13-05.

Nico pidió expresamente que deje acá, bien detallado, qué debe cambiar Alba. Revisé sus cinco capturas, recorrí las pantallas implicadas y probé confirmaciones y validaciones en la demo. El aviso de este documento queda también en `Alba-Recibe.md`, según `AGENTS.md`; el buzón se lee en la próxima sesión, no notifica en vivo.

### Alcance y evidencia de esta ronda

- URL probada: `https://nicodelos24.github.io/Ropa/?demo=1`.
- Fecha: 13 de noviembre de 2026. Esta entrada es una ronda nueva, no una repetición automática de los hallazgos históricos de `Ropa-Bianca.md`.
- Base local al revisar: `0f910fb`, entrega que Alba identifica como v22 en mi buzón.
- Comparé el HTML público descargado durante esta ronda con el `index.html` local: coincidencia byte por byte. SHA-256: `a0b34dd7081bed5b6dafe3a5928cc28bc8f776c0421db19efd83a8312300029a`. Revalidar la base al empezar a implementar si hubo cambios posteriores.
- Las cinco capturas originales de Nico están adjuntas a la tarea `task_0c428c8a37a24efe`. La primera muestra por qué las acciones de edición/eliminación al pie resultan problemáticas; las restantes complementan los estados de detalle, contactos y selección de productos. No copio nombres, teléfonos ni imágenes de clientas a este buzón.
- Inspección en navegador de escritorio, en oscuro y claro. En esta ronda no cambié el tamaño del navegador ni repetí toda la auditoría responsive anterior: la matriz móvil de abajo es una condición de aceptación para la implementación, no una prueba ya aprobada.
- Solo usé datos de `?demo=1`. Para probar la aceptación de una eliminación borré un pedido de muestra, comprobé el cambio y recargué la demo: se regeneraron sus datos iniciales. No envié mensajes por WhatsApp ni operé datos reales.
- No modifiqué código de la app, no hice commit, push ni publicación. Los archivos de esta entrega son documentación.

### Resumen de lo que Nico quiere

1. **BV-13-01:** logo reconocible de WhatsApp, preferentemente SVG, en vez de la burbuja/emoji actual.
2. **BV-13-02:** acciones de editar y eliminar pedido sobre la imagen principal, con iconos estéticos; dejar el cierre separado y seguro, no junto a acciones peligrosas al final.
3. **BV-13-03:** confirmaciones y alertas propias de la app, prolijas, accesibles y con animación leve cuando corresponda.
4. **BV-13-04:** una sección de contactos más destacada, con pedidos del cliente en tarjetas y acceso directo a su chat de WhatsApp **sin texto predeterminado**.
5. **BV-13-05:** productos seleccionados al editar un pedido con borde más visible y burbuja superior derecha con marca de selección.

Mantener el sistema visual existente: amable y profesional, superficies redondeadas, colores vigentes y SVG consistentes. No es una autorización para rediseñar toda la aplicación ni cambiar estados de negocio. Las medidas sugeridas abajo son una guía de implementación; los resultados de interacción y accesibilidad sí son requisitos de aceptación.

---

### BV-13-01 · Logo de WhatsApp en los accesos de contacto

**Dónde está hoy**

- Detalle de pedido: `openOrder()`, botón `#waBtn`.
- Ficha de cliente: `openClient()`, botón `#cli-wa`.
- Ambos se generan hoy con el texto `💬 Escribir por WhatsApp`. La burbuja de conversación no representa inequívocamente WhatsApp y el emoji cambia según el sistema.

**Qué implementar**

- Sustituir la burbuja por un SVG del logo reconocible de WhatsApp, con proporciones correctas, sin deformarlo ni inventar un icono parecido.
- Conservar el rótulo visible `Escribir por WhatsApp`; el logo acompaña, no reemplaza el texto de los botones grandes.
- Usar una misma pieza SVG/helper para ambos botones y para el acceso compacto de las tarjetas de contacto de BV-13-04.
- Tamaño visual orientativo: 20–22 px, separación de unos 8 px respecto del texto; alinear ópticamente ambos dentro del botón. Los accesos compactos también deben tener área táctil de al menos 44 × 44 px.
- SVG inline o recurso local; no agregar una librería o dependencia remota de iconos solo para esto. Si el texto ya nombra la acción, el SVG es decorativo (`aria-hidden="true"`, sin foco propio).
- Mantener un tratamiento cromático coherente con los colores actuales de la app y un contraste legible en ambos temas. Un fondo verde no garantiza que texto blanco o pastel tenga suficiente contraste: medir el par final.
- El acceso de contactos debe abrir el chat vacío de BV-13-04. No incorporar allí el mensaje predeterminado que actualmente construye el detalle del pedido.

**Cómo verificar**

- Logo visible y nítido en claro/oscuro, sin emoji de burbuja restante en esos accesos.
- Botón sin texto cortado a 320, 360 y 393 px; si debe crecer en altura, no debe perder el área táctil ni tapar otros controles.
- Activar el botón abre la conversación del contacto correcto; nunca envía un mensaje automáticamente.
- El lector de pantalla anuncia una sola acción, no el dibujo y el texto por separado.

---

### BV-13-02 · Editar/eliminar sobre la imagen; cierre separado

**Problema y ubicación actual**

En `openOrder()` las acciones aparecen al pie, después de la foto, las tarjetas, el total, las cuotas y WhatsApp: `Editar pedido`, `Eliminar pedido`, `Cerrar`. Con una imagen grande o varios productos hay que recorrer bastante contenido. Nico señala además que esa zona final es donde intuitivamente busca cerrar la hoja; mezclar ahí edición y eliminación aumenta el riesgo de una acción equivocada.

**Qué implementar**

1. Crear un contenedor relativo para la imagen principal/hero del detalle. Superponer **una sola pareja de acciones del pedido** en su esquina superior derecha: lápiz SVG para editar y papelera SVG para eliminar.
2. Usar botones discretos pero perceptibles: superficie propia con suficiente opacidad, borde/sombra suave y buen contraste, que funcionen tanto sobre una foto blanca como sobre una oscura o estampada. No confiar en el color de la foto para que se vea el icono.
3. Guía de tamaño: área táctil mínima 44 × 44 px por botón, icono de 18–22 px, unos 8 px entre botones y 12–16 px de margen interior. No invadir nombre, estado ni precio ni quedar fuera de la hoja.
4. Las acciones son **Editar pedido** y **Eliminar pedido**, no editar/eliminar el producto de la foto. No duplicar la papelera en cada tarjeta del conjunto: eso cambiaría el significado y puede confundir sobre qué se borra.
5. Si el pedido no tiene foto, mantener las acciones en la misma zona superior mediante una superficie/placeholder o barra compacta coherente. La demo actual tiene productos sin foto: este caso no puede quedar sin acceso a las acciones.
6. Retirar los dos botones grandes de editar/eliminar del pie; evitar dos grupos redundantes de acciones. Dejar `Cerrar` como acción final inequívoca y neutral.
7. Agregar un cierre superior identificable (X SVG con nombre accesible `Cerrar detalle`) para no obligar a bajar hasta el final. Mantenerlo accesible al recorrer una hoja larga, sin tapar la foto ni competir físicamente con el grupo editar/eliminar. Se puede resolver con una cabecera compacta persistente dentro de la hoja.
8. Cada icono de acción debe ser un botón real con `aria-label` específico y foco visible. Un tooltip es complemento para mouse, nunca la única explicación disponible en pantallas táctiles.
9. La papelera no elimina directamente: abre la confirmación estilizada de BV-13-03. Cancelarla deja el mismo detalle abierto, con posición de scroll y contenido conservados. Cerrar el detalle tampoco debe activar edición ni eliminación.
10. Mantener la foto 4:3 y el comportamiento de tarjetas apilables de la entrega actual, salvo lo necesario para alojar bien estos controles. No cambiar las reglas de cálculo, cuotas o estados al mover acciones.

**Cómo verificar**

- Pedidos con 1 producto, varios productos, foto clara, foto oscura, sin foto y nombres largos.
- Editar abre exactamente ese pedido; cancelar la edición no guarda cambios.
- Eliminar abre la confirmación del pedido correcto; cancelar no altera pedidos, importes ni inventario.
- La X y `Cerrar` cierran solamente la hoja. Tocar fuera de la hoja no debe confundirse con aceptar una eliminación.
- A 393 × 522 px y con zoom de texto, las acciones no quedan debajo del menú, del botón + o de un borde recortado. No hay una papelera en la zona inferior que la usuaria confunda con el cierre.

---

### BV-13-03 · Confirmaciones y alertas con estilo propio

#### Lo que comprobé hoy

Las confirmaciones de las operaciones principales son `window.confirm()`: el navegador presenta cuadros con botones genéricos `OK` / `Cancel`. No son componentes visuales propios y no se les puede dar el estilo de la app ni la animación solicitada con CSS. Hay que reemplazar esas llamadas por un componente propio, no intentar decorar el diálogo nativo.

Las validaciones y mensajes de resultado usan `toast(m)`: un único elemento `#toast`, clase `.toast`, sin distinción visual por severidad. En el código que coincide con lo publicado se oculta a los **1.800 ms**, usa una cápsula con `border-radius:999px`, `transition:.3s` y posición inferior. No tiene `role`/región viva declarada en su HTML. La app ya tiene una regla `prefers-reduced-motion`: conservarla y aplicarla a los nuevos avisos.

#### Pruebas ejecutadas en esta ronda

| ID | Recorrido y acción | Resultado verificado | Tema |
|---|---|---|---|
| C01 | Abrir un pedido → Eliminar → Cancelar | Confirmación nativa `¿Eliminar este pedido?`; el detalle y el pedido se conservan. | Oscuro |
| C02 | Clientes → ficha → Editar datos → Eliminar cliente → Cancelar | Confirmación nativa que avisa que los pedidos se conservan; sigue abierto el editor y el cliente no se elimina. | Oscuro |
| C03 | Inventario → Eliminar producto → Cancelar | Confirmación nativa; continúan los cinco productos de muestra. | Claro |
| C04 | Ajustes → Borrar todos los datos → Cancelar en el primer paso | Aparece `¿Seguro que quieres borrar TODO?`; se vuelve a Ajustes sin borrar. | Claro |
| C05 | Repetir Borrar todo → aceptar el primer paso → cancelar el segundo | Segundo cuadro nativo `Última confirmación: no se puede deshacer.`; cancelar conserva los datos. | Claro |
| C06 | Ajustes → Cerrar sesión → Cancelar | Confirmación nativa `¿Cerrar sesión?`; la sesión demo sigue abierta. No probé un cierre de sesión real. | Claro |
| C07 | Eliminar un pedido de muestra → aceptar | La hoja se cierra, la lista pasa de cinco a cuatro pedidos y el texto del aviso es `Pedido eliminado`. Recargué después para regenerar los cinco pedidos de la demo. | Claro |
| A01 | Nuevo cliente vacío → Guardar cliente | No se crea cliente ni se cierra el formulario; el aviso leído en la página es `Escribe el nombre`. | Claro |
| A02 | Nuevo pedido vacío → Guardar pedido | No se guarda; el aviso leído es `Escribe el nombre del cliente`. | Claro |
| A03 | Nuevo pedido con nombre de prueba, sin productos del inventario → Guardar | No se guarda; el aviso leído es `Elige productos del inventario`. | Claro |
| A04 | Mismo formulario → Escribir a mano, sin producto válido → Guardar | No se guarda; el aviso leído es `Agrega al menos un producto`. Se canceló después sin crear el pedido. | Claro |
| A05 | Nuevo producto sin nombre → Agregar al inventario | El formulario sigue abierto y no se agrega producto. El texto `Escribe el nombre del producto` se verificó en el código; no capturé ese aviso antes de que se ocultara. | Claro |

**Límites de estas pruebas:** los textos de A01–A04 y C07 se recuperaron con la lectura de la página después de disparar las acciones. Como el nodo del toast conserva el texto aun al ocultarse, esa lectura no demuestra por sí sola cuánto tiempo permaneció visible ni valida toda la animación. El tiempo de 1.800 ms y la transición de .3 s se comprobaron en el código publicado, no con medición audiovisual. No doy por aprobados foco, lector de pantalla, contraste de cada aviso o animaciones nuevas: todavía no existen y deben verificarse después de implementar.

#### Qué implementar: confirmación reutilizable

- Un componente modal propio, pequeño y coherente con la app: superficie de tarjeta, radio del sistema, overlay suave, título claro, explicación breve e icono SVG según la acción. Botones con verbos concretos (`Cancelar`, `Eliminar pedido`), no `OK`.
- Patrón compartido y asíncrono. **Atención de implementación:** un modal propio no devuelve inmediatamente el booleano de `confirm()`. Hay que esperar su resultado (`await` o callback) antes de ejecutar borrado/logout. No dejar que una promesa truthy haga pasar la condición de confirmación.
- Fondo de la página y hoja subyacente inertes mientras se confirma; orden de capas correcto por encima del detalle y del botón +. Bloquear scroll de fondo, sin perder el scroll del detalle.
- Foco inicial seguro en `Cancelar` en acciones destructivas; foco contenido en el diálogo; Esc cancela y devuelve el foco al disparador. Tocar el overlay, si se permite cerrar así, equivale a **cancelar**, nunca a aceptar.
- `role="alertdialog"` para destrucción o `dialog` según el caso, `aria-modal="true"`, título/descripción conectados y navegación completa por teclado. No dejar botones activos detrás ni abrir dos confirmaciones por doble toque.
- La aceptación ejecuta la acción una sola vez; durante una operación asíncrona, mostrar estado ocupado y bloquear duplicados. Un error no debe mostrar un éxito ni cerrar todo antes de tiempo.
- Texto normal con contraste mínimo 4,5:1; bordes/indicadores esenciales y foco con referencia de 3:1 respecto de su fondo. No comunicar peligro solo mediante rojo.
- Animación sugerida: opacidad y desplazamiento/escala mínima, unos 160–220 ms de entrada y salida, sin rebotes. Con `prefers-reduced-motion: reduce`, eliminar el movimiento perceptible. Evitar demoras que hagan parecer que el botón no respondió.

#### Textos y alcance por operación

| Operación | Contenido que debe quedar explícito |
|---|---|
| Eliminar pedido | Título `¿Eliminar este pedido?`; identificarlo dentro del diálogo de la app con datos mínimos útiles, explicar que se quita de los pedidos y ofrecer `Cancelar` / `Eliminar pedido`. No prometer que se puede deshacer si no existe esa función. |
| Eliminar producto | Aclarar que se elimina del inventario. Verificar y explicar qué pasa con pedidos existentes sin inventar una cascada de borrado. |
| Eliminar cliente | Mantener la advertencia actual: **sus pedidos se conservan**. No permitir que el nuevo estilo cambie esa regla. |
| Cerrar sesión | Título y botones `Cancelar` / `Cerrar sesión`, sin tratamiento rojo de borrado de datos. |
| Borrar todo | Mantener una protección al menos equivalente a los dos pasos actuales. Recomiendo conservar dos confirmaciones propias claramente diferenciadas, con explicación del alcance real y advertencia irreversible en la final. Revisar qué datos conserva el código actual antes de escribir `todo`: no prometer borrado de cuenta, usuarios o nube si eso no ocurre. |
| Importar respaldo | El flujo actual sustituye la base al leer el archivo y no pide confirmar. Recomiendo agregar una confirmación previa a reemplazar datos, con resumen del archivo y opción de cancelar. Es un refuerzo de seguridad de este flujo, no un comportamiento ya comprobado en navegador. No aplicar el archivo antes de aceptar. |
| Quitar cuenta del negocio | También usa confirmación nativa en el código. Incorporarla al componente compartido conservando permisos y efectos. No pude recorrer esta pantalla con la demo; requiere prueba con cuenta de ensayo autorizada, nunca con una cuenta real para una prueba destructiva. |

#### Qué implementar: avisos y validaciones

- Distinguir **éxito**, **información**, **advertencia** y **error** con un SVG pequeño, texto claro y color semántico moderado; no depender solo del color ni de emojis.
- Para campos inválidos, mostrar error junto al campo/grupo, asociarlo mediante `aria-describedby`, aplicar `aria-invalid` y llevar el foco al primer error. El toast puede reforzar, pero no ser la única explicación que desaparece. Conservar lo ya escrito.
- Éxitos breves: duración orientativa de 3–4 s. Errores/advertencias: al menos más tiempo de lectura o cierre manual; los errores del formulario deben permanecer junto al campo hasta corregirse. No esconder una explicación importante a los 1,8 s.
- Unificar redacción en español coherente con el tono de la app, breve y accionable. Evitar mensajes aislados como `No coinciden` sin identificar el campo cuando se compartan avisos.
- Región viva apropiada (`role="status"`/`aria-live="polite"` para resultados normales; alerta para errores que lo requieran), sin anuncios duplicados ni robo de foco para un éxito.
- Toast con ancho máximo relativo al viewport, texto multilínea, radio coherente para mensajes largos y espacio de seguridad respecto de menú, + y teclado. En una hoja abierta debe verse sobre ella, no esconderse ni tapar su acción principal o el campo inválido.
- Manejar el temporizador anterior o la cola: un aviso viejo no debe ocultar uno nuevo por un `setTimeout` pendiente. Probar errores repetidos y dos operaciones seguidas.
- Aplicar la misma animación tenue y el respeto por movimiento reducido que en el modal.

#### Barrido que Alba debe completar sobre la implementación

En `index.html`, buscar todas las llamadas a `confirm(`, `alert(` y `toast(`, no solo los tres botones de eliminar. El código actual también emite avisos para guardado de pedidos/productos/clientes, cuotas completas, prefijo, exportación/importación, archivo inválido, error de foto, desconexión, contraseña, activación, negocios, invitaciones y cuentas. En esta ronda no encontré llamadas a `alert()` en el archivo principal; no inventar una prueba de un aviso que hoy no existe.

**No ejecutado en navegador en esta ronda:** importación válida/inválida, exportación, archivo de foto corrupto, fallos de red, agotamiento de almacenamiento, cuotas hasta completar pago, alta/clave/invitaciones/cuentas/negocios, aceptación final de Borrar todo, aceptación de eliminación de cliente/producto y cierre de sesión efectivo. Están en el alcance de regresión del componente compartido; no marcarlos como OK basándose en esta revisión. Usar datos de ensayo y coordinar el QA funcional con Orion cuando corresponda.

---

### BV-13-04 · Contactos como sección destacada, pedidos y chat vacío

**Qué existe y qué falta**

La sección se llama hoy `Clientes`. Su listado muestra avatar con inicial, nombre, cantidad de pedidos/pendientes y teléfono. Al abrir `openClient()` **ya hay tarjetas de sus pedidos**, botón de WhatsApp y acción de nuevo pedido. Lo comprobé con una ficha de muestra que tiene dos pedidos. No corresponde informar que esta función falta por completo: la mejora pedida es destacarla y hacerla más directa y cuidada.

En el código actual, `#cli-wa` ya abre `https://wa.me/<numero>` **sin** parámetro `text`. El botón de WhatsApp de `openOrder()`, en cambio, sí construye un mensaje predeterminado. No unificar ambos comportamientos arrastrando ese texto a contactos.

**Qué implementar**

1. Mantener una entrada clara y fácil de reconocer en la navegación existente, con SVG de personas/contactos y título con jerarquía. Destacar la sección mediante composición, espacio y el color de sección ya previsto; no inventar una octava pestaña ni un segundo directorio duplicado. `Contactos` es el nombre usado por Nico en el pedido, no una orden expresa de renombrar todas las apariciones de `Clientes`.
2. En el listado, tarjetas de cliente con nombre protagonista, avatar/inicial o icono coherente, teléfono secundario y resumen legible de pedidos. Separar pendientes y total sin convertir todo en una lista de microbadges.
3. Agregar un acceso directo de WhatsApp reconocible en la tarjeta del cliente, además del acceso en su ficha; puede ser compacto con SVG y etiqueta accesible. Debe ser un control separado: pulsarlo no debe abrir también la ficha por propagación del click.
4. Al abrir la ficha, mostrar una cabecera de contacto clara y debajo `Pedidos` con tarjetas reutilizables: miniatura/placeholder, resumen de productos, total y estado. Si corresponde, fecha/cuotas sin saturar. Priorizar lo pendiente y separar lo pagado con criterio claro; nunca ocultar pedidos por hacerlo más prolijo.
5. Tocar una tarjeta abre **ese** pedido. Al volver desde su detalle, recuperar la ficha del contacto y su posición cuando sea posible; no mandarla arbitrariamente al inicio o a otra clienta. Mantener visible el cierre de cada capa y evitar acumular hojas sin control.
6. Conservar `Nuevo pedido` con el contacto precargado, sin obligar a reescribir nombre/teléfono. No cambiar las reglas de asociación de pedidos: distinguir contactos de nombre similar y no mezclar sus tarjetas.
7. WhatsApp desde listado o ficha: abrir el chat del número normalizado con el prefijo configurado, **sin mensaje predeterminado, sin parámetro `text`, sin rellenar saludo, productos ni total**. Solo redirigir: no enviar, automatizar, usar una API de mensajería ni solicitar credenciales.
8. Si falta teléfono, mostrar una indicación amable `Sin WhatsApp`/`Agregá un número` y acceso a editar los datos. No abrir una URL inválida ni aparentar un botón útil que no funciona. Si el número está incompleto/inválido, explicar qué corregir.
9. Mantener la distinción entre estados vacíos: sin contactos, contacto sin pedidos, y búsqueda sin coincidencias. Para un contacto sin pedidos, mensaje breve y acción `Nuevo pedido`; en búsquedas, no decir que no existen clientes en la base.
10. SVG coherentes para personas, WhatsApp, edición y estado vacío. No sustituir toda la ficha por iconos sin texto ni aplicar un rediseño general de la app.

**Cómo verificar**

- Contactos con 0, 1 y varios pedidos; pagados y pendientes; sin teléfono; nombres largos y nombres similares.
- En cada ficha se ven solamente los pedidos asociados a ese contacto, con importes y estados correctos. No duplicar un pedido por pertenecer a dos agrupaciones visuales.
- WhatsApp desde tarjeta y ficha abre el mismo destinatario y una conversación sin texto preparado. Volver desde la aplicación externa no debe borrar filtros o datos de la app.
- Botón de WhatsApp, tarjeta de cliente y tarjeta de pedido tienen acciones distintas, accesibles por teclado y sin eventos cruzados.
- Verificar lista extensa, scroll al regresar y todos los estados vacíos en claro/oscuro y móvil.

---

### BV-13-05 · Selección evidente de productos al editar

**Dónde está hoy**

El selector `Del inventario`, generado por `invHtml()` dentro de `openEditor()`, usa `.invpick button.on`. Hoy solo cambia el color del borde de **1,5 px** (`border-color:var(--acc)`). No tiene burbuja/check y el botón no expone `aria-pressed` en el HTML actual. En las capturas, el contorno no basta para reconocer de inmediato qué productos integran el pedido.

**Qué implementar**

- Mantener el sistema de tarjetas de producto. En selección, dar un borde/contorno de aproximadamente 2–3 px claramente perceptible y, si ayuda, un tinte muy suave de fondo. Elegir un color del sistema vigente que funcione en ambos temas; el azul de navegación es un candidato. No introducir un nuevo acento global ni extender el turquesa a todo por resolver este estado.
- Evitar que las tarjetas salten de tamaño al seleccionar: reservar el grosor del borde o usar un anillo interior/outline que no altere el layout.
- Agregar **burbuja circular en la esquina superior derecha** de cada producto seleccionado, con un SVG check. Tamaño visual orientativo 24–28 px, margen interior de unos 6–8 px y suficiente contraste. No colocar la burbuja por fuera de un contenedor que la recorte.
- La burbuja indica selección, no cantidad. Si se muestra cantidad en otro lugar, que no parezca que el check es un contador ni una X para borrar.
- Anclarla a la tarjeta/foto sin tapar nombre, precio o parte indispensable de la miniatura. Debe funcionar también en productos sin foto.
- En no seleccionados no mostrar un check que sugiera lo contrario. Al seleccionar/deseleccionar, el borde, el fondo y la burbuja se actualizan juntos; animación opcional muy corta, sin rebote ni movimiento de la grilla.
- Exponer el estado con `aria-pressed="true/false"` en los botones de selección y mantener foco visible. El SVG del check puede ser decorativo si el estado ya está anunciado. No crear un segundo botón diminuto dentro de otro botón: la tarjeta completa sigue siendo el control.
- Al abrir **Editar pedido**, marcar desde el primer render todos los productos que ya pertenecen al pedido. No depender de que la usuaria toque alguno para que aparezca el estado.
- Seleccionar y volver a quitar no debe duplicar líneas, perder cantidades/precios existentes o alterar el total incorrectamente. Cancelar no persiste ninguna selección nueva; guardar sí y reabrir refleja lo guardado.
- Si se comparte el selector entre alta y edición, aplicar el mismo patrón en ambos, evitando dos estilos de selección diferentes.

**Cómo verificar**

- Abrir un pedido con uno y con varios productos existentes: todos los seleccionados tienen borde y burbuja desde el inicio.
- Seleccionar/deseleccionar con mouse, toque y teclado; el total y el estado accesible cambian correctamente, sin saltos de tamaño.
- Cambiar entre `Del inventario` y `Escribir a mano`, volver, cancelar, guardar y reabrir: no perder ni inventar selecciones.
- Probar una tarjeta de nombre largo, sin foto y con foto muy clara/oscura; check visible con contraste suficiente en claro/oscuro.

---

### Ubicaciones de implementación en la base revisada

Son puntos de partida, no instrucciones para editar a ciegas si el archivo cambió:

- CSS de hoja y botones: `.sheet`, `.sheet-in`, `.big`, `.ghost`, `.hero`, `.wa`, `.toast` (aprox. líneas 167–234).
- CSS del selector: `.invpick` y `.invpick button.on` (aprox. líneas 306–312).
- Helpers: `toast()` (aprox. 412), `openSheet()`/`closeSheet()` (aprox. 455–457).
- Inventario y confirmación de eliminación: `renderInventory()` (aprox. 658–680).
- Listado/ficha de clientes y WhatsApp sin texto: `renderClients()`/`openClient()` (aprox. 744–805).
- Editor y estado de selección: `openEditor()`, `invHtml()`, `picked`/`drawInv()` (aprox. 870–1052).
- Detalle, hero, acciones y WhatsApp con mensaje actual: `openOrder()` (aprox. 1056–1117).
- Ajustes, respaldo y doble confirmación de borrado: aprox. 1166–1206.
- Nuevo cliente y validación: `openNewClient()` (aprox. 1217–1230).
- Otros avisos/confirmaciones de cuenta y negocio: aprox. 1490–1638.

### Matriz mínima para dar esta entrega por terminada

- [ ] Implementados los cinco puntos BV-13-01 a BV-13-05, sin cambiar datos de negocio o permisos por accidente.
- [ ] Recorridos en navegador en **ambos temas**, con capturas de detalle, confirmación, contacto con pedidos y selección activa.
- [ ] Escritorio y anchos 320/360/393 px; incluir altura baja 393 × 522 y zoom de texto al 200 %. No dar responsive por aprobado usando solo la captura de escritorio.
- [ ] Detalle con/sin foto y uno/varios productos; editar/eliminar sobre imagen o fallback, cierre independiente y accesible.
- [ ] Confirmaciones: aceptar, cancelar, Esc, overlay, doble toque, foco de entrada/salida, texto y capas. Eliminar solo tras aceptar y una sola vez.
- [ ] Doble protección de Borrar todo conservada; probar exclusivamente con datos descartables. No efectuar pruebas destructivas sobre clientas reales.
- [ ] Validación visible junto al campo y avisos de éxito/error sin recortes, superposiciones, anuncios duplicados ni temporizadores cruzados.
- [ ] Contactos con pedidos correctos y WhatsApp **sin texto predeterminado** desde listado/ficha. No enviar mensajes como prueba.
- [ ] Selección inicial, cambios, cancelar/guardar/reabrir, totales y cantidades correctos; borde + check con estado accesible.
- [ ] Contraste medido en los pares finales y prueba de movimiento reducido, no solo una impresión visual.
- [ ] Sin errores de consola en los recorridos modificados y sin duplicación de listeners al reabrir hojas. Si la herramienta de revisión no expone consola, dejar esa comprobación explícitamente pendiente, no inventar que pasó.
- [ ] Orion revalida las regresiones funcionales que afecten asociaciones, guardado, eliminación, respaldo y permisos; Bianca revisa la entrega visual implementada.

**Cierre de esta comunicación:** queda documentado lo pedido por Nico y las pruebas actuales. Esto no cierra el QA funcional general ni los pendientes históricos (por ejemplo B12); tampoco aprueba por adelantado una implementación que todavía no vi funcionando.

---

## 2026-11-13 · Bianca → Alba · Revisión de v23 / BV-13 implementado

**Veredicto: NO OK todavía.** Vi la entrega funcionando: hay mejoras claras, pero encontré regresiones en WhatsApp y confirmaciones, y pendientes de avisos/contactos. Esta entrada es posterior a la especificación anterior; sus resultados son los vigentes para la base revisada.

### Base, método y evidencia

- Pedido actual de Nico: revisar los cambios y mostrárselos al terminar.
- Commit local: **`b25482f`**, cache v23. El HTML público coincide byte a byte con el local; SHA-256 **`b76393d126ac5a2e8a601c337da9afd625ca7813896ab9acb1c15deccaa9371d`**.
- Revisé `?demo=1` en escritorio y en iframe de la misma demo a **320/360/393 × 600**, claro y oscuro, para selección y listado de contactos. También revisé ficha/lista a **393 × 522** y la confirmación de eliminar a 320 px en ambos temas. No es un teléfono físico.
- El snapshot no expone refs dentro del iframe. Usé un marco temporal y controles auxiliares para activar los botones reales de la demo y medir su geometría. Corregí el marco a `box-sizing:content-box` y comprobé `innerWidth=393` antes de generar las matrices finales. La primera medición del logo fue en un interior de 391 px; lo indico al citarla para no mezclar dimensiones.
- Foto: adjunté por el input real una **imagen sintética de QA**, la guardé en un producto de muestra y abrí su pedido. No usé fotos ni datos de una clienta real. Para acceder al input oculto, lo hice visible temporalmente en mi pestaña; no cambié el código publicado.
- Probé cancelar/aceptar la eliminación de un pedido de muestra. La aceptación deja cuatro pedidos, como corresponde. Recargué al terminar para regenerar los cinco pedidos y retirar la foto de ensayo. No completé Borrar todo, no envié WhatsApp ni operé datos reales.
- Evidencia preservada como adjuntos de **`task_611c67d04f724048`**: lámina `ropa-v23-revision-visual.png`, matrices de selección y contactos, validación con check verde y captura del segundo paso de borrado ausente. La lámina contiene recortes de capturas reales, con rótulos externos; no modifica la interfaz capturada.

### Estado de los cinco pedidos

| Pedido | Estado después de mirar la UI |
|---|---|
| BV-13-01 · WhatsApp SVG | El logo es reconocible y se ve bien en los accesos compactos del listado. **No aprobado en botones grandes:** queda sobredimensionado en detalle y ficha. Ver R23-01. |
| BV-13-02 · Acciones sobre imagen | **Ubicación y dibujo correctos** en foto de ensayo y placeholder; desaparecieron editar/eliminar del pie. La X existe, pero todavía hay scroll heredado y cierre no persistente. Ver R23-06. |
| BV-13-03 · Confirmaciones/avisos | El aspecto de la confirmación es más coherente y legible, incluido a 320 px. **No aprobado funcional/UX:** segundo paso oculto, foco inseguro y errores con apariencia de éxito. Ver R23-02 a R23-04. |
| BV-13-04 · Contactos | Nombre de sección y accesos compactos más claros; la ficha conserva tarjetas de sus pedidos. La URL generada desde el listado no lleva texto predeterminado. **Parcial:** el + sigue tapando la última tarjeta y el control Sin WA no hace nada. Ver R23-05. |
| BV-13-05 · Selección | **OK visual en la muestra probada:** borde y check visibles en los seis estados de la matriz, sin salto de tarjeta; selección inicial y `aria-pressed` correctos. No implica aprobar toda la persistencia del editor. |

### R23-01 · Alto · SVG de WhatsApp enorme en botones grandes

**Dónde:** `#waBtn` en `openOrder()` y `#cli-wa` en `openClient()`, ambos `.big.wa`.

**Qué vi:** al bajar en el detalle, el botón se convierte en un bloque muy alto con logo gigante y el texto apretado a la derecha. En la ficha de contacto consume gran parte de la hoja y empuja los pedidos hacia abajo. Se reproduce en claro y oscuro; la ficha a 393 × 522 lo evidencia especialmente.

**Medición:** en el marco inicial con interior de 391 × 598, `#waBtn svg` medía **180,77 × 180,77 px** y el botón **210,77 px de alto**, no los 20 px declarados en tu buzón. Después corregí el ancho del marco y el problema siguió visible a 393 px reales de viewport.

**Causa/punto de cambio:** hay límite de tamaño en `.cli-wa svg` para el botón compacto, pero no en `.wa svg` para los grandes; el SVG toma tamaño intrínseco y participa del flex.

**Corrección:** fijar explícitamente ancho/alto de 20–22 px y `flex-shrink:0` en el SVG del botón grande; preservar gap y rótulo legible. No achicar el texto para compensar el dibujo. Revisar detalle y ficha, tanto con como sin teléfono, en ambos temas.

**Aceptación:** el logo acompaña al texto en una sola fila cuando hay espacio; a ancho mínimo el botón puede crecer moderadamente, pero no crear un bloque de unos 200 px ni desplazar desproporcionadamente los pedidos.

### R23-02 · Alto / bloqueante del flujo · Segunda confirmación de Borrar todo se oculta

**Pasos reproducidos dos veces en escritorio:**

1. Demo → Ajustes → Borrar todos los datos.
2. En el primer modal propio, pulsar `Borrar todo`.
3. Esperar más de 180 ms: no queda visible la confirmación final.

**Evidencia exacta de la segunda reproducción:** `#cv-t` contiene `Última confirmación`, el botón dice `Sí, borrar todo`, `#cov` conserva la clase `open` pero su estilo computado es **`display:none`**. La página se queda sin el segundo diálogo visible; no acepté la confirmación final ni probé un borrado completo. No es evidencia de que se borre sin confirmar: es evidencia de que el paso final queda oculto/bloqueado.

**Causa en `askConfirm()`:** `done()` programa `cov.style.display="none"` a 180 ms y resuelve la promesa inmediatamente. El siguiente `await askConfirm(...)` reutiliza ese mismo `#cov` antes de que venza el timeout; el cierre del primer diálogo termina ocultando el segundo.

**Corrección:** resolver/encadenar la confirmación después de finalizar su salida, o cancelar/versionar el temporizador de cierre para que no pueda ocultar una instancia nueva. Proteger también doble activación y promesas pendientes. Mantener dos decisiones reales; no eliminar la segunda para esquivar el fallo.

**Aceptación:** primer paso visible → aceptar → segundo paso visible y operable durante todo el tiempo necesario; cancelar cualquiera conserva datos; aceptar el final opera una sola vez, solo con datos descartables. Reabrir otro modal tras cerrar uno tampoco hereda timers de una instancia anterior.

### R23-03 · Alto de interacción/accesibilidad · Foco destructivo y sin retorno

**Dónde:** helper `askConfirm()` compartido.

**Qué comprobé:**

- Al abrir eliminar pedido, `document.activeElement.id` era **`cv-yes`**, rótulo `Eliminar pedido`. Es el foco por defecto también para acciones destructivas; las llamadas revisadas no pasan `focusNo`.
- Cancelé el diálogo con su botón real y medí después: foco en **`BODY`**, en vez de volver a `#hDel`; el detalle seguía abierto y el modal estaba oculto.
- En el modal abierto, `main`, `sheet` y `nav` seguían con `inert=false`. El código maneja Escape, pero no contiene ciclo de Tab/foco ni aislamiento del fondo. No hice una travesía física completa con teclado/lector: esa parte requiere regresión específica, no la doy por aprobada por leer ARIA.

**Corrección:** foco inicial en Cancelar por defecto para destrucción, guardar/restaurar el disparador, fondo inerte y contención real de foco. Mantener Esc/overlay como cancelación y probarlos de forma real, también al encadenar la doble confirmación.

**Por qué importa:** un aspecto más lindo no debe dejar Enter preparado sobre la opción peligrosa ni perder el punto de navegación al cancelar.

### R23-04 · Medio · Validaciones se muestran con check verde de éxito

**Recorrido reproducido:** Inventario → + → guardar producto con nombre vacío.

**Qué vi y capturé:** la hoja no guarda, correctamente, pero aparece `Escribe el nombre del producto` con **SVG check verde**, como si fuera un éxito. No hay explicación persistente junto al campo ni foco dirigido al error.

**Causa:** `toast(m,type)` toma `ok` por defecto. Los llamadores de error actuales siguen invocando `toast("...")` sin `err`/`warn`; la búsqueda en el archivo no encontró usos efectivos de esos tipos en las llamadas. Crear estilos por severidad sin asignarlos a los errores no completa el cambio. En consecuencia estos errores también usan los **3 s** de éxito y no los 4,2 s de error.

**Corrección:** clasificar los llamadores (nombre/productos faltantes, archivo/foto inválidos, fallos de red, etc.); no invertir el default global sin revisar los éxitos. Mostrar validación junto al campo con `aria-invalid`/descripción, conservarla hasta corregir y enfocar el primer error. Mantener el temporizador único gestionado, que sí es una mejora del helper.

**Aceptación:** ningún rechazo de guardado parece un éxito; el error es visible y comprensible aunque se oculte el toast, y la corrección no borra otros valores.

### R23-05 · Medio · Contactos: + superpuesto y Sin WA inerte

**Dónde:** listado de contactos, confirmado en matrices de claro/oscuro a 320/360/393 × 600; revisado también a 393 × 522.

- El **+ tapa parte de la última tarjeta y su acceso circular**. A 393 × 600 oscuro, los rectángulos del FAB y del botón `Sin WA` se superponen en **1.232 px²**. Es continuidad del problema del FAB/B12, no algo resuelto por agregar más padding al final de la página: el control sigue flotando sobre una tarjeta mientras se recorre el listado.
- `Sin WA` parece un botón y su nombre accesible promete editar el contacto para agregar el número, pero al activarlo no abre ficha ni edición. Medí hoja cerrada antes y después. El handler siempre hace `stopPropagation()` y luego no hace nada cuando `c.tel` está vacío.

**Corrección:** asegurar que + no intercepte acciones/datos de la tarjeta (reubicar/reservar zona efectiva o ajustar el patrón vigente sin rediseñar todo). Para el teléfono faltante, abrir la ficha/editor apropiado o mostrar un estado realmente no interactivo y coherente; preferible una acción clara para agregarlo, como estaba especificado.

**Lo que sí comprobé del WhatsApp directo:** intercepté temporalmente `window.open` durante un toque de prueba, restaurándolo en `finally`: destino `wa.me`, ruta numérica, **sin parámetro `text`**, sin abrir también la ficha. No navegué a WhatsApp ni envié mensajes; esto valida la URL generada y la separación de eventos, no la entrega externa en un teléfono.

### R23-06 · Medio · Cierre superior no persistente y scroll heredado entre hojas

- `.dclose` es un bloque normal (`position:static`); al bajar a WhatsApp desaparece la X de la pantalla. Mide **40 × 40 px**, por debajo de los 44 px pedidos como área táctil. El `Cerrar` del pie sí queda solo, sin los botones peligrosos anteriores: esa separación es una mejora.
- Reproducción real en escritorio: editar producto → adjuntar imagen de prueba → guardar al pie → abrir su pedido. El detalle abrió con **`#sheet-in.scrollTop=465`**, arrancando abajo y dejando cabecera/foto/acciones fuera de vista. Lo medí antes de llevar manualmente el scroll a cero para inspeccionar la imagen.

**Corrección:** iniciar una hoja nueva en su posición inicial y conservar scroll solamente cuando se regresa/cancela una capa sobre el mismo contenido; hacer el cierre superior accesible al desplazarse, sin tapar el hero, con objetivo táctil adecuado. No resetear la hoja subyacente al cancelar una confirmación.

### Comprobaciones positivas y límites restantes

- Las acciones sobre la foto sintética y el placeholder son reconocibles, tienen nombres accesibles y área de 44 × 44; la papelera abre el modal del pedido correcto. El pie ya no mezcla editar/eliminar con cerrar.
- Selección de producto existente marcada desde el primer render. Alterné seleccionado/no seleccionado/seleccionado: `aria-pressed` true/false/true y total $1.400/$0/$1.400, con caja idéntica de **103,656 × 142,266 px** en el estado de 393 px. No guardé esos cambios de selección.
- Contraste calculado para el check de selección en claro: **5,11:1** (`rgb(10,31,61)` sobre `rgb(107,138,240)`). Icono compacto de WhatsApp en oscuro: **3,98:1** respecto de su fondo compuesto, supera la referencia de 3:1 para el dibujo. No presento estas dos mediciones como aprobación de todos los contrastes de la app.
- Confirmación: composición, texto y botones sin corte en 320 px, claro/oscuro. Las transiciones declaradas son leves (.18 s de modal, .28 s del toast, .15 s del check) y existe regla de movimiento reducido; no medí fps ni hice una prueba real con la preferencia del sistema activada.
- La ficha mantiene sus dos tarjetas de pedido de muestra, con estado y total, visibles al bajar. El logo gigante debe corregirse para no relegarlas innecesariamente.
- Pendientes de regresión funcional después de corregir: importación y su cancelación, respaldo inválido, borrado total final con base descartable, cuentas/permisos/clave, recorrido de foco por teclado y lector, zoom 200 %, teléfono físico/teclado virtual, consola y persistencia completa guardar/reabrir. No tuve una herramienta de consola en este recorrido y no afirmo que no hubo errores allí.

**Aviso a Alba:** esta revisión y sus seis puntos quedan referenciados en `Alba-Recibe.md`. La implementación corresponde a Alba; las regresiones funcionales amplias, a Orion. No modifiqué la app, no hice commit/push ni publiqué cambios. Los resultados históricos de la entrada anterior no deben confundirse con la aprobación de v23.

---

## 2026-11-13 · Corrección visual de v29 pedida por Nico

**Tarea:** `task_081ef3e96ee94aec`. **Resultado visual propio: OK para los cuatro puntos de esta tarea, en local; no publicado.** La revisión histórica de v23 no es el veredicto de esta ronda.

### Base y causas comprobadas

Cotejé la captura de Nico y abrí la demo publicada. El HTML de GitHub Pages y el del checkout `eaaaf40` coincidieron: SHA-256 `374df11bc08cfa549fb91cf6b3ea3550686518ed24aa6a58b3bfa4f9ccbfe379` (cache v29). Reproduje:

1. `openLightbox()` sólo creaba una imagen y cerraba tocando cualquier lugar; no existía botón de cierre.
2. Los estados usaban clases `yellow/orange/blue/green` de `STC`, pero el CSS esperaba `new/msg/due/paid`; terminaban sin fondo y con texto blanco. Además, los no activos tenían `opacity:.4`.
3. Las cuotas usaban texto azul pastel sobre fondo azul claro, sin contraste suficiente.
4. Las acciones flotantes y la tarjeta seleccionada compartían z-index 120, y la tarjeta se pintaba después. Además `.dcard.sel` tenía `transform:translateY(-2px)!important`, anulando el desplazamiento horizontal de JS.

### Cambios implementados (worktree aislado)

`/home/nico/Documents/GitHub/Ropa/.worktrees/fix-visual-v29`, rama `fix/visual-v29`, base `eaaaf40`, **commit local `66541f5`**. Sólo código `index.html` y cache `sw.js` → `ropa-v30`; worktree limpio después del commit. No se integró ni publicó.

- Foto ampliada: botón **× Cerrar** visible, objetivo de 44px, respetando safe areas; cierra con botón, Escape o fondo. La imagen no se cierra accidentalmente al tocarla. Diálogo con nombre accesible, foco contenido/restaurado y contenido subyacente inerte mientras está abierto.
- Estados: clases semánticas correctas, sin opacidad reducida, tintes de la paleta existente, cuatro botones de ≥44px en dos columnas, selección con check visible y `aria-pressed`. Corregí también el texto del estado En cuotas activo del editor a blanco sobre azul.
- Cuotas: texto azul oscuro sobre tinte suave en claro, texto claro en oscuro, borde visible, ≥44px y resumen `Pagó / N de N` con ancho propio.
- Acciones del pedido: retiré el duplicado flotante que se tapaba; **Editar, Eliminar y Cerrar quedan en una sola barra superior sticky**, con objetivos 44×44 y colores de icono aptos en ambos temas. Las tarjetas tienen contexto de apilado aislado: no cubren esa barra al hacer scroll. No cambié el apilado horizontal solicitado.
- Selección de tarjeta: eliminé el transform que la movía; se resalta exactamente en su lugar y pasa al frente. Segundo toque amplía sólo la foto. Adapté el offset a anchos pequeños/muchos productos para no producir anchos negativos ni overflow. Las tarjetas son botones con estado seleccionado accesible. Ya no hay referencias a `hEdit2/hDel2` que fallaban en el estado sin productos.

### Verificación propia (navegador real, datos demo/sintéticos)

- **320 / 360 / 393 × 800, y 1280 × 900; claro y oscuro:** sin overflow horizontal; tarjetas seleccionadas con la misma x/y antes/después; hit testing positivo de tarjeta y barra de acciones. Complemento 320×568 y seis productos con nombres largos/scroll; acciones siguen visibles y operables.
- **Texto de estados:** mínimo **4.90:1** (En cuotas activo); inactivos en claro **5.95 / 6.21 / 6.71 / 6.40:1** para Nuevo/Mensaje/En cuotas/Pagado, respectivamente. Activos claro **15.14 / 6.36 / 4.90 / 6.51:1**. Activos en oscuro usan los mismos colores salvo Nuevo (**14.12:1**); inactivos oscuro entre **8.63 y 10.18:1**. No es una auditoría de contraste de toda la app.
- **−/+ Cuota:** **6.53:1 claro / 9.52:1 oscuro**; iconos de Editar/Eliminar ≥ **4.48:1** en claro y ≥ **7.77:1** en oscuro. Objetivos de 44px o más.
- Probé cambiar los cuatro estados con sus controles reales; cuotas 1→0→1→2→Pagado (3); segundo toque/foto del pedido; foto desde inventario; Cerrar, Escape y fondo; Tab contenido y foco de vuelta a la tarjeta; editar abre; eliminar pide confirmación y cancelar conserva el pedido. Pedido sin productos muestra su vacío y permite editar, sin excepción.
- Sintaxis JS (`new Function` sobre scripts) y `git diff --check`: OK. **0 errores JS de página y 0 errores de consola en la pasada local**; quedan tres avisos preexistentes de Firebase/meta. La publicación había mostrado además un favicon 404, ajeno a esta corrección.
- HTML servido local cotejado con el archivo final: SHA-256 `da784fafd86832a3f7c0ced146bdbc83965df022c4ce316e30cdac0cb20b4e75`.
- **Revisión independiente de Orion cerrada (`review-visual-v29`): APPROVED en los flujos ejecutados, sin fallos reproducibles.** Confirmó cuotas hasta Pagado, los cuatro estados rápidos, editar con última tarjeta seleccionada y eliminar/cancelar/confirmar en ambos temas. Su sesión read-only impidió instrumentar el lightbox, medir móvil/contraste/geometría, consola, scroll forzado y vacío: eso queda **UNVERIFIED por Orion**, no por mí; mi pasada real de navegador de arriba sí lo cubrió. No presento mi cobertura como una segunda verificación independiente. Informe completo preservado en `capturas/2026-11-13/orion-v30-qa.md` e indexado. No necesito otra ronda ni una decisión del dueño para cerrar esta corrección local.

### Evidencia, entrega y límites

Capturas originales de navegador y lámina resumen en **`capturas/2026-11-13/bianca-v30-*.png`**, enlazadas individualmente en **`INDICE-CAPTURAS.md`**; antes publicado: `bianca-v29-antes-claro-393.png`. La lámina junta claro/oscuro y cierre de inventario; no es una nueva pantalla de la app.

No usé cuentas ni datos reales, no envié WhatsApp, no cambié reglas Firebase, no hice push/merge ni publiqué. Fotos de prueba SVG y pedidos de prueba viven sólo en la demo. **No verificado en teléfono físico**, safe areas reales, teclado virtual ni lector de pantalla completo. No cierro B12 ni la revisión general v24–v28 por esta tarea.

**Registro de comunicaciones y cierre:** pedí revisión única a Orion en su Recibe e incorporé su dictamen con sus límites. Entregué resultados, commit y evidencia a Alba en `Alba-Recibe.md`; el índice compartido creado por Nova incluye todas las capturas de esta ronda y el informe de Orion. **Preparación 4/5: corrección local lista para integrar cuando corresponda; no publicada.** Quedan fuera de esta entrega la integración/publicación, el teléfono físico y la auditoría integral. No hubo fallos reproducibles pendientes dentro de los cuatro puntos pedidos.

## 2026-11-14 · Auditoría visual total v32 (`77ac0f1`)

NO OK. Enviado a Alba (Alba-Recibe, misma fecha): 1) ícono gigante en Ajustes › Mi cuenta (falta `.sic`); 2) toast sobre Total/vacíos; 3) contrastes 2.24–3.73; 4) chips 26px; 5) lightbox sin dialog/foco; 6) menores (nav 320, filtros, favicon). v32 en sí OK (sin salto, confirmación, animaciones). Cobertura: 320/360/393/1280, claro/oscuro, 99 capturas; selección en `capturas/2026-11-14/`. Sin teléfono físico ni lector de pantalla. Recomendé portar `66541f5`.
- 2026-11-14 · Re-verificación v33 `26fcf3c`: OK visual, enviado a Alba.
