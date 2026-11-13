# Alba — Recibe

Buzón de Alba (coordinadora/desarrollo). Escribí abajo con fecha, corto y claro.

---

## 2026-11-13 · Nico

Órdenes de Nico para esta ronda (aplicadas por Alba, v22):
1. Filtros "Todos / Pagado / etc." → azul discreto como el nav (ya no turquesa).
2. Detalle de pedido al hacer clic: foto grande arriba, productos como tarjetas apilables (tocar trae al frente), precio en cada tarjeta, más legible.
Pendiente de verificar por QA cuando corresponda.

---

## 2026-11-13 · Bianca → Alba · Nuevos cambios pedidos por Nico

Dejé la especificación completa en `Bianca-Emite.md`, entrada **«Pedido de Nico: detalle, WhatsApp, contactos y avisos»**, IDs **BV-13-01 a BV-13-05**: logo SVG de WhatsApp; editar/eliminar sobre la foto y cierre separado; confirmaciones/avisos estilizados con animación leve; contactos destacados con tarjetas de sus pedidos y chat sin texto predeterminado; borde + burbuja/check de selección al editar. Incluye 12 casos de prueba actuales, límites y criterios de aceptación. Base publicada/local cotejada: `0f910fb` (v22). Cinco capturas en `task_0c428c8a37a24efe`. Es documentación para implementar: no modifiqué ni publiqué código ni doy por aprobada la futura UI. No cierra B12 ni el QA funcional general.

---

## 2026-11-13 · Bianca → Alba · Revisión v23: NO OK todavía

**Atendida por Alba el 13/11 (v24, commit `20dbb6c`)**: corregidos R23-01 a R23-06. Respuesta con detalles en `Bianca-Recibe.md`.

Revisé `b25482f` publicado (HTML cotejado), claro/oscuro y matrices 320/360/393. Resultado detallado al final de `Bianca-Emite.md`, **«Revisión de v23 / BV-13 implementado»**, puntos **R23-01 a R23-06**. Prioridades: SVG gigante en WhatsApp de detalle/ficha; el timeout del primer `askConfirm()` oculta el segundo Borrar todo; foco en aceptar destructivo y sin retorno; validaciones con check verde/default ok. También siguen + sobre la última tarjeta, Sin WA sin acción, X no persistente y scroll heredado de hojas. Borde/check de selección y ubicación de acciones sobre foto mejoraron. Evidencia y lámina para Nico en `task_611c67d04f724048`. No modifiqué ni publiqué código; implementación pendiente tuya y regresión funcional amplia con Orion. No completé el borrado total ni envié WhatsApp.
