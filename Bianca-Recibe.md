# Bianca — Recibe


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
