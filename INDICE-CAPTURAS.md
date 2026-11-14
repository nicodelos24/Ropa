# Índice compartido de capturas — Ropa

Este archivo es el índice único para capturas de Nico, Alba, Bianca y Orion/QA. Las capturas que deban compartirse de forma duradera se guardan en `capturas/AAAA-MM-DD/` con nombres breves y descriptivos; se enlazan aquí con fecha, autor, pantalla/versión, motivo, evidencia relacionada y estado. No se incorporan imágenes de clientas ni datos reales sin autorización explícita.

## Cómo registrar una captura nueva

1. Guardar el original en `capturas/AAAA-MM-DD/` sin sobrescribir otros archivos.
2. Nombrar descriptivamente: `autor-pantalla-hallazgo.ext` (por ejemplo, `nico-detalle-pedido-cuotas.jpg`).
3. Agregar una fila abajo: fecha, quién la tomó, versión/commit o URL/demo si se conoce, descripción, enlace a archivo y task/recibo relacionado.
4. Para evidencia generada durante revisión o QA, indicar viewport/tema y vincular el informe/tarea; no dar por aprobada una ronda por adjuntar capturas.
5. Mantener este archivo y los registros/tareas como referencias; no mover ni borrar capturas históricas sin verificar sus enlaces.

## Capturas registradas

| Fecha | Autor | Versión / contexto | Descripción | Archivo / evidencia | Estado |
|---|---|---|---|---|---|
| 2026-11-13 | Nico | Ropa v29 publicada según aviso recibido; el commit/versión exacta de la captura no está identificado aquí | Detalle de pedido en móvil: imagen ampliada sin un cierre suficientemente visible; chips de estado casi ilegibles; controles −/+ de cuota con baja visibilidad; botones de editar/borrar quedan ocultos por las tarjetas superpuestas. | [Captura original](capturas/2026-11-13/nico-detalle-pedido-estado-cuotas-superposicion.jpg) · [Tarea de corrección visual](apx:tasks/task_081ef3e96ee94aec) | Corregida y verificada en local por Bianca; sin publicar. Ver evidencia v30 abajo. |
| 2026-11-13 | Bianca | v23 / BV-13, revisión visual | Lámina y matrices visuales de la revisión v23, con veredicto NO OK y hallazgos R23-01–06. Evidencia permanece adjunta a la tarea; no se duplicó localmente al crear el índice. | [Evidencia adjunta a tarea](apx:tasks/task_611c67d04f724048) · [Informe Bianca-Emite](Bianca-Emite.md) | No aprobación; historial referenciado |
| 2026-11-13 | Bianca | Corrección puntual de v29 → v30 local | Cuatro puntos de Nico implementados y verificados en demo; originales y lámina indexados abajo. La revisión general v24–v28 (`task_e7f969b9ca404a41`) no se cierra por este trabajo. | [Tarea](apx:tasks/task_081ef3e96ee94aec) · [Informe](Bianca-Emite.md) · [Memoria](Ropa-Bianca.md) | OK visual local para este alcance; sin publicar |

## Evidencia de Bianca · corrección v29 · 2026-11-13

Tarea común: [task_081ef3e96ee94aec](apx:tasks/task_081ef3e96ee94aec). Base `eaaaf40`/cache v29; corrección **local, sin publicar**, rama `fix/visual-v29`, commit `66541f5`, cache preparada v30. Datos demo y fotos SVG sintéticas, no clientas reales. Viewports de navegador, no teléfono físico. Matriz adicional 360×800 medida sin captura propia. Detalle de pruebas/contrastes en [Bianca-Emite](Bianca-Emite.md) y [Ropa-Bianca](Ropa-Bianca.md).

| Autor / fecha | Contexto y pantalla | Captura | Estado / motivo |
|---|---|---|---|
| Bianca · 13/11 | v29 publicada · claro · 393×800 | [Antes: estados y cuotas](capturas/2026-11-13/bianca-v29-antes-claro-393.png) | Reproducción de bajo contraste; referencia histórica, no corrección |
| Bianca · 13/11 | v30 local · lámina con tres capturas originales 393×800 | [Resumen visual](capturas/2026-11-13/bianca-v30-resumen-visual.png) | Claro, oscuro y cierre explícito de foto; montaje documental, no pantalla nueva |
| Bianca · 13/11 | v30 local · pedido · claro · 320×800 | [Pedido claro 320](capturas/2026-11-13/bianca-v30-light-320-pedido.png) | Estados/cuotas/acciones visibles y última tarjeta fija al frente |
| Bianca · 13/11 | v30 local · pedido · oscuro · 320×800 | [Pedido oscuro 320](capturas/2026-11-13/bianca-v30-dark-320-pedido.png) | Misma comprobación, oscuro |
| Bianca · 13/11 | v30 local · pedido · claro · 393×800 | [Pedido claro 393](capturas/2026-11-13/bianca-v30-light-393-pedido.png) | Legibilidad y selección sin desplazarse |
| Bianca · 13/11 | v30 local · pedido · oscuro · 393×800 | [Pedido oscuro 393](capturas/2026-11-13/bianca-v30-dark-393-pedido.png) | Legibilidad y selección sin desplazarse |
| Bianca · 13/11 | v30 local · pedido · claro · 1280×900 | [Pedido claro escritorio](capturas/2026-11-13/bianca-v30-light-1280-pedido.png) | Hoja limitada y acciones accesibles |
| Bianca · 13/11 | v30 local · pedido · oscuro · 1280×900 | [Pedido oscuro escritorio](capturas/2026-11-13/bianca-v30-dark-1280-pedido.png) | Hoja limitada y acciones accesibles |
| Bianca · 13/11 | v30 local · foto ampliada desde inventario · 393×800 | [Cierre de imagen en inventario](capturas/2026-11-13/bianca-v30-lightbox-inventario-393.png) | Botón × Cerrar, fuera de la foto y de 44px |
| Bianca · 13/11 | v30 local · segundo toque del producto del pedido · 393×800 | [Foto del pedido](capturas/2026-11-13/bianca-v30-lightbox-pedido-393.png) | Misma capa y cierre; no elimina otras tarjetas |
| Bianca · 13/11 | v30 local · editar desde barra superior · 393×800 | [Editar abre](capturas/2026-11-13/bianca-v30-editar-pedido-393.png) | Formulario real tras tocar Editar con tarjeta seleccionada |
| Bianca · 13/11 | v30 local · eliminar desde barra superior · 393×800 | [Confirmación de eliminar](capturas/2026-11-13/bianca-v30-eliminar-cancelar-393.png) | Eliminar abre su confirmación; Cancelar conservó el pedido de prueba |
| Bianca · 13/11 | v30 local · seis productos/nombres largos · 320×568 | [Acciones tras scroll](capturas/2026-11-13/bianca-v30-320-scroll-tarjetas.png) | Barra sticky por encima de tarjetas, sin overflow |
| Bianca · 13/11 | v30 local · pedido oscuro · 320×568 | [Hoja en viewport corto](capturas/2026-11-13/bianca-v30-dark-320-corto.png) | Verificación complementaria en alto reducido |

## QA independiente de Orion · corrección v29 · 2026-11-13

- [Informe completo y referencias a snapshots](capturas/2026-11-13/orion-v30-qa.md), tarea `task_081ef3e96ee94aec`, commit `66541f5`, demo local, sesión `review-visual-v29`.
- **APPROVED sólo en los flujos ejecutados:** cuotas, estados rápidos, editar y eliminar/cancelar/confirmar con última tarjeta seleccionada; claro/oscuro. Sin fallos encontrados. No aprobación integral: lightbox, móvil y mediciones no pudieron instrumentarse en su sesión read-only; las comprobaciones de Bianca están separadas arriba.
- El informe registra los snapshots APX `8580208363054229514.1.8–.1.30` y los jobs de comprobación. No se afirma que esos snapshots sean archivos PNG locales; no se recibió una captura de imagen nueva de Orion para copiar en esta ronda.

## Correcciones de auditoría v32 · Alba · 2026-11-14

- [Informe local v33 y referencias a snapshots APX](capturas/2026-11-14/alba-v33-verificacion.md), commit `26fcf3c`, rama `fix/visual-v32`, worktree `.worktrees/fix-visual-v32`.
- Demo real en iframe 320/393/1280 claro/oscuro: **145/145 comprobaciones OK**, 0 errores JS capturados; 12/12 pruebas Node. Imágenes de Ajustes, detalle, editor y foto vistas en la sesión; no se exportaron PNG nuevos. Sin integrar/publicar.

## Alcance del índice

Este índice centraliza el material desde su adopción y enlaza evidencia histórica que sigue en tareas APX/recibos. Es posible que capturas antiguas aún no estén copiadas a `capturas/`; sus ubicaciones se agregan a medida que cada agente las identifica, sin afirmar que el repositorio ya contiene todo el archivo histórico.
