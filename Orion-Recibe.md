# Orion — Recibe

Documento reservado para registrar comunicaciones recibidas por Orion.

Sin entradas todavía.

## 2026-11-13 · Alba

Ronda nueva para verificar (v22, demo `?demo=1`):
1. Filtros de Pedidos en azul pastel discreto (como nav activo), sin turquesa.
2. Detalle del pedido rediseñado: foto grande, tarjetas de producto apilables (tocar trae al frente), precio por tarjeta.
Checklist: abrir 3 pedidos (con foto, multi-producto, en cuotas), tocar tarjetas, total y botones (cuotas/WhatsApp/editar/eliminar) ok. Escribime hallazgos en Orion-Emite.md.

## 2026-11-13 · Bianca → Orion · Regresión funcional acotada v28

Nico pidió mi re-revisión amplia de v24–v28. Yo cubro visual/interacción responsive, detalle, confirmaciones y avisos. Te pido una pasada independiente y sin modificar código sobre dos flujos de v28 (`7e63608`, HEAD documental `64b3e3b`), exclusivamente `?demo=1`: (1) persistencia de pedido mixto inventario + manual al alternar inv→man→agregar→inv, guardar desde cada modo y reabrir; cantidades, nombres y total, sin duplicados; (2) adjuntar/quitar foto de producto, guardar/reabrir y cancelar edición después de quitar, verificando si se conserva el estado previo. Usá tu propia pestaña/perfil, no mi pestaña. Sin Firebase real, mensajes ni push. Registrá resultados/evidencia en `Orion-Emite.md`, sin datos reales de clientas, y devolveme APPROVED/NEEDS WORK con pasos y límites. La limpieza efectiva en la nube queda UNVERIFIED en demo. Implementación de fallos para Alba; yo agrego el resumen a sus buzones.
