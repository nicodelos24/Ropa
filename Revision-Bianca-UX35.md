# Ropa — segunda auditoría extensa de Bianca

**14/11/2026 · Resultado: NO OK todavía.** Encontré **9 hallazgos recién detectados: 3 P1, 5 P2 y 1 P3**. No son un rediseño ni reemplazan el backlog UX34: se suman a él. Los tres P1 afectan importes o integridad del borrador. **Recién detectados no significa introducidos por v34:** Orion cotejó UX35-01/02/03/04 contra `4369565` y ya existían; en UX35-01 ahora también se descarta la segunda fila en el preview. No atribuirlos al último ajuste visual.

## Versión y cobertura

- Código revisado: rama `feat/ux-v34`, commit **`0bc1a40`**, worktree `.worktrees/ux-v34`. SHA-256 de `index.html`: `432b8f81c183eb3d5606e3c23f2ad8936e377d9e8383f8628cc4dce31806e957`.
- Ejecución: Chrome real mediante MCP, contexto aislado `bianca-extensa-14nov`, demo local `http://127.0.0.1:8774/?demo=1` (también `&audit=2` tras recargar).
- La publicación consultada seguía en **`ropa-v33`**, HTML SHA-256 `6f6ee28d063431c1425be370d9dc0acca49586f9423371dad01152917c6f0626`. **No atribuir al sitio público las mejoras locales de v34.** No hice despliegue ni comprobé una actualización de caché en un dispositivo instalado.
- **320 / 393 / 1280 × 800**, claro y oscuro: 42 escenas de las siete secciones; 30 escenas de cinco hojas, con captura superior e inferior; 36 escenas de base vacía; 24 escenas con textos largos. Total **132 combinaciones de escena**, no 132 tests de aceptación ni 132 recorridos funcionales completos.
- Hojas: producto con foto, alta de contacto, ficha de contacto, detalle de pedido de seis productos y edición del mismo. Fixtures sintéticos; no datos de personas reales.
- Pruebas dirigidas por controles reales: productos manuales repetidos, carga/cancelación/quitar foto de producto, precio decimal, selección de inventario, borrado de producto, Tab/Escape. Fixtures insertados por JS para fechas históricas, 65 productos, seis líneas y cadenas extremas; no equivalen a haber creado todos esos datos manualmente.
- No hubo errores JS en la matriz inicial; consola final sin errores. Advertencias de Firestore sobre configuración/deprecación; dos advertencias Canvas generadas por mi medición, no por la app.

## Lo que sí está bien

- **Cámara corregida en `0bc1a40`: OK visual.** Botón **44×44**, SVG **20×20**, opacidad **1**. A 393: contraste calculado aproximado **5,87:1 claro / 6,88:1 oscuro**, sobre el fondo compuesto observado. No conservar el viejo fallo de 2,31:1.
- Ninguna de las 42 escenas normales ni de las 30 hojas presentó desbordamiento horizontal. **El caso extremo de texto sin espacios sí falla**, detallado en UX35-08.
- Contador y flechas del detalle siguen siendo la solución adecuada: mantienen la cascada sin depender exclusivamente de tocar franjas pequeñas. Seis productos abren sin desbordar las hojas.
- Filtros/nav/estados/total medidos en esta pasada: texto claro mínimo observado entre esos selectores **≈4,66:1**; oscuro **≈4,90:1**. Medición aproximada con conversión de colores CSS modernos por Canvas y composición de fondos; descarté una primera rutina que interpretaba mal `color(srgb ...)`. No es una certificación integral WCAG.
- El + ya vive en la cabecera y la columna/nav de escritorio está alineada en la rama revisada. Por tanto, **no repetir UX34-02/06 como si siguieran sin implementar**. Los placeholders/categorías ya usan la familia SVG en las pantallas observadas; UX34-15 requiere reconciliar su alcance, no pedir de nuevo toda la conversión.

## Nuevos hallazgos para Alba

### UX35-01 · P1 · Se descartan líneas manuales con el mismo nombre

**Dónde:** Pedido → Escribir a mano; `openEditor()` / `orderItems()`.

**Reproducción:** agregar `Remera` a $100 y otra fila `Remera` a $200. Quedan **dos filas visibles**, pero el resumen dice **1 producto / $100**. Guardar crea un pedido con una sola línea de $100; la segunda desaparece sin aviso. Probado escribiendo y guardando por UI.

**Causa comprobada:** `orderItems()` aplica `seen` por nombre a todas las filas, incluso las manuales. No existe control visible para convertir las dos prendas en cantidad.

**Corrección propuesta:** identidad de fila independiente del nombre; no deduplicar silenciosamente las líneas manuales. Si se quiere agrupar, hacerlo explícito, conservando cantidad/importes/fotos y sin agrupar precios distintos. No volver a separar el cálculo del total y el guardado: la función compartida de UX34-01 es correcta.

**Aceptación:** dos filas $100/$200 → total $300 → guardar/reabrir mantiene ambas o una agrupación inequívoca con el mismo total. Cubrir además espacios/mayúsculas y pedido mixto con nombre coincidente.

**Evidencia:** `extensa-bianca/duplicate-manual.png`.

### UX35-02 · P1 · Un precio decimal se convierte en otro importe

**Dónde:** Inventario → Nuevo producto → Precio; revisar también `.pp` del pedido manual.

**Reproducción:** escribir **`1.200,50`** y guardar: queda **`120050`**, mostrado como **$120,050**, con aviso de éxito. Probado dos veces por UI. El parser elimina todos los caracteres no numéricos (`replace(/\D/g, "")`).

**Corrección propuesta:** un parser monetario regional compartido y validación antes de guardar. Si el negocio sólo permite enteros, indicarlo y rechazar decimales con error junto al campo; no reinterpretarlos silenciosamente. No decidir aquí una nueva política comercial sobre centavos.

**Aceptación:** `1200`, `1.200`, `1200,50`, `1.200,50`, `12.50` e inválidos deben tener resultado definido y visible; nunca guardarse un importe 100 veces mayor al escrito. Preservar precio $0.

**Evidencia:** `extensa-bianca/decimal-price.png` (resultado filtrado).

### UX35-03 · P1 · Cancelar la edición no revierte los cambios de foto

**Dónde:** Inventario → Editar producto → Galería / Quitar / Cancelar.

**Reproducción:** abrir un producto existente sin foto, adjuntar una imagen sintética y Cancelar: `db.inventory[0].photo` pasa de ausente a presente y **sigue presente después de cancelar**. Reabrir, Quitar y Cancelar: la foto queda ausente. Comprobado mediante UI y lectura del objeto antes/después.

**Causa:** `openInvEditor(it)` edita el mismo objeto del inventario; `updPrev()` y Quitar mutan `it.photo` antes de Guardar. La cancelación no restaura el original. Esto prueba una mutación de sesión; no afirmo haber verificado persistencia de nube o recarga de esos cambios cancelados.

**Corrección propuesta:** trabajar sobre un borrador/clon independiente (incluida foto); aplicar al inventario sólo tras validar y Guardar. Las salidas deben descartar el borrador o pasar por la protección común de cambios de UX34-08.

**Aceptación:** agregar/reemplazar/quitar foto → Cancelar/fondo/volver según la política de salida → producto original intacto; Guardar sí aplica. Marcar dirty también al quitar foto y cambiar categoría.

**Evidencia:** `extensa-bianca/photo-added-remove-hidden.png`, más valores registrados en las herramientas de este chat. Regresión independiente de datos solicitada a Orion.

### UX35-04 · P2 · La foto de un pedido depende del inventario actual

**Dónde:** Detalle de pedido; mapeo de `items` en `openOrder()`.

**Reproducción:** fixture con foto en el artículo del pedido y en su producto de inventario; abrir detalle → se muestra `IMG`. Borrar el producto por su botón y aceptar el aviso **«Los pedidos ya guardados no cambian»**. Reabrir el pedido → placeholder `DIV`, aunque **`items[0].photo` conserva la imagen**.

**Causa:** el detalle usa únicamente `inv && inv.photo` e ignora `i.photo`. Un cambio o borrado del catálogo altera el aspecto del pedido histórico.

**Corrección propuesta:** usar primero la foto del artículo guardado, con fallback al inventario para datos históricos sin snapshot; confirmar con Alba/Orion la política de snapshot al crear pedidos desde inventario. Aplicar el mismo criterio a miniaturas y lightbox. No prometer que el pedido no cambia si depende de datos vivos del catálogo.

**Aceptación:** el pedido con foto propia conserva esa imagen tras borrar/renombrar/reemplazar el producto; los pedidos antiguos sin snapshot siguen abriendo sin crash.

**Evidencia:** `extensa-bianca/photo-order-before.png`, `photo-order-after.png`. La captura final después de esperar la animación muestra la ausencia; el fixture se reconstruyó después para obtener una imagen estable.

### UX35-05 · P2 · Los rótulos de formularios no están asociados a sus campos

**Dónde:** alta/edición de producto, pedido y contacto.

**Comprobación:** los campos visibles `inv-name`, `inv-price`, `nc-name`, `nc-tel`, `nc-notas`, `f-cliente`, `f-tel`, `f-cuotas`, `f-fecha`, `f-notas` tienen **`labels.length === 0`**, sin `aria-label` propio. Las filas `.pn/.pp` tampoco tienen etiqueta persistente. El texto se ve, pero el `<label>` no tiene `for` ni envuelve el input; el placeholder no reemplaza esa asociación.

**Corrección propuesta:** `for` + `id` único en todos los campos, incluido Precio de venta ($). Para filas dinámicas, Nombre del producto N / Precio del producto N (visible o sr-only), y `aria-describedby` para ayuda/errores; no borrar las etiquetas al escribir.

**Aceptación:** cada control obtiene su nombre del rótulo correspondiente y al tocar Nombre se enfoca el campo. Comprobar con snapshot accesible y luego lector de pantalla, que no fue probado aquí.

**Extensión de UX34-08, no otro ticket nuevo:** al abrir Nuevo contacto desde el +, el foco queda en `fab`; el primer Tab va a `themeBtn` del fondo. Hoja sin `role=dialog`/`aria-modal`, fondo no inerte, Escape no cierra. Incorporar foco inicial, contención y retorno al esqueleto modal ya pendiente, con protección de cambios. Evidencia: `keyboard-focus-background.png`.

### UX35-06 · P2 · El selector oculta silenciosamente productos desde el número 61

**Dónde:** Nuevo pedido → Del inventario; `db.inventory.slice(0,60)`.

**Reproducción:** fixture de 65 productos numerados: sólo aparecen **60**, el último es Producto 60. No hay buscador ni paginación dentro de la hoja. Producto 61–65 existe en Inventario pero no se puede seleccionar desde esa pestaña.

**Corrección propuesta:** búsqueda en el conjunto completo y paginación/carga progresiva con indicador; no resolverlo sólo aumentando otro límite fijo. Mantener selección al buscar y cambiar de página.

**Aceptación:** encontrar y seleccionar Producto 65, alternar con manual y guardar sin perder selección/total.

**Evidencia:** `extensa-bianca/inventory-60-limit.png`.

### UX35-07 · P2 · Historial llama «Hoy» al mismo día de otro mes

**Dónde:** `renderHistory()`; compara sólo `getDate()`.

**Reproducción:** el 14/11/2026, un movimiento sintético del **14/10/2026 10:00** aparece como **Hoy 10:00**. No es un problema de zona horaria: difieren mes y fecha completa.

**Corrección propuesta:** comparar día/mes/año locales o la misma clave de fecha local; incluir año cuando no sea el actual. Mantener orden cronológico por timestamp.

**Aceptación:** hoy sí dice Hoy; mismo día de mes anterior/año anterior no; validar cruce de medianoche local.

**Evidencia:** `extensa-bianca/history-wrong-today.png`.

### UX35-08 · P2 · Cadenas sin espacios desbordan Pedidos e Historial

**Dónde:** descripciones de productos en el listado de Pedidos y detalles de movimientos de Historial.

**Reproducción:** nombre sintético `ProductoSinEspacios` repetido ocho veces; detalle histórico sin espacios repetido diez. El texto sale de la tarjeta y la raíz obtiene `scrollWidth > innerWidth` en **los tres anchos y ambos temas**. Los nombres largos con espacios usados en esta pasada no produjeron ese mismo desborde. Inventario y Contactos no fallaron horizontalmente con el fixture.

**Corrección propuesta:** `min-width:0` donde corresponda y `overflow-wrap:anywhere` en texto libre; no ocultar el problema con `overflow-x:hidden` global. Si hay truncado, conservar acceso al contenido completo en detalle. Revisar también notas y nombres importados.

**Aceptación:** referencias/nombres largos sin espacios se parten dentro de su tarjeta; no aumentan el ancho de documento ni empujan acciones/importes fuera de su zona.

**Evidencia:** `extensa-bianca/long-orders-light-320.png`, `long-history-dark-393.png`; matriz completa `long-*`.

### UX35-09 · P3 · Feedback incompleto después de adjuntar una foto

**Dónde:** producto y filas manuales del pedido.

- Producto inicialmente sin foto: al adjuntar aparece la previsualización, pero **Quitar sigue con `display:none`**. `updPrev()` no actualiza ese botón. Hay que reabrir el editor para que aparezca.
- Pedido con foto ya guardada: la fila manual mantiene sólo la misma cámara y el nombre **Agregar foto al producto**; no muestra miniatura, indicador de foto adjunta ni una acción para quitarla. La corrección de contraste está bien, pero no comunica si la foto quedó incorporada.

**Corrección propuesta:** mostrar Quitar cuando el borrador tiene foto; en fila manual, miniatura/indicador + nombre contextual Cambiar foto + Quitar foto. No achicar el área táctil de 44px ni volver a comprimir el nombre.

**Aceptación:** después de cargar se reconoce visual y accesiblemente que hay una foto; se puede cambiar/quitar antes de guardar; cancelar sigue el borrador independiente de UX35-03.

**Evidencia:** `photo-added-remove-hidden.png`, `manual-photo-no-feedback.png`; template `drawMan()`.

## Backlog anterior: qué no duplicar

Siguen siendo relevantes las mejoras UX34 de cabecera demasiado alta, esqueleto de hojas/cierre/scroll, esenciales de producto antes de categorías, vacíos con CTA y limpieza de filtros, alta junto al día en Agenda, copy de Inicio/Contactos, confirmación neutral, jerarquía de tarjeta de Inventario y microcopy regional. Esta ronda **no declara cerrado el backlog UX34 completo**. Tampoco reabre el antiguo fallo visual de cámara ni el ancho mínimo de cuatro tarjetas, ya corregidos localmente.

## Entrega y límites

- Informe y evidencia entregados a Alba; constancia en el informe `Revision-Bianca-UX35.md` (buzones retirados 17-11).
- **Orion terminó el contraste independiente de UX35-01/02/03/04: NEEDS WORK**, los cuatro casos confirmados con handlers reales y JSON local en jsdom. Suite existente **16/16 PASS**; regresión focal **3 PASS / 5 FAIL** (dos variantes de foto Cancelar); sintaxis/diff OK. Comprobó además que un `save()` posterior persiste el cambio de foto cancelado. No es una segunda prueba visual ni de nube; adjuntar usa compresor simulado. Informe: [`QA-Orion-UX35.md`](QA-Orion-UX35.md). Harness y salidas focal/baseline preservados también en la carpeta de evidencia compartida.
- **Sin cambios de código de la app, commit, merge, push ni publicación.** Sólo documentación y evidencia compartida. El worktree revisado se mantuvo limpio al comprobarlo.
- No probé teléfono físico, teclado virtual/safe areas, lector completo, login/cuentas reales, reglas/nube, envío de WhatsApp, importación/exportación integral ni borrado total. No confundir fixtures de demo con persistencia real. La carga por selector de archivos de una prueba encontró una restricción de raíces del MCP: cancelé el diálogo; no amplié permisos ni sorteé esa restricción. La primera carga por `setInputFiles` y su cancelación sí se ejecutaron, con valores registrados.
- Evidencia completa: [`capturas/2026-11-14/extensa-bianca/`](capturas/2026-11-14/extensa-bianca/). Los archivos `sheet-*` incluyen extremos superior/inferior; `empty-*`, estados sin datos; `long-*`, pruebas extremas. Capturas sólo con datos sintéticos.
