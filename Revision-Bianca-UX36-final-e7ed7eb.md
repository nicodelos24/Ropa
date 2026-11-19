# Ropa — revisión visual final UX36 · HEAD `e7ed7eb`

**19/11/2026 · Bianca · Veredicto visual: OK** para el alcance pedido en esta ronda.

## Base y método

- Rama `feat/ux-v34`, worktree `.worktrees/ux-v34`, HEAD **`e7ed7eb`** (no el `cd851c7` ya revisado con NO OK). `git status --short` limpio antes y después; `index.html` SHA-256 **`b431772056f49d971d79ee18cecff400dd1c26b3daced98e102c3bf0b395b959`**, servido por `http://127.0.0.1:8901/?demo=1` con el mismo hash verificado por HTTP.
- Chrome real del proyecto **`kaia_chrome_ropa`**, contexto aislado `bianca-ux36-final-19nov`, pestaña exclusiva. Viewports **320×568, 393×740 y 1280×800**, claro y oscuro. Datos sintéticos de demo; imagenagregada de prueba, sin datos de clientas reales. Sin `Aplicacion-ropa`.
- Consola: **0 errores**, 2 warnings de Firestore (configuración/deprecación), presentes desde la carga. No son fallos de esta ronda.
- No modifiqué código de la app ni hice commit, merge, push ni publicación.

## Verificación de los puntos pedidos

| Punto | Resultado en Chrome | Evidencia |
|---|---|---|
| Botones de estado `Nuevo` / `Mensaje enviado` visibles | **OK.** En Inicio, los tres pedicios pendientes muestran sus badges; en Pedidos los filtros `Nuevo` y `Mensaje enviado` filtran a Rosita y Paco; en el detalle, los cuatro botones de estado miden **174×44** y están visibles sin superposición (393 clear). | `inicio-claro-393-final.png`, `pedidos-nuevo-393.png`, `pedidos-mensaje-enviado-393.png`, `detalle-pedido-claro-393.png` |
| Tarjetas de productos no superpuestas en horizontal | **OK.** Inventario a 393: tres columnas con rectás x=15/140/265, ancho 113, sin solapamiento; `document.scrollWidth === innerWidth`. Con nombre largo (2 líneas) la altura de la tarjeta crece, pero no se pisa con la vecina. En las seis tarjetas de Inicio tampoco hay solapamiento de rectás. | `inventario-claro-393-con-qa.png`, `editor-pedido-6filas-largas-claro-393.png`, `inicio-claro-393-final.png` |
| Editar / borrar no ocultos | **OK.** En el detalle, `Editar pedido`, `Eliminar pedido` y `Cerrar detalle` son botones **44×44** en y=196; nada se los tapa. Editar abre el formulario real y Eliminar conserva su confirmación (no la probé en esta pasada; la tuve por verificada en QA de Orion sobre esta base). | `detalle-pedido-claro-393.png`, `detalle-pedido-oscuro-393.png` |
| Alta de producto Nombre → Precio → Foto → Categoría | **OK.** Orden medido en el DOM: `Nombre` (y=158) → `Precio de venta ($)` (y=237) → botones Tomar foto/Galería (y=314) → `Categoría` y sus nueve opciones (y=371). Rótulos `for` resuelven a `#inv-name` y `#inv-price`. La leyenda Categoría sigue siendo un `span` sin asociación al grupo (P3 conocido, no bloqueante para este veredicto visual). | `alta-producto-claro-393.png` |
| Pie sticky Total + Guardar en el editor de pedido | **OK.** `.edfoot` queda fijo en y=493–716 con 6 filas y con scroll al fondo (`scrollTop=353/353`), `Guardar cambios` en y=594 (48 px de alto) y `Total $1.200` visible. Se mantiene visible también con nombres largos; no cubre la última fila de forma permanente porque el contenido scrollea por encima. | `editor-pedido-pie-claro-393.png`, `editor-pedido-pie-scrolled-claro-393.png`, `editor-pedido-6filas-pie-claro-393.png` |
| Copy de Inicio en voseo | **OK** en los textos visibles de Inicio: «Días con entregas», «Próximos en agenda», «Pendientes de cobro», «Ver todos los pedidos». Sin hallazgos de tuteo en el texto de Inicio. El resto del voseo pedido (Ajustes, Agenda, altas) también se ve corregido: «Cambiá», «Tocá», «Agregá», «Usá», «abrí», «Exportá». | `inicio-claro-393-final.png`, `inicio-claro-320.png`, `agenda-claro-393.png` |
| Precios = pesos enteros, sin decimales | **OK, sin cambio pedido.** Decimal `1.200,50` en Alta de producto y en fila manual del pedido: se rechaza con mensaje visible «Ingresá un precio válido en pesos enteros. Ej.: 1200 o 1.200», `aria-invalid=true`, sin guardar y sin error JS. También rechaza `abc` e `1.2.3`. `1.200` se guarda como **$1,200**. No pido cambio en el parser; respeta la decisión de Nico del 19-11. | `alta-producto-error-decimal-claro-393.png`, `editor-pedido-error-decimal-claro-393.png`, `inventario-claro-393-con-qa.png` |

## Comprobaciones de apoyo

- **Estados de hojas:** `role=dialog`, `aria-modal=true`, `body.overflow=hidden` mientras está abierta; Escape cierra y restaura `body.overflow=visible`. Las tarjetas de pedidos son `DIV role=button tabindex=0`, accesibles por teclado.
- **Vacíos:** búsqueda sin resultados en Pedidos e Inventario muestra el mensaje y «Limpiar búsqueda», sin desborde; al limpiar vuelven los listados.
- **Agenda:** flechas y «Hoy» de **44×44**; «+ Agregar entrega este día» visible a y=586 en 393×740.
- **Escritorio:** contenido alineado en una columna central de 560 px (x=352.5–912.5); sin desborde horizontal.
- **Contraste:** medición no instrumentada en esta pasada; me baso en la medición previa de esta rama (`Revision-Bianca-UX36.md`, sección 3) y en la inspección visual de claro/oscuro. No certifico WCAG integral.

## Límites

No probé teléfono físico, teclado virtual, safe areas reales, lector de pantalla completo ni cámara/galería nativas. No verifiqué nube, cuentas reales, WhatsApp, respaldo integral ni la versión publicada: revisé el HEAD local indicado, sirviendo el HTML con el hash citado. La decisión de integrar/publicar no sale de este informe.

## Evidencia

22 capturas en [`capturas/2026-11-19/bianca-ux36-final/`](capturas/2026-11-19/bianca-ux36-final/), enlazadas desde [`INDICE-CAPTURAS.md`](INDICE-CAPTURAS.md). El informe anterior `Revision-Bianca-UX36.md` queda como constancia del NO OK sobre `cd851c7`; este no lo reemplaza ni borra.
