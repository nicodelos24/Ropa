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
