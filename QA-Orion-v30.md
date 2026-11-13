# Approved — revisión independiente acotada de v30

**13/11/2026 · Orion · tarea `task_081ef3e96ee94aec`**

No encontré fallas del pedido en lo comprobado. Este es un informe técnico, no autorización para integrar o publicar. La decisión queda en quien lleva la entrega. Hice una sola pasada; no cambié código ni cerré la tarea.

## Versión y alcance

- Revisé `66541f5`, rama `fix/visual-v29`, base `eaaaf40`, en `.worktrees/fix-visual-v29`.
- `git show --stat`: sólo `index.html` y `sw.js`; caché `ropa-v30`. Worktree limpio al inicio y al final. Sin merge/push/publicación.
- `http://localhost:8743/?demo=1` respondió HTTP 200. El HTML servido coincide con el archivo: SHA-256 `da784fafd86832a3f7c0ced146bdbc83965df022c4ce316e30cdac0cb20b4e75`.
- No usé Firebase real, datos reales, mensajería ni borrado real. Los cambios interactivos fueron sobre la demo.

## Qué comprobé en el navegador

Viewport disponible de escritorio **1265×722**, tema oscuro:

- Abrí el pedido demo en cuotas y accioné **− Cuota** y **+ Cuota**; el detalle continuó operativo y los controles siguieron disponibles. La comprobación numérica de los límites del contador está cubierta abajo por los tests jsdom, no por una lectura de datos de la página.
- Cambié el estado rápido a **Mensaje enviado**: cambió el indicador activo y desaparecieron los controles exclusivos de cuotas.
- **Editar pedido** abrió el editor correcto. Seleccioné dos productos adicionales, guardé y reabrí: quedaron tres tarjetas horizontales y total **$3.550** (1.400 + 1.200 + 950).
- Vi las tarjetas superpuestas y el borde de selección; la barra **Editar/Eliminar/Cerrar** permaneció visible por encima de ellas. El toque por referencia del navegador usa el centro: al tocar una tarjeta parcialmente cubierta se activó la que estaba encima. No lo cuento como fallo del diseño solicitado ni como prueba de haber tocado las franjas expuestas de todas las tarjetas.
- Evidencia de esta sesión: snapshots de navegador `.6.12` y `.6.13` de la pestaña `t8`, con las tres tarjetas y las acciones visibles. Revisé además la lámina aportada por Bianca `capturas/2026-11-13/bianca-v30-resumen-visual.png`; esa lámina no es evidencia independiente mía.

## Comandos y pruebas ejecutadas

- `git -C .worktrees/fix-visual-v29 diff --check eaaaf40..66541f5` → **exit 0**.
- Extraje el script inline y ejecuté `node --check`; también `node --check .worktrees/fix-visual-v29/sw.js` → **exit 0 ambos**.
- `node /tmp/apx-scratch-4f023747/th_0ed8c5f18ac44c7e/unit-v30.cjs` → **15 pruebas aprobadas, 0 fallidas**. Entorno **Node + jsdom**, funciones reales extraídas del HTML, sin motor de renderizado: estados y `aria-pressed`, cuotas con piso cero y pago final, edición del pedido correcto, selección exclusiva y fórmula de distribución de seis tarjetas, primer/segundo toque de foto, cierre explícito/fondo/Escape, Tab/Shift-Tab y restauración de foco/inert, rechazo de duplicados, cancelar/aceptar borrado conservando inventario, pedido vacío/sin `items`. Los anchos de la fórmula están simulados: **no equivalen a prueba visual móvil**.
- `python3 /tmp/apx-scratch-4f023747/th_0ed8c5f18ac44c7e/contrast.py` → **exit 0**. Cálculo independiente a partir de los colores CSS y `color-mix(in srgb)`, no medición de estilos renderizados: estados mínimo **4,90:1**, cuotas **6,53:1 claro / 9,51:1 oscuro**, cierre de foto **14,74:1**.
- No hay suite de tests ni `package.json` en el worktree. Instalé jsdom sólo en mi directorio temporal; no agregué dependencias al proyecto.

## Fallas y límites

**Fallas del alcance detectadas: ninguna en lo comprobado.**

**UNVERIFIED en esta pasada independiente:** ejecución visual móvil 320/360/393, tema claro en pantalla, acciones sticky después de scroll, seis tarjetas reales/nombres largos, apertura/cierre de la foto desde inventario y pedido en navegador, teclado real/lector, confirmación de borrado en navegador, consola completa, dispositivo físico, safe areas y persistencia/cache tras despliegue.

La automatización propuesta para tamaños móviles **no se ejecutó**: venció la autorización de `browser_evaluate` y no la repetí. El iframe de prueba no expuso referencias interactivas. Luego APX devolvió `browser.tabs timed out after 12000ms on apx-desktop` al clicar Eliminar, obtener snapshot, leer texto y hacer handoff. El servidor seguía respondiendo HTTP 200. Por eso no afirmo el resultado de ese último clic ni traduzco los tests jsdom a verificación visual. La implementación de `askConfirm()` fue sustituida por respuestas controladas en los tests unitarios.

La evidencia móvil de Bianca es coherente con el código y los contrastes calculados, pero no la presento como repetida por mí. Esta revisión no cierra la revisión general v24–v28 ni B12.
