# QA funcional independiente — UX35 `cd851c7`

Fecha: 2026-11-14. Pedido de Bianca para la nueva revisión extensa de Nico.

**Veredicto funcional: NEEDS WORK.** Los cuatro escenarios originales mejoraron y pasan sus casos específicos, pero quedan **cuatro hallazgos** en el parser/validación y labels dentro del alcance solicitado. Esta pasada no reemplaza ni cierra la revisión visual.

## Base verificada y método

- Worktree `/home/nico/Documents/GitHub/Ropa/.worktrees/ux-v34`, rama `feat/ux-v34`.
- HEAD al inicio y cierre: `cd851c7f9892b441feff1538c75192f357deff38`.
- SHA-256 de `index.html`: `0e12fd1405d5055e20cbf687a64c95f71f4b40a8e311ea2bf1a06b3ce53f1519`.
- `git status --short` vacío en ese worktree antes y después. No edité app, tests del proyecto ni configuración; sin commits/publicación.
- Leí `AGENTS.md`, última entrega del buzón de Alba (retirado 17-11, ver informe actual) y diff `0bc1a40..cd851c7`.
- La carpeta temporal anterior estaba vacía; recreé un harness independiente de **60 pruebas** con jsdom instalado en el worktree. Instancia aislada por prueba, HTML y script reales, eventos de input/click reales, inspección de objetos y `localStorage`. Capturo errores de ejecución mediante `VirtualConsole`, además de aserciones de datos.
- Firebase simulado sin acceso a colecciones; sólo fixtures demo y nombres sintéticos. Para adjuntar foto simulo únicamente `compressPhoto` con una imagen sintética; el callback del editor, sus handlers, Cancelar/Guardar y persistencia son originales.

## Comandos y resultados

Desde `.worktrees/ux-v34`:

```bash
npm test
npm run check
git diff --check
node --test /tmp/apx-scratch-4f023747/th_9f4ae5e0addf43aa/ux35-independent.test.cjs
```

| Control | Resultado |
|---|---|
| Suite del proyecto | **23/23 PASS**, exit 0 |
| Sintaxis de index.html, sw.js y visual harness | **OK**, exit 0 |
| Whitespace del worktree y diff comprometido `0bc1a40..cd851c7` | **OK**, exit 0 |
| Regresión independiente | **60 tests; 44 PASS, 16 FAIL**, exit 1 |

Los 16 FAIL no son 16 problemas distintos: **4** combinaciones reproducen excepción al validar manual, **3** entrada inválida manual guardada en cero, **8** formatos malformados aceptados (4 entradas × 2 formularios), **1** label roto. No hubo fallos de infraestructura ni errores del harness en la ejecución final. Los errores `d is not defined` provienen del handler de la app y se capturaron con el clic real de Guardar.

## Hallazgos reproducidos

### Q35-01 — Guardar pedido con precio decimal lanza excepción y no presenta la validación prometida

**Prioridad alta — flujo de validación roto; no se creó pedido en estos casos.**

Reproducción:
1. Nuevo pedido → Escribir a mano → Agregar producto.
2. Nombre `QA Producto`, precio `1.200,50`; completar cliente sintético.
3. Guardar pedido.

Resultado: **`Uncaught [ReferenceError: d is not defined]`**. El pedido no se guarda, pero tampoco hay `.ferr` ni `aria-invalid=true` en el campo. También lo reproduje con `1200,50`, `12.50` y `1,2,3`. No confundir el borde previo de `.ppbad` con el error asociado que el guardado intentaba generar.

Causa observada: `index.html:1380`, `const bad=d.querySelector(".pp.ppbad")`; no existe `d` en el ámbito de `openEditor()`. Es una rama agregada en `cd851c7`, no una falla de jsdom. Esperado: rechazo explícito con mensaje asociado al precio, sin excepción.

El caso equivalente **en Inventario sí funciona**: `1.200,50` conserva el precio original y el JSON intactos, `aria-invalid=true` y mensaje `Los precios van en pesos enteros, sin decimales`.

### Q35-02 — Precio manual inválido se guarda como $0 sin advertencia

**Prioridad alta — integridad monetaria.**

Reproducción: mismo alta manual anterior, precio `abc` → Guardar. Repetido con `-10` y `1e3`.

Resultado en los tres: se crea un pedido nuevo, se persiste el ítem con **`price:0`**, sin `.ferr`, sin `aria-invalid` ni error JS. `parseMoney()` sí devuelve `{num:null,frac:false}`, pero el handler convierte a cero y sólo usa `frac` para marcar error.

Ubicación: `index.html:1329`, `r.price=m.frac||m.num==null?0:m.num; r.bad=m.frac`. Esperado: diferenciar cero válido de entrada inválida y bloquear guardado de esta última. En Inventario esas mismas tres entradas se rechazan correctamente con `Escribí un precio válido`.

### Q35-03 — El parser todavía reinterpreta puntos malformados silenciosamente

**Prioridad alta — integridad monetaria, mismo comportamiento en Inventario y Pedido.**

En cada formulario ingresé/guardé estas cuatro entradas:

| Entrada inválida | Número efectivamente guardado |
|---|---:|
| `1.2.3` | 123 |
| `12..00` | 1200 |
| `12.3456` | 123456 |
| `..` | 0 |

Resultado: ocho guardados aceptados, JSON con esos valores, sin mensaje asociado. Para `12..00` el producto de prueba ya valía 1200: el fallo se prueba por éxito/cierre y ausencia de rechazo, no por una supuesta diferencia de valor inexistente.

Ubicación: `index.html:598–615`, fallback de `parseMoney()` borra todos los puntos cuando no matchea ni miles ni decimal corto. Esperado: rechazar formatos que no cumplan la gramática admitida; no concatenar dígitos de entradas malformadas. El patrón general de borrar puntos existía antes, pero **el nuevo parser no cierra ese riesgo ni cumple su comentario de nunca reinterpretar en silencio**. No lo presento como un error enteramente nuevo de datos de esta versión.

### Q35-04 — Label Categoría no referencia ningún control

**Prioridad baja — asociación accesible incompleta, no rompe guardado.**

Reproducción: Editar/Nuevo producto; inspeccionar `label[for="inv-cat"]`.

Resultado: **`label.control === null`**, porque no existe `id="inv-cat"`; los nueve botones están en `#seg-cat`. La categoría tampoco tiene un grupo accesible asociado a ese texto en el markup actual. `index.html:998`. Esperado: asociación efectiva de la leyenda al grupo/control, no sólo atributo `for` sin destino. No es una conclusión de contraste o apariencia.

## Lo que sí funciona en esta pasada

### Homónimos y mixtos

- Dos manuales `Remera` $100/$200 → preview **$300**, contador **2 productos**, dos ítems en objeto y JSON. Alterné pestañas y guardé desde **inventario y manual** en instancias separadas.
- Tras recargar el estado desde JSON, reabrí y volví a guardar: siguen ambas filas, precios distintos y total $300. El fallo F1 anterior no se reprodujo.
- Mixto con Medias lanas 2 × $250 + Vestido floral $1200 + manual `QA Gratis` $0: tres ítems, cantidad 2, total **$1700** y cero conservados al guardar desde ambas pestañas y reabrir.

### Parser: formatos que sí pasan

Probé por guardado real en **ambos formularios** (20 pruebas):

| Entrada | Guardado |
|---|---:|
| `0`, vacío, sólo espacios, `000` | 0 |
| `  $ 1.200  ` | 1200 |
| `12.500` | 12500 |
| `1.200.000` | 1200000 |
| `1 200` | 1200 |
| `1200,00` | 1200 |
| `12.00` | 12 |

La aceptación de fracción **cero** es el comportamiento observado: conserva un valor entero. No la cuento como fallo por sí misma. La definición estricta de si se admite esa notación corresponde a producto.

Inventario rechaza sin mutación/almacenamiento los siete casos `1.200,50`, `1200,50`, `12.50`, `abc`, `-10`, `1e3`, `1,2,3`, mostrando error asociado. El viejo F2 concreto `1.200,50 → 120050` está resuelto en Inventario; no implica que toda la validación monetaria esté resuelta.

### Fotos

- Producto existente: quitar o adjuntar **no cambia el original antes de Guardar**.
- Las cuatro combinaciones quitar/adjuntar × Cancelar/Guardar pasan. Cancelar conserva la foto original aun tras ejecutar otro `save()`; Guardar persiste el cambio; JSON recargado y editor reabierto concuerdan. `edDirty` pasa a true al quitar/adjuntar.
- Al adjuntar, aparece Quitar de inmediato en DOM; no certifico su apariencia.
- Fila manual: adjuntar/cambiar/quitar foto conserva la fila. Cambia aria-label a `Cambiar foto del producto 1`; aparece el botón Quitar foto; re-adjuntar/guardar/reabrir conserva imagen.
- Pedido con foto propia distinta del inventario: usa la propia en detalle y miniatura, y sigue mostrándola tras borrar el producto con la confirmación real. Pedido y JSON conservan `item.photo`. El viejo F4 no se reproduce.
- Pedido histórico sin `item.photo`: fallback a foto del inventario correcto.

### Búsqueda, fecha y labels

- Inventario con **90 productos**: todos accesibles en picker; búsqueda en vivo ` qa producto 85 ` encuentra el último (trim y mayúsculas/minúsculas).
- Consulta sin resultados mantiene el buscador; vaciar vuelve a 90; selección del último persiste al filtrar, alternar modos y guardar pedido. No hubo excepciones.
- Historial: hoy figura `Hoy`; mismo día de otro mes no; mismo día/mes del año anterior muestra **2025**, no Hoy. Se usó fecha actual del sistema, 14 nov 2026.
- Fecha preset `2027-01-09` conserva valor al guardar, recargar JSON y reabrir pedido.
- Labels de campos en Pedido, alta/edición de Contacto y renderizado de login/signup/reset/completar/cambio de contraseña resuelven a sus controles. Filas manuales tienen nombres/precios numerados correctos. Sólo inspeccioné formularios de autenticación, sin escribir credenciales ni ejecutar login/cambio de contraseña.
- Producto mantiene sus nueve botones de categoría; no se perdieron en este cambio. La asociación de su leyenda es el hallazgo Q35-04.

## Evidencia técnica

Carpeta `/tmp/apx-scratch-4f023747/th_9f4ae5e0addf43aa/`:

- `ux35-independent.test.cjs`, harness independiente reconstruido. SHA-256 **`1699a99c32b16468e4989f0554b716cdd98f246aea97210ee0c00c1d0d53bcd9`**.
- `ux35-independent.tap`, ejecución final 60/44/16, diagnósticos de precios, ítems, errores JS y labels.
- `ux35-suite.log`, suite existente 23/23.
- `ux35-check.log`, sintaxis OK.

Ejemplos de diagnósticos finales:

```text
manual 1.200,50: newOrders=0, savedItem=null,
 errors=["Uncaught [ReferenceError: d is not defined]"], fieldInvalid=null
manual abc: newOrders=1, savedItem={name:"QA Producto",price:0,qty:1,photo:null},
 errors=[], fieldInvalid=null
inventory 1.2.3: parsed={num:123,frac:false}, savedPrice=123, fieldInvalid=null
inventory labels: invalid=[{text:"Categoría",for:"inv-cat"}]
```

## Límites y responsabilidad

- No abrí navegador en esta pasada; **no hay validación visual, capturas, viewport, contraste, overflow real, foco/lector o teclado móvil**. La prueba de nombres largos de la suite existente se ejecuta en jsdom sin layout: su PASS no acredita ausencia de desborde en pantalla ni cierra UX35-08.
- Cámara/galería y decodificación/compresión de imágenes reales: **UNVERIFIED**, se simula sólo el compresor. Historial back/confirmación de descarte no fue parte de la matriz nueva; sí Cancelar explícito y estado persistido.
- Recargué JSON en memoria para probar persistencia; no hice navegación completa demo (su arranque regenera fixtures).
- Nube/Firebase, sincronización, eliminación remota de fotos, datos reales, WhatsApp y versión publicada: **UNVERIFIED / fuera de alcance**. Probé los archivos de `cd851c7`, no atribuyo estos resultados a producción.
- Implementación de correcciones corresponde a Alba (`5938bef9347d-developer`), no hice fixes. Decisión de integración/publicación a cargo de quien lleva la entrega; revisión visual sigue con Bianca.
