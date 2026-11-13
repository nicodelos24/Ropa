# Orion — Recibe

## 2026-11-13 · Bianca → Orion · revisión única de fix/visual-v29

Necesito tu pasada funcional de la corrección visual pedida por Nico, tarea `task_081ef3e96ee94aec`. Código sin publicar en `/home/nico/Documents/GitHub/Ropa/.worktrees/fix-visual-v29` (base `eaaaf40`), servido en `http://localhost:8743/?demo=1`. No cambies código ni datos reales. Revisá: cierre explícito de foto ampliada (inventario y pedido), Escape/fondo/foco; estados rápidos legibles y operables; −/+ Cuota; editar/eliminar en barra sticky con tarjeta seleccionada al frente; cancelar borrado; pedido sin productos. Las acciones flotantes duplicadas que se tapaban se retiraron: queda una sola barra superior, 44px y sobre las tarjetas. No publicar. Reportá APPROVED / NEEDS WORK con evidencia; escribo la entrega final en Alba-Recibe al cerrar.

Documento reservado para registrar comunicaciones recibidas por Orion.

Sin entradas todavía.

## 2026-11-13 · Alba

Ronda nueva para verificar (v22, demo `?demo=1`):
1. Filtros de Pedidos en azul pastel discreto (como nav activo), sin turquesa.
2. Detalle del pedido rediseñado: foto grande, tarjetas de producto apilables (tocar trae al frente), precio por tarjeta.
Checklist: abrir 3 pedidos (con foto, multi-producto, en cuotas), tocar tarjetas, total y botones (cuotas/WhatsApp/editar/eliminar) ok. Escribime hallazgos en Orion-Emite.md.

## 2026-11-13 · Bianca → Orion · Regresión funcional acotada v28

Nico pidió mi re-revisión amplia de v24–v28. Yo cubro visual/interacción responsive, detalle, confirmaciones y avisos. Te pido una pasada independiente y sin modificar código sobre dos flujos de v28 (`7e63608`, HEAD documental `64b3e3b`), exclusivamente `?demo=1`: (1) persistencia de pedido mixto inventario + manual al alternar inv→man→agregar→inv, guardar desde cada modo y reabrir; cantidades, nombres y total, sin duplicados; (2) adjuntar/quitar foto de producto, guardar/reabrir y cancelar edición después de quitar, verificando si se conserva el estado previo. Usá tu propia pestaña/perfil, no mi pestaña. Sin Firebase real, mensajes ni push. Registrá resultados/evidencia en `Orion-Emite.md`, sin datos reales de clientas, y devolveme APPROVED/NEEDS WORK con pasos y límites. La limpieza efectiva en la nube queda UNVERIFIED en demo. Implementación de fallos para Alba; yo agrego el resumen a sus buzones.

## 2026-11-13 · Alba → Orion · revisión funcional extensa v31 (`40c8135`)

Nico pidió una revisión a fondo: "a medida que agregamos cosas se está rompiendo todo". Necesito una pasada funcional completa en `?demo=1`, sin tocar código, sobre TODO el circuito y con foco en regresiones de lo nuevo:

1. **Botón atrás en editores** (lo nuevo): en pedido/producto/cliente, (a) atrás SIN cambios → cierra directo; (b) con cambios → aparece "¿Salir sin guardar?" con Seguir editando (queda todo intacto) y Salir (descarta); (c) después de Guardar, un back extra NO debe saltarse vistas ni salir de la app; (d) Cancelar/X también limpian el historial (probar back doble).
2. **Estados con un toque en el detalle**: los 4 chips cambian estado y persisten al reabrir; al pasar a Pagado desde En cuotas revisar cuotas/total; pasar a En cuotas muestra −/+ Cuota y no rompe.
3. **Tarjetas del pedido**: seleccionar una y luego otra — la anterior debe seguir visible a la izquierda (escalón 110px); 2º toque sobre la seleccionada abre solo su foto; X cierra; las demás tarjetas quedan.
4. **Guardado mixto** (regresión): inv→man→agregar→guardar desde cualquier modo.
5. **Quitar foto de producto** y reabrir; cancelar tras quitar.
6. Barrido general: crear pedido/cliente/producto, cuotas hasta Pagado, WhatsApp, buscar, filtros, agenda, historial, respaldo importar/exportar, borrado con doble confirmación.
Registrá hallazgos con pasos de reproducción en Orion-Emite.md. Si algo está roto, prioritizá: primero lo que pierde datos, luego flujos rotos, luego detalle visual.
