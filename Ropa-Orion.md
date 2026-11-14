# Ropa — Memoria de QA de Orion y copia del chat

**Responsable:** Orion, QA Engineer.  
**Solicitante:** Nico.  
**Fecha de la revisión:** 12 de noviembre de 2026, UTC−03 (los registros UTC de APX corresponden al 13 de noviembre).  
**Demo:** https://nicodelos24.github.io/Ropa/?demo=1  
**Repositorio:** `/home/nico/Documents/GitHub/Ropa`  
**Chat:** `th_5a1985d9839647b0` — «Pruebas y errores de Ropa».  
**Tarea de seguimiento:** `task_694ea2a436dd4a1e` — «QA de punta a punta de Ropa en modo demo».

## 1. Resultado y reglas para retomar

**Veredicto consolidado: NEEDS WORK.** Terminé la pasada funcional solicitada, incluida la continuación de los casos pendientes. Esto significa que terminé la prueba, no que aprobé el producto ni que corregí los errores.

- Trabajé solamente en `?demo=1`, con datos de ejemplo; no operé cuentas ni datos reales de Firebase.
- No cambié código de la aplicación, no hice commit ni push. Este documento sí es un archivo nuevo solicitado expresamente por Nico.
- Restricción del dueño: **«No hagas push sin avisar».** Guardar este documento no autoriza publicar cambios.
- La primera parte se interrumpió por el límite de ejecución. Cuando Nico preguntó «Terminaste?», aclaré que faltaban casos. La continuación completó esos casos y encontró fallas nuevas.
- La publicación cambió entre las dos partes. **No mantener como vigente el fallo inicial de apertura de Historial:** en la continuación ya abrió y sus filtros funcionaron.
- **La duplicación de Agenda no se resolvió:** la reproduje nuevamente en la continuación, aunque no la repetí en el último mensaje resumido al dueño. Omitirla en ese resumen no la convierte en corregida.
- No extrapolar las pruebas de navegador a una cámara física, un teléfono real, una instalación PWA o la sincronización real con Firebase.
- Si se retoma después de cambios, verificar primero la versión publicada; este documento es evidencia histórica, no prueba del estado futuro.

## 2. Versiones y método

### Primera parte

- Commit observado: `ebee16a` — scroll en pedidos, foto por objectURL y modo demo.
- `git status --short` había mostrado una modificación preexistente en `.apc/agents/developer.md`; no la modifiqué.
- Navegador de escritorio; utilicé captura, clics, escritura, adjunto de imagen desde archivo y lectura del texto de la página.
- Para controles no expuestos por las referencias accesibles y para medir scroll/capturar errores, instrumenté temporalmente el DOM de la pestaña. No modifiqué el sitio publicado.

### Continuación

- Commit local observado: `01e0f28` — `historial: fix crash con datos raros (bug de bianca), filete anti-crash en vistas, fechas en entregas de agenda, chips con mas contraste`.
- Descargué el HTML público y comparé su hash con el `index.html` local. Coincidieron:

```text
ec89394b80a16e8ec128d35a0270ec0a9989cddf576bd954a02b4e990c66ef08
```

- El archivo publicado medía 94050 bytes. La identificación con `01e0f28` corresponde al código coincidente observado entonces; no es una garantía de la publicación posterior.
- Escritorio: viewport medido de 1280 × 722.
- Responsive: iframe temporal de la misma demo con viewport real interior de 393 × 722. La herramienta no exponía referencias a controles dentro del iframe ni un control de redimensionado; usé JavaScript para accionar los botones y medir su geometría. Lo retiré después de la prueba.
- No simulé un dispositivo físico: un iframe permite comprobar layout y scroll, pero no teclado virtual, cámara, safe areas, gestos ni permisos del teléfono.
- Al perderse la primera pestaña de la continuación, abrí otra vez la URL demo. Esa apertura repobló los datos de ejemplo. Distingo las pruebas antes y después de esas recargas: no las uso como prueba de persistencia entre sesiones.
- La última escena de la prueba fue el detalle de Lucía en estado inconsistente «Pagó 2 de 2», después de reducir el total de cuotas. Las modificaciones fueron exclusivamente de demo.

## 3. Hallazgos consolidados

### O01 — Historial no abría — alta inicial, RESUELTO en la versión de la continuación

**Reproducción inicial:** abrir la demo y tocar Historial. Cambiaba el subtítulo a «Movimientos de cada cuenta», pero conservaba el contenido anterior y no mostraba movimientos ni filtros.

```text
Uncaught TypeError: Cannot read properties of undefined (reading 'slice')
index.html:536
```

El diagnóstico inicial contrastó registros demo con `t`, `tipo`, `d` frente a la lectura de `ts`, `action`, `detail` en el historial. La fecha inválida rompía el renderizado.

**Revalidación:** Historial abrió en la continuación. La demo mostró cinco movimientos. Dueña dejó tres, y Socia dos, con los autores correspondientes. No seguir reportando la apertura rota para esta versión.

### O02 — Agenda duplica la entrega seleccionada — media, VIGENTE

**Pasos:**
1. Abrir Agenda en la demo.
2. Seleccionar el 13 de noviembre de 2026, con entrega de María Fernanda.
3. Tocar «Ver otras entregas (4)».

**Resultado:** María Fernanda aparece tanto en el día seleccionado como en la lista desplegada de próximas entregas. Las otras fechas son tres, pero el botón cuenta cuatro incluyendo la seleccionada.

**Esperado:** si se anuncian «otras» entregas, excluir del listado y del contador la fecha seleccionada, o usar una denominación que deje explícito que se muestra la lista completa.

**Estado:** reproducido en ambas partes. En la continuación las listas generales sí mostraban sus fechas; la ausencia de fechas no es un hallazgo vigente de Orion.

### O03 — Pedido demo completamente abonado sigue pendiente — baja, VIGENTE en los datos de ejemplo

**Pasos:** abrir Pedidos en una demo recién cargada y revisar María Fernanda.

**Resultado:** muestra «En 2 cuotas · Pagó 2 de 2» y sus $3.200 están dentro de «Por cobrar».

**Alcance:** inconsistencia del estado inicial de ejemplo, no prueba de que todo pedido nuevo falle al completar cuotas. El pedido nuevo probado sí pasó a Pagado mediante el botón + Cuota. Separar este caso del fallo real de edición O05.

### O04 — Importación sin validación integral ni reversión — alta, VIGENTE

#### Variante A: acepta un inventario nulo y rompe la vista

**Archivo de reproducción:**

```json
{"orders":[],"inventory":null,"clients":[],"events":[]}
```

**Pasos:**
1. Abrir la demo con sus datos iniciales.
2. Ajustes → Importar respaldo → elegir un `.json` con el contenido anterior.
3. Entrar en Inventario.

**Resultado observado:** muestra «Respaldo importado ✓», reemplaza los pedidos por la lista vacía y deja `inventory: null`. Al tocar Inventario cambia el subtítulo pero conserva el contenido de la pantalla anterior. Capturé:

```text
Uncaught TypeError: Cannot read properties of null (reading 'length')
```

La inspección confirmó `inventoryType: "null"`, `orders: 0` y `FB.perfil.demo: true`.

#### Variante B: dice que rechaza el archivo, pero ya cambió los datos

**Archivo de reproducción:**

```json
{"orders":[null]}
```

**Pasos:** importar ese `.json` desde Ajustes en una demo recién cargada y después tocar Pedidos.

**Antes:** 5 pedidos, 5 productos y 4 clientas.  
**Después:** `orders: [null]`, inventario vacío y clientas vacías.

Muestra «Archivo no válido», pero no restaura el estado anterior. Pedidos no abre y queda el contenido de Ajustes. Verifiqué que seguía siendo modo demo.

**Diagnóstico apoyado en el código inspeccionado:** la validación solo comprueba que `d.orders` sea un array. Después asigna `db` antes de completar la operación; el `catch` muestra el mensaje, pero no revierte esa asignación. No validé este comportamiento contra datos reales ni afirmo haber causado una pérdida real en Firebase.

**Esperado:** validar estructura, tipos y elementos completos antes de reemplazar nada; ante cualquier error conservar el estado anterior. La aceptación no debe dejar vistas inutilizables.

#### Controles que sí rechazó

- Texto no JSON: `esto no es JSON` → «Archivo no válido».
- JSON sin pedidos: `{"inventory":[],"clients":[]}` → «Archivo no válido».

Estos dos rechazos no demuestran una validación completa: las dos variantes anteriores atraviesan la comprobación superficial.

### O05 — Reducir el total de cuotas conserva un estado pendiente incompatible — alta, VIGENTE

**Pasos exactos:**
1. Abrir el pedido de Lucía en una demo nueva: tiene 1 de 3 cuotas.
2. Tocar + Cuota una vez: queda en 2 de 3.
3. Editar pedido → cambiar «Número de cuotas» de 3 a 2.
4. Guardar y volver a abrir el pedido.

**Resultado:** muestra «Pagó 2 de 2», pero conserva estado en cuotas. Sus $1.400 siguen dentro de «Por cobrar»; el resumen observado continuó en $7.050 por cobrar y $500 cobrado.

**Esperado:** recalcular el estado coherentemente o impedir el cambio con una validación explícita. El total abonado y el estado no pueden quedar contradictorios.

**Límite:** no ejecuté un incremento adicional desde ese estado inconsistente; no doy por comprobado un eventual contador de 3 de 2.

### O06 — Etiqueta fija «En 2 cuotas» para un pedido de tres cuotas — baja, VIGENTE

**Pasos:** abrir Lucía en una demo nueva, revisar la tarjeta y el detalle. También aparece en Agenda y el selector del editor.

**Resultado:** la etiqueta dice «En 2 cuotas», mientras el progreso dice «Pagó 1 de 3».

**Esperado:** etiqueta genérica «En cuotas» o número real del pedido. Es un problema de claridad; no confundirlo con el cambio de estado financiero de O05.

## 4. Cobertura ejecutada y resultados

| Área | Qué hice y qué observé | Alcance / resultado |
|---|---|---|
| Pedido manual | Creé QA Clienta con QA manual bufanda por 750 | Guardó el pedido y agregó el producto automáticamente al inventario |
| Editar pedido | Agregué Camisa blanca del inventario al pedido manual | Conservó ambos productos; total 1700 |
| Eliminar pedido | En la continuación abrí el pedido pagado de Rosita, cancelé la confirmación y después confirmé la eliminación | Cancelar lo conservó; confirmar redujo pedidos de 5 a 4 y cobrado de 500 a 0 |
| Cuotas: límites y pago | Resté de 1 a 0 en Lucía, repetí resta en cero y luego sumé hasta 3 de 3 | No bajó de cero; al completar pasó a Pagado y sumó 1400 a Cobrado |
| Cuotas: edición | Reduje de 3 a 2 después de registrar 2 pagos | Falla O05 |
| Producto nuevo con foto | Creé QA producto foto NUEVO por 1234 con PNG, edité a QA foto EDITADO por 1500 y eliminé | Imagen confirmada en la tarjeta; alta, edición y baja realizadas. Foto desde archivo, no cámara física |
| Clientas, primera parte | Creé QA nueva clienta, teléfono 099000001, edité a QA clienta editada y eliminé | Alta, edición y baja realizadas |
| Clientas, continuación | Creé QA Cierre con nota, edité a QA Cierre Editada, reabrí edición y eliminé | Nombre y nota conservados en edición; volvió a la lista de cuatro clientas al eliminar |
| Agenda | Seleccioné días con y sin entregas y plegué/desplegué otras entregas | Interacción funciona; persiste duplicación O02 |
| Agenda: fechas | Leí las tarjetas de las listas generales en la continuación | Fechas visibles: 13, 14, 16 y 19 de noviembre |
| Scroll final de Agenda | Escritorio y viewport interior de 393 × 722 | Última tarjeta alcanzable por encima de navegación |
| Scroll final de Pedidos | Escritorio y viewport interior de 393 × 722 | Última tarjeta alcanzable por encima de navegación |
| Historial | Abrí Todos, Dueña y Socia en la continuación | Abre; cinco movimientos totales, tres de Dueña y dos de Socia |
| Tema | Cambié desde Ajustes, también en la continuación | El texto de la acción alternó entre claro y oscuro y cambió la apariencia |
| Respaldo válido | Exporté, cancelé el borrado, confirmé borrado con doble confirmación y restauré en la primera parte | Comparación exacta: 6 pedidos, 6 productos, 5 clientas e historial previo |
| Borrar todo | Repetí confirmación doble en la continuación | Inicio mostró 0 pedidos, 0 productos, 0 clientas, importes 0 y agenda 0 |
| Respaldos inválidos | Cuatro archivos de control | Dos rechazos correctos; dos variantes destructivas/inconsistentes O04 |

### Evidencia geométrica de scroll responsive

Viewport interior: **393 × 722**, sin desborde horizontal en las dos vistas comprobadas. Alcancé el final real del documento.

- Pedidos: última tarjeta Rosita, Medias lanas, $500; arriba `246`, abajo `397.5`; navegación comienza en `668`.
- Agenda: última tarjeta Lucía, 19 de noviembre, $1400; arriba aproximadamente `280.64`, abajo `405.77`; navegación comienza en `668`.
- El capturador temporal de errores del iframe devolvió `[]` en esas dos comprobaciones.

Esto demuestra acceso al final en esos estados y tamaño, **no** ausencia de superposiciones del botón + en todos los puntos intermedios ni aprobación visual global. La revisión visual de Bianca es independiente y está en `Ropa-Bianca.md`.

## 5. Chequeos técnicos y material temporal

Comandos ejecutados durante la continuación (los paths temporales se abrevian en los comentarios, no en los comandos):

```sh
git status --short
git log -3 --oneline
find . -maxdepth 2 -type f -not -path './.git/*'
node --version
curl --noproxy '*' -fsSL 'https://nicodelos24.github.io/Ropa/?demo=1' -o /tmp/ropa-live-qa.html
sha256sum index.html /tmp/ropa-live-qa.html
```

Resultados: Node `v26.13.0`; descarga correcta; hashes coincidentes; no encontré una suite automatizada en el repo inspeccionado. El HTML descargado se movió luego al directorio temporal de este chat como `live.html`.

Extraje con Python los scripts inline no vacíos del HTML. Se encontró uno. Ejecuté:

```sh
for f in /tmp/apx-scratch-4f023747/th_5a1985d9839647b0/inline-*.js; do node --check "$f" || exit; done
```

**Resultado:** exit 0. Es comprobación sintáctica, no una suite de tests ni aprobación de los flujos.

Directorio temporal de la continuación:

```text
/tmp/apx-scratch-4f023747/th_5a1985d9839647b0/
  live.html
  inline-0.js
  invalido-sintaxis.json
  invalido-sin-pedidos.json
  invalido-estructura.json
  invalido-pedido.json
```

El respaldo válido de la primera parte había quedado registrado como `respaldo-demo-qa.json` bajo ese mismo path. Al retomar, el directorio de esa ejecución anterior no existía; no confundir esa referencia histórica con un archivo todavía recuperable. Este documento conserva los contenidos mínimos de los archivos inválidos para que su reproducción no dependa de temporales.

Los snapshots y resultados originales permanecen en el chat APX. Este Markdown no contiene copias binarias de cada captura de pantalla ni todos los volcados del DOM.

## 6. UNVERIFIED y cómo continuar sin repetir conclusiones falsas

- Teléfono físico, cámara real, permisos nativos, teclado virtual y safe areas.
- Instalación PWA y funcionamiento offline integral.
- Autenticación, permisos, sincronización y persistencia contra Firebase real: deliberadamente fuera del alcance autorizado de esta prueba demo.
- No se ejecutó una suite automatizada del proyecto; solo comprobación sintáctica y los casos manuales descritos.
- No se probaron todas las estructuras JSON inválidas posibles ni todos los tamaños responsive.
- No comprobé si hay un contador superior al total al sumar otra cuota desde el estado O05.
- No hice correcciones ni pedí una segunda ronda por mi cuenta. Alba es la desarrolladora del proyecto; una corrección necesita una nueva revisión solicitada, no cambiar retrospectivamente este veredicto.

**Prioridad para desarrollo:** O04 y O05 primero; O02 después; O03 y O06 como consistencia de demo y textos. O01 ya no es bloqueo en la versión revalidada.

## 7. Copia textual del chat

### Alcance y procedencia de la copia

Recuperé este hilo con la herramienta oficial `apx threads get th_5a1985d9839647b0 --json`, no a partir de los mensajes truncados de `read_chat`. La instantánea contenía **9 registros de mensaje y 11 partes textuales**, incluyendo los avances intermedios de Orion.

Debajo copio **íntegras todas esas partes textuales**, sin resumir ni corregir los informes antiguos. El corte es la solicitud de Nico del 12 de noviembre de 2026 a las 23:42:02 UTC−03 y el registro de ejecución de esa solicitud. La respuesta final que confirma este documento todavía no existía al exportar.

Las fechas son las del registro contenedor de APX, convertidas a UTC−03. APX agrupa varios avances, herramientas y respuesta final bajo un mismo mensaje: la hora del encabezado no significa que todas sus acciones ocurrieran en ese instante. Los dos registros de Orion sin texto se dejan vacíos, como en la exportación. Los registros técnicos de herramientas, planes, autorizaciones y vistas de navegador no son texto conversacional; sus resultados pertinentes están consolidados en las secciones anteriores, y las imágenes no se convierten aquí en una falsa transcripción textual.

---

### 2026-11-12T22:21:08.300000-03:00 — Nico

Probá la app de Ropa en https://nicodelos24.github.io/Ropa/?demo=1 — modo demo con datos de ejemplo, NO toca Firebase ni datos reales. Probá de punta a punta: crear/editar/eliminar pedidos (con productos del inventario y escritos a mano — los manuales deben agregarse solos al inventario), cuotas (+/− hasta pagado), inventario (crear producto NUEVO con foto, editar, eliminar), clientas, agenda (tocar días del calendario, plegar/desplegar otras entregas, scroll hasta el final en agenda y pedidos), historial con filtros, ajustes (tema, respaldo exportar/importar, borrar todo). Objetivo: encontrar dónde se rompe. Reportá cada error con pasos para reproducirlo. No hagas push sin avisar.

---

### 2026-11-12T22:21:08.347000-03:00 — Orion

Ya confirmé que el producto escrito a mano se agrega al inventario y que las cuotas llegan a «Pagado». Sigo con foto, respaldo y los casos de navegación; no estoy modificando código ni publicando nada.

Encontré una rotura clara: **Historial no abre**; tira un error de JavaScript y deja la pantalla anterior. El respaldo sí volvió a cargar los mismos 6 pedidos, 6 productos y 5 clientas después de borrar la demo. Estoy cerrando las pruebas de edición, cuotas y validaciones de importación.

## NEEDS WORK

Probé únicamente el modo demo. **No cambié código ni hice push.** Encontré estas fallas:

### 1. Historial no abre — alta
**Pasos**
1. Abrí la demo.
2. Entrá en **Historial**.

**Resultado:** cambia el subtítulo a «Movimientos de cada cuenta», pero queda el contenido de la pantalla anterior. No aparecen movimientos ni filtros.

**Error capturado:**
```text
Uncaught TypeError: Cannot read properties of undefined (reading 'slice')
index.html:536
```
Los registros iniciales de la demo usan `t`, `tipo` y `d`, mientras el historial espera `ts`, `action` y `detail`. La fecha inválida rompe el renderizado.

### 2. Agenda duplica la entrega seleccionada — media
**Pasos**
1. Entrá en **Agenda**.
2. Tocá el **13 de noviembre**, que tiene la entrega de María Fernanda.
3. Tocá **Ver otras entregas (4)**.

**Resultado:** María Fernanda aparece en el día seleccionado **y nuevamente** entre las otras entregas. Hay otras tres fechas de entrega, pero el botón cuenta cuatro, incluyendo la seleccionada.

### 3. Pedido de ejemplo completamente pagado sigue pendiente — baja, datos demo
**Pasos**
1. Abrí **Pedidos**.
2. Revisá María Fernanda.

**Resultado:** muestra **«En 2 cuotas · Pagó 2 de 2»** y sus $3.200 siguen dentro de «Por cobrar». En cambio, al completar las cuotas del pedido que creé, sí pasó automáticamente a **Pagado**.

Esto hace inconsistente el estado inicial de la demo.

## Lo que pasó
- Crear un pedido manual: se guardó y **agregó automáticamente el producto al inventario**.
- Editar ese pedido y agregarle un producto del inventario: conservó ambos productos y recalculó el total.
- Sumar cuotas hasta **Pagado**; restar estando en cero no produjo cuotas negativas.
- Crear un producto nuevo con una imagen PNG desde archivo, editar nombre/precio y eliminarlo.
- Crear, editar y eliminar una clienta.
- Seleccionar un día de agenda y plegar/desplegar las otras entregas.
- Llegar al final de agenda: la última entrega quedó accesible, por encima de la navegación.
- Cambiar tema desde Ajustes.
- Exportar respaldo, cancelar el borrado, confirmar el borrado y restaurar: **coincidieron exactamente los 6 pedidos, 6 productos y 5 clientas**, además del historial previo.

## UNVERIFIED
La pasada quedó incompleta por el límite de ejecución. No doy por aprobados:
- Eliminar pedidos.
- Restar una cuota ya abonada: ejecuté el clic final, pero no pude comprobar el resultado.
- Scroll hasta el final de **Pedidos**.
- Filtros de historial, bloqueados por la falla de apertura.
- Rechazo de respaldos inválidos o incompletos.
- Cámara física y comportamiento en un teléfono real: probé imagen desde archivo en navegador de escritorio.
- Tests automáticos: no ejecuté una suite.

**No apruebo la app con Historial roto y esta cobertura todavía incompleta.**

---

### 2026-11-12T23:13:51.158000-03:00 — Nico

Terminaste?

---

### 2026-11-12T23:13:51.240000-03:00 — Orion

No terminé toda la prueba de punta a punta: la pasada se cortó por el límite de ejecución.

Ya reporté **3 fallas** y verifiqué los flujos principales. Quedaron pendientes eliminar pedidos, comprobar la resta de una cuota abonada, el scroll final de Pedidos y respaldos inválidos. Los filtros de Historial quedaron bloqueados porque esa pantalla no abre.

**Veredicto actual: NEEDS WORK.** No cambié código ni hice push.

---

### 2026-11-12T23:14:03.526000-03:00 — Nico

Continúa por favor

---

### 2026-11-12T23:14:03.582000-03:00 — Orion

Retomé la demo. Hay una versión más nueva que la de la primera pasada; voy a distinguir qué fallas siguen vigentes y completar los casos pendientes, sin tocar código ni datos reales.

Historial ya abre y los filtros funcionan; también pude eliminar un pedido y probar cuotas de 1 a 0 y luego hasta «Pagado».

Encontré una falla nueva importante: un respaldo mal formado se acepta como válido, reemplaza los datos de la demo y después rompe Inventario. Estoy dejando los pasos exactos y cerrando la cobertura.

**Terminé esta pasada. Veredicto: NEEDS WORK.** Completé los casos pendientes y encontré dos fallas funcionales importantes en la versión actual.

## Fallas reproducibles

### 1. Importar un respaldo inválido reemplaza los datos — alta
**Pasos:**
1. Abrí la demo y entrá en **Ajustes → Importar respaldo**.
2. Importá un `.json` con este contenido:
   ```json
   {"orders":[],"inventory":null,"clients":[],"events":[]}
   ```
3. Entrá en **Inventario**.

**Resultado:** muestra «Respaldo importado ✓», desaparecen los pedidos anteriores y después Inventario no abre:
```text
Uncaught TypeError: Cannot read properties of null (reading 'length')
```

También probé `{"orders":[null]}`: muestra **«Archivo no válido»**, pero igualmente reemplaza el estado anterior: quedaron `orders: [null]`, inventario y clientas vacíos. Después no abre Pedidos.

**Esperado:** validar todo el respaldo antes de reemplazar datos; si falla, conservar lo anterior. Lo comprobé únicamente en la demo, no con datos reales.

### 2. Reducir el total de cuotas no actualiza el estado de pago — alta
**Pasos:**
1. En la demo, abrí el pedido de **Lucía**, que empieza con 1 de 3 cuotas.
2. Tocá **+ Cuota**: queda en 2 de 3.
3. Entrá en **Editar pedido**, cambiá el número de cuotas a **2** y guardá.
4. Volvé a abrirlo.

**Resultado:** muestra **«Pagó 2 de 2»**, pero sigue en cuotas y sus **$1.400 siguen sumando en «Por cobrar»**.

**Esperado:** quedar pagado o impedir el cambio con una validación explícita.

### 3. La etiqueta siempre dice «En 2 cuotas» — baja
El pedido inicial de Lucía muestra **«Pagó 1 de 3»**, pero su etiqueta dice **«En 2 cuotas»**. También aparece así en Agenda y en el editor.

## Lo que quedó verificado
- **Historial ya abre** en esta versión. Los filtros **Dueña** y **Socia** separan correctamente los movimientos.
- Eliminar pedido: cancelar conserva el pedido; confirmar lo elimina y actualiza los totales.
- Cuotas: restar de 1 a 0, no bajar de 0 y sumar hasta **Pagado**.
- Clientas: crear, editar y eliminar.
- Agenda: seleccionar días con y sin entregas, plegar/desplegar y ver las fechas.
- Scroll final de **Pedidos y Agenda**, también en una vista de **393 × 722**: última tarjeta visible por encima de la navegación y sin desborde horizontal.
- Cambio de tema y borrado con doble confirmación.
- JSON ilegible y respaldo sin `orders`: rechazados.
- En la primera parte ya había verificado productos manuales, producto nuevo con foto desde archivo y exportación/restauración válida.

**Chequeo técnico:** `node --check` sobre el JavaScript extraído de la página publicada terminó con **exit 0**. No encontré una suite automatizada en el repo.

**UNVERIFIED:** teléfono físico, cámara real y funcionamiento contra Firebase real — esto último quedó fuera de alcance deliberadamente.

**No cambié código ni hice push.**

---

### 2026-11-12T23:14:32.402000-03:00 — Orion



---

### 2026-11-12T23:42:02.587000-03:00 — Nico

Cuando termines genera un documento llamado Ropa-Orion.md para que tengas toda la memoria de lo que hiciste y toda la copia de este chat por favor

---

### 2026-11-12T23:42:02.629000-03:00 — Orion


---

## Nota de Alba (13/11/2026) — estado al momento de tu revisión extensa

App en v32 (`a65df8f`, demo `?demo=1`). Novedades desde tu última pasada (v30):
- **v31**: chips de estado clicables en el detalle (causa del bug anterior: las clases CSS eran green/orange/blue/yellow de STC, no paid/msg/due/new); sin botones duplicados sobre tarjetas (solo barra superior); escalón 60–110px; íconos circulares; **guard del botón atrás** en los 4 editores con "¿Salir sin guardar?" (pushState/popstate integrado con trapBack en un solo handler).
- **v32**: causa raíz del salto de tarjetas (transform de .sel pisaba translateX) arreglada; cambiar estado pide askConfirm; tema claro persistente (localStorage `ropa_theme`); animaciones aceleradas (rise .18s, fadeUp .1s).
Checklist completa de tu ronda en Orion-Recibe.md (2026-11-13). Yo barrí consola: 0 errores JS en todas las vistas.
