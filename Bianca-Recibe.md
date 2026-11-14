# Bianca — Recibe

## 2026-11-13 · Orion → Bianca · revisión única de 66541f5

**Approved en lo comprobado; sin fallas detectadas del alcance.** Informe independiente en `QA-Orion-v30.md`. Demo/archivo idénticos; diff y sintaxis OK; 15/15 tests Node+jsdom; contraste CSS mínimo estados 4,90:1 y cuotas 6,53/9,51:1. En navegador oscuro 1265×722: estados, botones de cuotas, editar/guardar/reabrir tres productos con total correcto, barra de acciones visible. **UNVERIFIED independiente** móvil/claro, sticky con scroll, foto/teclado/borrado en navegador: la automatización no recibió autorización a tiempo y luego APX falló con `browser.tabs timed out` incluso en handoff. No confundir jsdom con renderizado ni tus capturas con repetición mía. Sin cambios de código, datos reales ni publicación; una pasada, sin pedir otra ronda. No cerré la tarea ni la revisión general/B12.


## 2026-11-13 · Alba

Ronda visual para revisar (v22, demo `?demo=1`):
1. Chips de filtro activos en azul pastel (tinte 18%, texto navon) en claro y oscuro.
2. Detalle del pedido nuevo: hero foto 4:3, tarjetas apiladas con precio destacado.
Tus pendientes B12 sigue abierto. Escribime hallazgos en Bianca-Emite.md.

## 2026-11-13 · Alba → Bianca

Implementé tu ronda BV-13 (v23, demo `?demo=1`):
- **BV-13-01** logo WhatsApp SVG (relleno, 20px) en detalle, ficha y tarjetas de contacto. Sin emoji 💬.
- **BV-13-02** editar (lápiz) y eliminar (papelera) sobre la foto/placeholder en la esquina sup. derecha, 44×44, vidrio oscuro; quité los dos botones del pie; X de cierre arriba (`aria-label="Cerrar detalle"`); la papelera abre la confirmación propia.
- **BV-13-03** componente propio `askConfirm()` (alertdialog, foco en botón, Esc/overlay = cancelar, ~180ms) reemplaza los 6 `confirm()` nativos, incluida doble protección de Borrar todo y confirmación nueva para Importar respaldo (con resumen del archivo). Toasts con severidad (ok/err/warn), ícono SVG, role=status, 3s/4.2s, temporizador gestionado.
- **BV-13-04** sección "Contactos" (nav renombrado), botón WhatsApp circular por tarjeta con stopPropagation, "Sin WA" punteado si no hay teléfono; ficha mantiene chat sin texto predeterminado y tarjetas de pedidos.
- **BV-13-05** selección: borde azul (navon) + anillo interior sin salto de layout + burbuja check 24px arriba a la derecha + aria-pressed, en alta y edición.
Verificada en demo (cancelar/aceptar eliminación, contactos 3 WA + 1 sin, checks on/off). Te toca la revisión visual: pasadas claro/oscuro y 320/360/393 según tu matriz. Escribí hallazgos en Bianca-Emite.md.

## 2026-11-13 · Alba → Bianca

Corregí los seis puntos R23 (v24, demo `?demo=1`):
- **R23-01** `.big.wa svg` fijado a 21×21 con flex-shrink:0 (verificado: 21px, botón 51px, antes 180px).
- **R23-02** `askConfirm()` versionado: el temporizador de cierre del primer diálogo ya no oculta al segundo (probado: 2° paso de Borrar todo visible y operable, foco en Cancelar).
- **R23-03** foco inicial en Cancelar para acciones destructivas (opci­ón `focusNo` para no destructivas), foco restaurado al disparador, fondo inerte (main/sheet/nav) durante el diálogo, trampa de Tab dentro del modal.
- **R23-04** errores inline junto al campo (`fieldErr`: texto naranja + icono + aria-invalid + foco, se limpia al escribir) en nombre de producto/cliente/pedido; toasts de error clasificados err/warn (foto, archivo inválido, contraseñas, sin conexión, etc.); éxitos siguen en ok.
- **R23-05** "Sin WA" ahora abre la ficha → editor del contacto para agregar el teléfono (aria-label actualizado); en Contactos el main reserva 230px al pie para que el + no pise la última tarjeta.
- **R23-06** `openSheet()` resetea scrollTop (hoja nueva siempre arriba); X de cierre sticky (sigue visible al bajar) y de 44px.
Tomá la ronda desde `b25482f`+1. Te toca la revisión visual de esta iteración. Pendiente tuyo/Orion: teclado+lector y zoom 200% siguen sin probarse en navegador.

## 2026-11-13 · Alba → Bianca · pedido directo de Nico (v25)

- **Inventario en cuadrícula 3×** de tarjetas cuadradas (más denso); editar/eliminar ahora son iconos SVG (lápiz/papelera, 36px, vidrio) sobre la imagen con aria-label. Nota: 36px < los 44px de tu guía — deliberado por densidad; si lo ves mal en táctil, decime.
- **Contactos**: cada tarjeta muestra puntos de color por estado de sus pedidos (verde/orange/azul/amarillo, hasta 8, con title); ficha: tarjetas de pedidos con borde de color por estado + fecha compacta.
- **Fechas compactas** "15 nov"/"3 jun 26" (`fdateShort`) en pedidos del listado, ficha de contacto y detalle; agenda sigue con fecha larga (es su eje).
Sin tu revisión todavía. Escribí hallazgos en Bianca-Emite.md.

## 2026-11-13 · Alba → Bianca · pedido de Nico (v26)

Las tarjetas de productos del **detalle** ahora se apilan en **horizontal**: la primera a la izquierda y las siguientes desplazadas 56px a la derecha (offset adaptativo si hay muchas para no salirse), la última encima. Tocar una la trae al frente (mismo comportamiento, ahora en X). Alto del bloque ~90px en vez de la cascada vertical. Verifico offsets/zIndex/anchos en demo (`fae28bf`).

## 2026-11-13 · Alba → Bianca · ronda de Nico (v28, `7e63608`)

- **Detalle rehecho**: quité la imagen grande fija; las tarjetas tienen foto de 68px, toca 1 = se resalta en su lugar (borde azul + elevación, sin moverse), toca 2 = se expande a ancho completo y muestra la foto grande del producto adentro. Editar/eliminar ahora viven en la barra superior junto a la X (con tinte sutil: azul lápiz, coral papelera) y también flotan sobre el conjunto de tarjetas.
- **Guardado de pedido mixto**: el save ahora une SIEMPRE lo del inventario + lo escrito a mano (antes dependía de la pestaña activa y en caminos como inv→man→agregar→inv se perdía lo manual). Probado: inventario + manual guardando en modo manual → los dos quedan.
- **Cámara** en filas manuales ahora es SVG; botones de inventario (lápiz azul/papelera coral sobre vidrio), ajustes con íconos SVG (cuenta/apariencia/prefijo/borrar/cerrar sesión/cuentas) y lista de cuentas.
- **Quitar foto** de producto: botón en el editor; al guardar, el documento de la nube (fotos/{id}) se borra también.
Pendiente tuyo: revisión visual de esta iteración (especialmente tarjetas sel/open y tintes de color). Escribí en Bianca-Emite.md.

## 2026-11-13 · Alba → Bianca · pendiente menor de la ronda v28

En el navegador de pruebas quedó a medio camino: al final de la ronda APX se colgó y no pude confirmar **por pantalla** el color de los dos íconos de las tarjetas de inventario (lápiz azul `#8fb0ff`, papelera coral `#ff9d7a` sobre el vidrio oscuro). El CSS está aplicado con clases `.e`/`.d` y el mismo patrón ya se verificó funcionando en la barra superior del detalle (`#hEdit`/`#hDel`), así que doy por correcto el código, pero te lo marco como **pendiente visual**: cuando revises v28, mirá esas dos teclas y decime si se ven con el tinte sutil o quedaron blancas. Si quedaron blancas lo ajusto.

## 2026-11-13 · Alba → Bianca · ronda de Nico (v29, `b7937e7`)

Siete cambios por pedido directo de Nico:
1. **Inventario**: tocar la tarjeta de un producto abre la foto ampliada en capa flotante (lightbox), sin pasar por editar. Editar/eliminar siguen en sus botones.
2. **Pedido, tarjeta seleccionada**: queda FIA en su lugar (sin desplazarse) pero al frente: borde azul, sombra y sobre las demás.
3. **Pedido, foto ampliada**: el segundo toque abre SOLO la imagen en capa flotante; las otras tarjetas siguen visibles (ya no se ocultan).
4. **Estados con un toque**: en el detalle hay 4 chips (Nuevo / Mensaje enviado / En cuotas / Pagado); tocar cambia el estado y guarda, sin entrar a editar.
5. **−/+ Cuota** con tinte azul y borde para que no pasen desapercibidos.
6. **Inicio**: el punto de Próximos en agenda usa el color del estado del pedido.
7. **Contactos**: nota de la clienta visible como descripción ("📝 …"), resumen "N pendientes · N hechos", y dentro del contacto: sección Pendientes (con miniaturas) y Hechos (compacta, sin imágenes; al tocar abre el detalle completo).
Todo probado en demo (lightbox pedido+inventario, zIndex 120 vs 2, chip paid, cuotas azul, dots por estado, nota visible). Tu revisión visual cuando puedas.

## 2026-11-13 · Alba → Bianca · arreglos v30 (`047e78e`)

Por feedback de Nico sobre v29: (1) lightbox ahora tiene botón X circular arriba a la derecha (además de cerrar al tocar fuera); (2) chips de estado del detalle subieron de opacidad .4 → .85 y el activo a 1 con anillo azul; (3) −/+ Cuota: tinte suave con texto azul fuerte en claro (#3554c9) y claro (#d4deff) en oscuro; (4) editar/borrar del conjunto de tarjetas z-index 130 para que las tarjetas seleccionadas no los tapen. Verificado computado en demo. Te dejo mirada visual rápida cuando pasés.

## 2026-11-13 · Alba → Bianca · revisión visual extensa v31 (`40c8135`)

Nico pidió revisión a fondo ("se rompe todo a medida que agregamos"). Pasada visual completa en `?demo=1`, claro y oscuro:

1. **Chips de estado del detalle** (Nuevo / Mensaje enviado / En cuotas / Pagado): ahora con pastel + texto de color en ambos temas, activo con anillo. Confirmar legibilidad en claro y oscuro (es la 3ª iteración de esto — si algo sigue sin verse, captura por favor).
2. **Íconos editar/borrar/cerrar**: ahora círculos con borde sutil y sombra (barra superior del detalle, tarjetas de inventario, X del lightbox). Coherencia visual, tamaños, contraste de los tintes azul/coral.
3. **Tarjetas del pedido**: escalón ahora 60–110px; al seleccionar una, las demás siguen visibles; seleccionada con borde azul + sombra + por encima. Revisar que no tape el título/total y que se vea bien con 2, 3 y 4 productos.
4. **−/+ Cuota** con tinte azul: legibilidad del texto en ambos temas.
5. Regresión general de lo de v29/v30 (lightbox con X, puntos de agenda por estado, nota en contactos, pendientes/hechos).
Yo ya barrí con consola: cero errores JS en todas las vistas y guardado ok. Necesito tu ojo para lo visual fino. Escribí en Bianca-Emite.md.

## 2026-11-13 · Alba → Bianca · v32 (`a65df8f`)

Por feedback de Nico: (1) **causa raíz de las tarjetas que "desaparecían"**: `.dcard.sel` tenía `transform:translateY(-2px)!important` que pisaba el translateX en línea → la tarjeta seleccionada saltaba a la izquierda y tapaba la otra. Ya sin transform en .sel (solo borde/sombra/z-index). (2) Animaciones de entrada aceleradas (rise .5s→.18s, fadeUp .18s→.1s, delays de .42s máx → .14s máx) — Nico sentía la página lenta por las animaciones. Mirá que no queden bruscas. (3) Cambiar estado ahora pide confirmación (Orion tiene el detalle). Re-check visual cuando pasés.

## 2026-11-14 · Alba → Bianca · Auditoría v32 corregida en local (`26fcf3c`)

Entrega lista: **rama `fix/visual-v32`**, worktree **`/home/nico/Documents/GitHub/Ropa/.worktrees/fix-visual-v32`**, base `77ac0f1`, commit **`26fcf3c`** (limpio). Port selectivo de `66541f5`, conservando lo de v32: selección fija, confirmación de estado y animaciones rápidas. Corregidos los seis puntos: SVG de Mi cuenta/Mis negocios, avisos sin tapar contenido (franja superior reservada; éxitos ocultos con hoja abierta, validaciones visibles), contraste, estados 44px, lightbox modal/foco y menores de nav/filtros/favicon. Caché v33 preparada, **sin merge/push/publicar**.

**Pruebas:** `npm test` 12/12; `npm run check` y `git diff --check` OK; `npm audit --omit=optional` 0 vulnerabilidades. Navegador APX, demo real en iframe de 320×568 / 393×740 / 1280×640, claro/oscuro: **145/145 comprobaciones, 0 errores JS capturados**. Contraste mínimo de los puntos pedidos: estados 4,57:1; cuotas 6,53:1; total 6,79:1; precios del editor 5,37:1; contador/avatar 5,02:1. Verifiqué las imágenes de Ajustes, detalle, editor y foto; snapshots de la sesión documentados, no PNG nuevos exportados.

Informe/evidencia y límites: **`capturas/2026-11-14/alba-v33-verificacion.md`**. Reproducible: `tests/README.md`, demo local `http://localhost:8764/?demo=1`, harness `http://localhost:8764/tests/visual.html`. UNVERIFIED: teléfono/safe areas reales, lector completo y actualización de caché después de desplegar. La demo publicada sigue en v32. Tarea de entrega: `task_8a599818ddec4618`; no cierra B12 ni QA funcional general.
