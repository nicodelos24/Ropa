# QA funcional independiente — UX35 / base UX34

Fecha: 2026-11-14. Solicitante: Bianca. Veredicto: **NEEDS WORK** en los cuatro casos pedidos. No es autorización de publicación ni decisión de integración.

## Base y método

- Worktree `/home/nico/Documents/GitHub/Ropa/.worktrees/ux-v34`, rama `feat/ux-v34`, HEAD `0bc1a40`.
- `git status --short` del worktree vacío antes y después: no modifiqué app, tests del proyecto ni configuración. Sin commit/push/publicación.
- GET local `http://127.0.0.1:8774/?demo=1` cotejado con `index.html`: SHA-256 idéntico `432b8f81c183eb3d5606e3c23f2ad8936e377d9e8383f8628cc4dce31806e957`.
- Regresión independiente en jsdom 26, una instancia aislada por prueba. Ejecuto el script real de la app y sus handlers de input/click, inspecciono DOM, objetos y JSON de `localStorage`. Firebase está simulado y bloquea cualquier acceso a colecciones; sólo fixtures demo/sintéticos.
- Para subir una foto simulo únicamente el compresor con un PNG sintético y disparo `change` del input file real. La asignación al producto, Cancelar, Guardar, reapertura y almacenamiento usan código original. Eliminar/quitar foto no requiere ese stub.

## Checks ejecutados

Desde el worktree:

```bash
rtk npm test
rtk npm run check
rtk git diff --check
node --test /tmp/apx-scratch-4f023747/th_9f4ae5e0addf43aa/orion-ux34-regression.test.cjs
```

- Suite existente: **16/16 PASS**, exit 0.
- Sintaxis de index.html, sw.js y visual harness: **OK**, exit 0.
- Diff whitespace: **OK**, exit 0.
- Regresión focal nueva: **8 pruebas, 3 PASS, 5 FAIL**, exit 1. Los cinco FAIL son aserciones de comportamiento correspondientes a los cuatro casos pedidos (foto Cancelar tiene dos variantes).
- Corregí dos detalles del harness durante su preparación (`#cv-p`, contador opcional del baseline). La ejecución final no tiene errores del harness.

## Hallazgos reproducidos

### F1 — Dos filas manuales homónimas pierden la segunda (alta: pérdida de ítem/precio)

1. Nuevo pedido → Escribir a mano.
2. Agregar dos filas: `Remera`, precio `100`; `Remera`, precio `200`.
3. Completar cliente sintético y Guardar; reabrir.

Resultado real: **2 filas en DOM, preview `$100`, contador `1 producto en el pedido`**. El pedido y el JSON persistido sólo contienen `[{name:"Remera",price:100,qty:1,photo:null}]`; al reabrir queda una fila. Se descartan $200 sin validación ni aviso. Esperado: preservar las dos líneas/$300 o impedir explícitamente ese estado antes de guardar; no descartar silenciosamente.

Ubicación: `index.html:1254–1262`, `orderItems()` deduplica por nombre minúsculo tanto filas manuales como de inventario. La suite verde sólo prueba nombres distintos: no detecta esta pérdida.

### F2 — Precio decimal se convierte en 100 veces su valor (alta: integridad monetaria)

1. Inventario → Editar un producto.
2. Precio `1.200,50` → Guardar cambios.
3. Inspeccionar/reabrir producto y JSON persistido.

Resultado: precio **120050**, persistido **120050**; toast `Inventario actualizado ✓`, editor cerrado, sin rechazo. Esperado: interpretar 1200,50 o rechazar claramente el formato/decimales si sólo se admiten enteros; nunca concatenar los dígitos silenciosamente.

Ubicación: `index.html:998`, `.replace(/\D/g,"")`. El contrato de decimales es una decisión de producto; el dato errado y el falso éxito son comprobados.

### F3 — Cancelar no revierte foto y el próximo save la persiste (alta: estado no confirmado)

Variante quitar:

1. Producto guardado con foto → Editar → Quitar → Cancelar.
2. Reabrir el editor y ejecutar posteriormente un guardado de app.

Resultado: el objeto de inventario cambia a `photo:null` **antes** de Guardar; Cancelar no lo restaura y el editor reabierto no tiene imagen. El almacenamiento todavía tenía la foto justo después de cancelar, pero después de llamar al `save()` real de la app la foto también desaparece del JSON persistido. No es sólo un preview.

Variante adjuntar:

1. Producto guardado sin foto → Editar → adjuntar PNG sintético → Cancelar.
2. Reabrir y guardar posteriormente.

Resultado: `photo` ya está en el objeto original, permanece al reabrir y se persiste en el siguiente `save()`, aun sin haber confirmado la edición. La parte de compresión está simulada; el callback y resto del flujo son originales.

Ubicación: `index.html:951–998`: el editor conserva la referencia original; `updPrev()` y Quitar modifican `it.photo`. Cancelar sólo cierra.

### F4 — Borrar inventario oculta foto de un pedido guardado (media: representación/historial, no borrado de item.photo)

Preparación aislada: pedido guardado con `items[0].photo` sintético propio y producto correspondiente con foto.

1. Abrir detalle del pedido: hay foto en `.dcard`.
2. Inventario → Eliminar producto → confirmar el texto `Se quita del inventario. Los pedidos ya guardados no cambian.`
3. Reabrir el mismo pedido.

Resultado: `data-ph` pasa de tener imagen a vacío y `.dcard img` de 1 a **0**. El producto sí fue eliminado; **el pedido completo sigue byte a byte igual y `item.photo` continúa en localStorage**. La imagen queda inaccesible en el detalle aunque el dato existe. Esperado: seguir representando la foto guardada del pedido, independientemente del inventario.

Ubicación: `index.html:1378–1380`, `openOrder()` sólo usa `photo: inv&&inv.photo`, ignora `i.photo`.

## Controles que sí pasan

- Partí de Medias lanas con cantidad 2 y precio 250; agregué Vestido floral 1200 y manual `QA Gratis` precio 0.
- Alterné inventario → manual → agregar → inventario → manual; guardé una vez desde inventario y otra desde manual en instancias separadas.
- En ambos casos persistieron tres ítems, cantidad 2, precio cero y total **$1,700**, idéntico al preview y a la reapertura tras recargar el estado desde JSON local.
- Quitar foto **con Guardar** persiste sin foto al reabrir. Adjuntar **con Guardar** persiste/reabre con foto (compresión simulada).

## Atribución: no presentar problemas heredados como regresiones nuevas

Comparé además los cinco casos negativos contra `4369565` (anterior a `79473b7`, borrador UX34), extraído con `git show` sin cambiar ramas.

- F1 ya perdía la segunda fila **al guardar**: preview anterior `$300` y persistencia `$100`. En UX34 el mismo descarte también pasa al preview/contador (`$100`, 1 producto). Es un fallo heredado de guardado con comportamiento de preview cambiado, no una pérdida nueva exclusiva de `0bc1a40`.
- F2, F3a, F3b y F4 reproducen igual en `4369565`: **heredados**, no atribuibles al último cambio visual. Están dentro del pedido explícito de esta auditoría, por eso se informan; no agregué tareas ajenas al alcance.

## Evidencia y reproducción técnica

Carpeta `/tmp/apx-scratch-4f023747/th_9f4ae5e0addf43aa/`:

- `orion-ux34-regression.test.cjs`: harness independiente; SHA-256 `960d96c58167261087afd52ecd081c0e7c20203ae5dfacad69e935443b56c037`.
- `orion-ux34-regression.tap`: ejecución final, 3 PASS/5 FAIL y diagnósticos de DOM/JSON.
- `orion-ux33-baseline.tap`: contraste histórico, cinco aserciones negativas reproducidas.
- `ux33-baseline.html`: snapshot histórico de `4369565`.
- `ux34-served.html`: GET local cotejado con la base.

```bash
APP_HTML=/tmp/apx-scratch-4f023747/th_9f4ae5e0addf43aa/ux33-baseline.html node --test --test-name-pattern='^F' /tmp/apx-scratch-4f023747/th_9f4ae5e0addf43aa/orion-ux34-regression.test.cjs
```

## Límites

No hice auditoría visual ni abrí navegador en esta pasada; la verificación independiente es funcional DOM/datos con jsdom, no confirma layout/píxeles ni captura real de cámara/galería/decodificación. Recargué el estado desde JSON para los controles de persistencia, no una navegación demo completa (el arranque demo regenera fixtures). Firebase/sincronización/eliminación efectiva de fotos en nube, datos reales, WhatsApp y publicación: **UNVERIFIED / fuera del alcance**. Responsable de implementación si se decide corregir: Alba (`5938bef9347d-developer`).
