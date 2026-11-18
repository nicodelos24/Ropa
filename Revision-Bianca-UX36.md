# Ropa — revisión visual extensa UX36

**14/11/2026 · Bianca · Pedido de Nico 19:25 · Resultado: NO OK todavía.**

Revisión terminada sobre **`feat/ux-v34` `cd851c7f9892b441feff1538c75192f357deff38`**, worktree `.worktrees/ux-v34`. No modifiqué la app, no hice commit, integración, push ni publicación. Esta entrega propone correcciones; **no acredita recepción ni un plan aceptado por Alba**.

## 1. Resumen para Alba

1. **Primero, precios:** las tres variantes de validación defectuosa de Orion siguen siendo bloqueantes. Reproduje en Chrome el decimal sin mensaje y el texto inválido guardado a $0. No basta que la suite esté verde.
2. **Foto histórica: cierre parcial, no completo.** Ahora se respeta `item.photo` cuando ya existe; pero el flujo normal de seleccionar un producto con foto no copia esa foto al pedido. Borrar el producto vuelve a dejar al pedido sin imagen.
3. **Textos largos:** Pedidos/Historial mejoraron, pero el Detalle sigue desbordándose por el nombre de la clienta y por `.dname`. Comprobado en los seis cruces de ancho/tema.
4. **Teclado:** además del modal de hojas ya pendiente, las tarjetas de pedidos/contactos y los días del calendario no están en el orden de Tab ni tienen semántica de acción.
5. Conservar lo que sí funciona: selección fija, flechas + contador, confirmación de estado, animaciones rápidas, contraste de estados/cuotas/total y las correcciones de homónimos, borrador de foto y búsqueda completa.

## 2. Base, publicación y método

- HTML local y GET servido por `http://localhost:8776/`: SHA-256 **`0e12fd1405d5055e20cbf687a64c95f71f4b40a8e311ea2bf1a06b3ce53f1519`**. Caché preparada `ropa-v35`.
- Al comenzar esta ronda, el HTML público descargado tenía SHA-256 **`6f6ee28d063431c1425be370d9dc0acca49586f9423371dad01152917c6f0626`** y su `sw.js` declaraba **`ropa-v33`**. No es la versión local revisada. Una descarga HTTP no verifica actualización de una PWA instalada.
- Usé **Chrome real mediante MCP Kaia**, exclusivamente en demo y en contextos aislados. Para la matriz monté seis iframes de la app local sin cambiar el CSS de la app: **320×568, 393×740 y 1280×800**, claro/oscuro. Los datos adversos y las fotos son sintéticos.
- Hice además interacción en una pestaña de app independiente a **393×740**, con Tab/Escape reales, guardados descartables, compresión real de una imagen sintética en el navegador y borrado de un producto de prueba por la confirmación de la UI.
- **27 matrices fuente = 162 combinaciones de escena/ancho/tema**, más **8 capturas individuales**. Los 162 PNG derivados son recortes de esas matrices, **no 162 tests funcionales independientes**. Las seis láminas JPG y la lámina resumen también son derivados.

### Cobertura conservada en imágenes

| Grupo | Escenas | Cruces por escena |
|---|---|---|
| Vistas normales | Inicio, Agenda, Pedidos, Inventario, Contactos, Historial, Ajustes | 6 |
| Formularios/detalle | Nuevo producto, nuevo contacto, nuevo pedido, pie del nuevo pedido, editar pedido, detalle de muestra | 6 |
| Vacíos | Inicio, Agenda, Pedidos, Inventario, Contactos, Historial | 6 |
| Estrés | Detalle con nombre de clienta y productos sin espacios; detalle con sólo producto largo; fila con foto; seis productos; confirmación de estado; día vacío seleccionado; búsqueda producto 90; búsqueda sin coincidencias | 6 |

La pestaña independiente cubrió foco de hoja y Escape, error decimal, guardado inválido como cero, adjuntar/cancelar/guardar foto, foto de pedido antes/después de borrar catálogo, ficha de contacto y lightbox. No todos esos casos individuales tienen seis cruces.

## 3. Lo que sí queda comprobado

| Alcance | Resultado y límites |
|---|---|
| UX35-01 · Homónimos | Orion conserva ambas filas $100/$200, total $300, reapertura y nuevo guardado, desde ambos modos. No reabrir como el fallo anterior. |
| UX35-03 · Borrador de foto | Orion comprueba adjuntar/quitar, Cancelar/Guardar. En Chrome adjunté PNG sintético pasando por el compresor real: preview y Quitar aparecen, el original sigue sin foto antes de Guardar; Cancelar/reabrir conserva original vacío y Guardar persiste la imagen. Cámara/galería nativas no probadas. |
| UX35-04 · Foto propia preexistente | Orion comprueba que `item.photo` ya almacenado sobrevive borrar catálogo; representación corregida. El caso de creación desde catálogo sigue abierto, abajo. |
| UX35-06 · Inventario completo | Vi **90 botones**, busqué `090` y apareció Producto QA 090 en los seis cruces. Sin coincidencias conserva el buscador, no desborda y permite recuperación. Orion también comprueba selección/guardado. |
| UX35-07 · Historial | Orion comprueba día/mes/año y año histórico; no mantener vigente el antiguo “Hoy para otro mes”. |
| UX35-05 · Etiquetas | Los inputs probados por Orion resuelven a sus rótulos, salvo Categoría. No equivale a cerrar modalidad/foco ni a probar un lector. |
| Detalle con seis productos normales | En seis cruces: selección sin salto y navegación hasta **Producto 6 de 6**, sin desborde de la hoja. Conservar **flechas + contador**, no cambiarlos por puntos. |
| Contraste renderizado | En seis cruces, estados del detalle mínimo **4,57:1 claro / 8,42:1 oscuro**; −/+ Cuota **6,53:1 / 9,52:1**; Total **6,79:1 / 10,50:1**. El pendiente histórico de 2,63:1 de Cuota no aplica a esta base. No es aprobación global de todos los colores. |
| Lightbox independiente | `role=dialog`, `aria-modal=true`, fondo inerte, foco en X, Tab contenido y Escape cierra/libera fondo. El problema de hojas comunes no debe atribuirse al lightbox ya corregido. |
| Movimiento reducido | Emulé `prefers-reduced-motion: reduce`; las seis tarjetas de Inicio computan duración **0,00001 s**. No medí FPS ni probé la preferencia en un teléfono. |
| Layout ordinario | Las siete vistas, formularios normales y vacíos no presentan desborde horizontal en las matrices inspeccionadas. La excepción adversa del Detalle se detalla abajo. |

## 4. Correcciones que importan ahora

### UX36-01 · P1 · Validación monetaria incompleta: tres fallos distintos

**Dónde:** Pedido → Escribir a mano; parser compartido también en Inventario.

Son los hallazgos 1–3 de **[QA-Orion-UX35-cd851c7.md](QA-Orion-UX35-cd851c7.md)**; se amplía UX35-02, no se crean tres copias del ticket anterior.

| Caso | Resultado observado | Qué corregir / aceptación |
|---|---|---|
| Manual `1.200,50` (también `1200,50`, `12.50` en Orion) → Guardar | **`ReferenceError: d is not defined`**, `index.html:1380`; no se guarda, pero tampoco aparece `.ferr`. En Chrome el Total ya muestra $0. | Usar el documento correcto y la misma validación que inventario. Error persistente junto al precio, foco al campo y explicación explícita; ningún cambio de datos. No quedarse sólo con un borde rojo ni con el total cero. |
| Manual `abc` (también `-10`, `1e3` en Orion) → Guardar | Se crea el pedido con **`price:0`**, sin advertencia. Repetido en Chrome. | Diferenciar vacío, cero válido e inválido. `num==null` debe bloquear; no convertirlo en cero ni borrar la entrada inválida al alternar pestaña. |
| `1.2.3`, `12..00`, `12.3456`, `..` | Orion: 123, 1200, 123456 y 0, respectivamente, en ambos formularios. | Validar el formato completo antes de quitar separadores. Mismos criterios de Inventario/manual y mismo preview/guardado. Mantener $0 legítimo. |

**Mensaje propuesto si se conserva la regla de pesos enteros:** «Ingresá un precio válido en pesos enteros. Ej.: 1200 o 1.200». Si la regla de negocio cambia para admitir centavos, definirla con Nico; nunca concatenar dígitos silenciosamente. El error debe quedar debajo de la fila sin empujar cámara/quitar fuera de pantalla.

**Evidencia propia:** `decimal-sin-mensaje.png`, `invalido-cero.png`. Orion: suite **23/23 PASS**, check/whitespace OK; harness independiente **60 casos: 44 PASS / 16 FAIL**, agrupados en cuatro hallazgos. Los PASS de suite no cierran estos casos negativos.

### UX36-02 · P2 · La foto del pedido sigue dependiendo del catálogo al crear desde inventario

**Dónde:** Nuevo pedido → Del inventario → seleccionar producto con foto → Guardar.

**Reproducción en Chrome, 393×740:** adjunté imagen sintética a un producto, la guardé, creé un pedido eligiéndolo desde inventario y abrí el detalle. Se ve la imagen, pero **`order.items[0].photo` es null**; sólo existe en inventario. Borré ese producto desde la UI, acepté la confirmación y reabrí el mismo pedido: el pedido existe, el producto ya no, y **el detalle no tiene imagen**.

**Por qué importa:** la corrección de UX35-04 funciona cuando hay foto propia, pero el camino habitual no la genera. Un pedido histórico sigue cambiando de aspecto al editar/eliminar el catálogo.

**Propuesta:** al incorporar el producto, copiar su foto al borrador/item del pedido; después representar ese snapshot prioritariamente. No resolverlo ocultando Borrar ni cambiando fotos de pedidos históricos cuando cambia catálogo. Definir explícitamente si se reemplaza una foto del pedido al editarlo.

**Aceptación:** crear desde catálogo con foto → guardar/reabrir → renombrar, cambiar foto o borrar producto → miniatura, detalle y lightbox del pedido conservan su imagen. Los históricos sin snapshot siguen con fallback compatible. Añadir un test que empiece en selección de inventario, no sólo un fixture que ya traiga `item.photo`.

**Evidencia:** `foto-catalogo-antes.png`, `foto-catalogo-despues.png`. Extensión de UX35-04; no invalida el PASS del caso específico de Orion con foto propia ya guardada.

### UX36-03 · P2 · Detalle desbordado por nombres largos

**Dónde:** título de la clienta en Detalle y nombre del producto `.dname` dentro de `.dcard`.

Con nombres sin espacios de alrededor de 100 caracteres, **los seis cruces fallan**. Con nombre de clienta y producto largos, a 320 la hoja mide **290 px** de ancho útil y tiene **1240 px** de scroll horizontal; a 393, **363 → 1240 px**; en escritorio **560 → 1257 px**. La cabecera sola tiene 254/327/524 px de ancho frente a **1222 px** de contenido. Las columnas de nombres de producto se expanden a **900 px**. Al dejar el nombre de la clienta normal, el nombre del producto por sí solo sigue desbordando.

**Causa observada:** el wrap añadido a `.dcard h5` no alcanza al elemento real `.dname`; también falta contención del h2 y del hijo flexible de texto.

**Corrección acotada:** `min-width:0` en el contenedor de texto, wrap en los selectores reales y título, y revisar el alto de tarjeta para que envolver no superponga texto/precio. No esconder contenido útil ni romper selección fija/flechas. Es ampliación de UX35-08 a Detalle; no afirmo que sea una regresión nueva.

**Aceptación:** clienta larga sola, producto largo solo, ambos juntos y precio grande; seis productos, ambos temas/anchos. Sin desplazamiento horizontal de hoja/documento ni texto sobre acciones.

**Evidencia:** `longdetail-matriz.png`, `longproduct-detail-matriz.png` y recortes correspondientes.

### UX36-04 · P2 · Las acciones principales de los listados no se pueden alcanzar con Tab

**Dónde:** abrir pedido desde una tarjeta, abrir ficha de contacto y seleccionar día en Agenda.

En la pestaña independiente: **8 tarjetas de pedidos**, **5 de contactos** y los **30 días del mes** son `DIV`, `role=null`, `tabIndex=-1`, con `onclick`. Tras enfocar el último filtro de Pedidos y pulsar **Tab real**, el foco salta a **Inicio** de la navegación; omite todas las tarjetas. Los botones WhatsApp de contactos no sustituyen la acción de abrir su ficha.

**Propuesta:** usar acciones semánticas enfocables con nombre accesible y activación Enter/Espacio, sin convertir una tarjeta con botones hijos en botones anidados. En calendario, contemplar navegación por teclado y estado del día seleccionado. Conservar el aspecto y el área táctil actuales.

**Aceptación:** sólo con teclado se abre un pedido y una ficha, se elige un día y se vuelve al origen con foco visible. Probar después lector de pantalla. No confundir esto con el modal de hojas de UX34-08: son puntos de entrada del listado.

**Evidencia:** `keyboard-listas.yml` y mediciones/recorrido descritos. No atribuido como regresión nueva de cd851c7.

### UX35-05 residual · P2 · Categoría no tiene asociación válida

Orion verificó que `label for="inv-cat"` apunta a un id inexistente, aunque siguen presentes los nueve botones. Dar nombre al **grupo** mediante `fieldset/legend` o `role=group` + `aria-labelledby`; indicar selección y mantener teclado. No basta inventar un input con ese id. Los pares label/input que ya pasan se conservan. Evidencia funcional en el informe de Orion y visual en `newproduct-*-*.png`.

### UX36-05 · P3 · Feedback de foto en fila manual todavía poco explícito

El nuevo estado con tinte y `aria-label="Cambiar foto del producto 1"` existe; el botón Quitar aparece y la fila no desborda. **Es una mejora real sobre UX35-09.**

Para quien mira la pantalla, sigue sin verse cuál imagen está adjunta. Propongo miniatura pequeña o texto visible «Foto adjunta» y conservar Cambiar/Quitar. El nuevo Quitar foto mide **36×36** en los seis cruces, frente a **44×44** de Cámara: ampliar su área de toque a 44 sin alterar la grilla de inventario de tres columnas. Es la guía táctil del proyecto; no lo presento como incumplimiento del mínimo WCAG 2.2 de 24 px.

**Aceptación:** agregar/reemplazar/quitar muestra la imagen/estado correcto sin depender sólo del color y sin confundir Quitar foto con Quitar producto. Evidencia: `photo-row-matriz.png`.

## 5. Pendientes anteriores reobservados — actualizar, no duplicar

| Ticket existente | Qué vi ahora / prioridad | Corrección recomendada y evidencia nueva |
|---|---|---|
| **UX34-07** | **P2.** En Pedidos a 393×740, header sticky **272 px** y nav **61 px**; quedan 407 px antes de márgenes para el listado. | Dejar persistente cabecera principal+búsqueda; estadísticas/filtros acompañan scroll. Conservar pista de filtros. `orders-matriz.png`. |
| **UX34-08** | **P2.** Altas sin X superior; Total/Guardar al final. Nuevo contacto → Tab lleva a `themeBtn` del fondo; hoja sin role/aria-modal, fondo no inerte, Escape no cierra y body sigue con overflow visible. | Esqueleto de hoja común, foco inicial/contención/retorno, bloqueo de fondo, X 44px y pie de Pedido Total+Guardar con espacio reservado. Reusar el patrón correcto del lightbox/confirmación. `keyboard-background.png`, `neworder-matriz.png`, `neworder-bottom-matriz.png`. |
| **UX34-10** | **P2.** Inicio vacío sigue como seis ceros sin orientación; Pedidos dice «Sin pedidos aquí» y remite al +; Inventario/Contactos carecen de CTA propio. | Vacío real con siguiente paso explícito; búsqueda sin coincidencias con Limpiar/Ver todos. El nuevo selector de inventario sí conserva su buscador: no aplicar allí una falsa regresión. `empty-*-matriz.png`. |
| **UX34-11** | **P2.** Día vacío 17/11: alta está en **y=1122 / 1174 / 1304** para 320/393/1280, después de otras entregas; flechas mes **34×34**. | CTA inmediatamente bajo el día elegido; Hoy y flechas con área44px. Conservar fecha preset, que Orion comprueba. `agenda-selected-matriz.png`. |
| **UX34-13** | **P2.** Ficha sigue mostrando «Pendientes / Hechos» y el listado «pedido hecho» a partir de `paid`. | «Pendientes de pago / Pagados» para no equiparar cobro con entrega; Agregar teléfono explícito y campos opcionales identificados. `cliente-hechos.png`, `clients-matriz.png`, `newcontact-matriz.png`. |
| **UX34-14** | **P2.** Cambio a Pagado usa variante visual de peligro y botón genérico «Cambiar estado». | Variante neutral y «Marcar como pagado». Mantener confirmación y Cancelar, no eliminarlos. `stateconfirm-matriz.png`. |
| **UX34-06** | **P2.** Escritorio conserva main central y header/nav extendidos a todo el ancho. | Alinear contenido de cabecera/nav con la columna existente, sin ensanchar arbitrariamente la app. `principal-1280.jpg`. |
| **UX34-09** | **P3 residual.** Nombre/Precio ya están antes de Categoría y el rótulo ya dice Categoría: **avance real**, no repetir que ambos siguen debajo de las nueve categorías. Los botones de foto todavía encabezan el formulario. | Terminar el orden Nombre → Precio → Foto opcional → Categoría, sin rehacer formulario ni perder opciones. `newproduct-matriz.png`. |
| **UX34-16** | **P3.** Tres columnas correctas, pero precio y categoría siguen juntos y generan bloques de altura irregular. Tintes editar/borrar se ven. | Precio en línea propia, categoría secundaria y nombre hasta dos líneas. Conservar tres columnas y la excepción de densidad de inventario; no confundirla con Quitar foto manual. `inventory-matriz.png`. |
| **UX34-12/17** | **P3.** Inicio mantiene «Días con cosas en agenda»; Ajustes conserva grab de hoja, Cerrar sesión junto a cuenta al principio y mezcla de voseo/tuteo. Importes visibles usan coma de miles mientras entrada acepta punto. | «Días con entregas», jerarquía monetaria, copy rioplatense consistente, quitar grab de pantalla, separar Cerrar sesión y unificar convención monetaria visible/ejemplos. No cambiar alcance de borrado/nube por copy. `home-matriz.png`, `settings-matriz.png`, `history-matriz.png`. |

No doy por pendiente toda la familia SVG: en esta base ya se ven categorías/miniaturas SVG. El cierre completo de B12 requiere su propio inventario de usos; no lo cierro ni repito una observación histórica de emojis como si no hubiera avances.

## 6. Orden sugerido y puerta de salida

1. **Alba:** resolver UX36-01 (tres variantes) y añadir tests negativos de UI/handlers, no sólo parser aislado. Orion mantiene la validación funcional independiente.
2. Completar snapshot de foto de UX36-02, overflow UX36-03 y accesibilidad UX36-04/UX34-08; conservar todos los PASS de la sección 3.
3. Resolver claridad diaria UX34-07/10/11/13/14; luego terminación P3. UX35 no sustituye UX34.
4. Revalidar el commit exacto corregido. No hay aprobación para integrar/publicar por este informe ni pedido de implementar producto en esta sesión.

## 7. Evidencia y límites

Carpeta: **[capturas/2026-11-14/ux36-bianca/](capturas/2026-11-14/ux36-bianca/)**. [Lámina resumen](capturas/2026-11-14/ux36-bianca/bianca-ux36-resumen.png), `principal-320/393/1280.jpg`, `formularios-320/393/1280.jpg`, matrices `*-matriz.png`, recortes `*-ANCHO-TEMA.png` e individuales citadas. Índice general actualizado en `INDICE-CAPTURAS.md`.

**Consola:** la app independiente reproduce un error de aplicación esperado en el caso decimal (`d is not defined`). Los iframes instrumentados no registraron errores en los recorridos normales posteriores a su instrumentación. El primer montaje del contenedor de matriz produjo cinco errores `syncToastSpace` en la **página anfitriona alterada**, al haber retirado sus nodos; los corregí añadiendo nodos inertes y no los atribuí a la app revisada. La primera secuencia de formularios mezcló el historial conjunto de iframes: descarté/reemplacé esas matrices y volví a verificar `sheet.open` en los seis cuadros antes de conservarlas. En el fixture de matriz se suprimió el guard de historial al reiniciar escenas; **eso no es una prueba del botón Atrás**. La interacción individual se hizo sobre la app sin esa supresión.

**Infraestructura resuelta:** MCP no arrancaba por falta de `/home/nico/.cache/kaia-mcp-work`. Nova recreó la carpeta y comprobó 25 herramientas/Chrome; después ejecuté efectivamente esta revisión. No queda como bloqueo pendiente.

**UNVERIFIED:** teléfono físico, teclado virtual y safe areas reales, lector completo, zoom nativo 200%/pinch, cámara/selector de galería del dispositivo, cuentas/nube, envío WhatsApp, respaldo integral y actualización de caché instalada tras un despliegue. La compresión sintética real en Chrome y el compresor simulado de Orion no prueban cámara nativa. No usé datos de clientas reales.
