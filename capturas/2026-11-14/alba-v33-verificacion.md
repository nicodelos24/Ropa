# Correcciones de auditoría v32 — entrega local v33

**Alba · 14/11/2026 · commit `26fcf3c` · rama `fix/visual-v32`**

Worktree: `/home/nico/Documents/GitHub/Ropa/.worktrees/fix-visual-v32`.
Base: `77ac0f1` (v32). Caché siguiente preparada: `ropa-v33`.
**Sin integrar a master, sin push y sin publicar. La demo publicada no cambió.**

## Implementación

1. Mi cuenta: envoltorio `.sic` en las dos variantes; también en Mis negocios. Los SVG de botones conservan su tamaño `.ghost` de 17px.
2. Avisos: franja superior con espacio reservado en el layout, fuera del Total/FAB/nav y de los vacíos. Éxitos ocultos visualmente con hoja abierta, manteniendo el live region; errores/advertencias siguen visibles y reservan espacio. La hoja reduce su altura para no quedar debajo de esa franja.
3. Contraste: tinta verde de texto separada del color de fondos (`--accent-text`), tinta oscura en contadores/avatares y cuotas del port de Bianca. No se oscureció el fondo de los botones de acceso.
4. Estados: grilla de dos columnas, área de 44px, check y `aria-pressed`; se conserva la paleta pastel/clases STC vigentes de v32.
5. Foto ampliada: port selectivo de `66541f5`, con diálogo modal, foco inicial a la X, Tab contenido, fondo inerte y devolución del foco/scroll. Se conserva la X circular de v32, ahora con fondo opaco y margen seguro. Las tarjetas disparadoras pueden recibir foco y operarse con teclado.
6. Nav: ancho uniforme con etiquetas separadas en 320. Filtros: scrollbar y texto «Deslizá para ver más estados ↔» sólo si hay overflow. Favicon ICO multiresolución creado desde el ícono existente e incluido en la caché siguiente.

No se portó toda la rama vieja: **no se reemplazaron la confirmación de estados, la distribución/selección fija de tarjetas ni los tiempos rápidos de animación de v32**.

## Verificación ejecutada

- `npm test` → **12/12**, sin fallos. Node + jsdom, sin layout, Firebase simulado y bloqueo de llamadas a colecciones. Ajustes (cuenta con/sin negocio y owner), cancelar/aceptar estado, cuotas con piso cero y pago final, lightbox (X/fondo/Escape/Tab/foco/inert/scroll/duplicados), selección sin cambio de transform, retorno de foco desde inventario, reserva de avisos, pista de filtros, doble confirmación de borrado y favicon/caché.
- `npm run check` → **OK**, sintaxis de script inline, service worker y harness.
- `git diff --check` → **OK**.
- `npm audit --omit=optional` → **0 vulnerabilidades**.
- `curl --noproxy '*' -Is http://localhost:8764/favicon.ico` → **200**, `image/vnd.microsoft.icon`.
- Navegador APX, `http://localhost:8764/tests/visual.html?run=4`: **145/145 comprobaciones OK, 0 errores JS capturados**. Iframe de la app real en `?demo=1`, viewports CSS **320×568, 393×740, 1280×640**, ambos temas. La escala exterior de escritorio permite verlo entero, no modifica el viewport CSS del iframe.

La matriz recorre Ajustes, Pedidos, Contactos, detalle, editor, confirmaciones, cuotas, tres productos, selección fija, foto modal/foco, borrado doble de datos demo, vacío con aviso y favicon. Después inspeccioné en las imágenes del navegador Ajustes/Detalle/Editor/Foto y sus textos. Se agregaron `tests/README.md` y el harness local reproducible al commit; se niega a correr fuera de localhost.

### Contrastes de estilos renderizados

Cálculo WCAG a partir de estilos computados en el navegador, incluyendo composición alfa, fondos de ancestros y `color-mix` (no evaluación de todo el sitio):

| Elemento | Claro, mínimo | Oscuro, mínimo |
|---|---:|---:|
| Estados del detalle | 4,57:1 | 8,42:1 |
| −/+ Cuota | 6,53:1 | 9,52:1 |
| Total verde | 6,79:1 | 10,50:1 |
| Precios del editor, incluidos seleccionados | 5,37:1 | 8,15:1 |
| Contadores e iniciales | 5,02:1 | 6,80:1 |

Sin overflow horizontal en los casos recorridos; iconos de cuenta ≤19px (17px de estilo), etiquetas nav dentro de cada botón, estados `offsetHeight >= 44`.

### Evidencia visual de esta sesión

Snapshots APX vistos en la sesión de entrega (no se exportaron PNG a disco):

- Matriz final: documento `7987472575106173454.12.2`, muestra **145/145 OK · 0 errores JS**.
- Ajustes 320 claro: `7987472575106173454.12.4`.
- Detalle 320 oscuro: `7987472575106173454.12.7`.
- Detalle 393 claro: `7987472575106173454.12.11`.
- Editor 393 claro: `7987472575106173454.12.12`.
- Ajustes 1280 claro/oscuro: `7987472575106173454.12.15` / `.12.17`.
- Foto 1280 oscuro, X con anillo de foco: `7987472575106173454.12.18`.

Las capturas originales de los fallos siguen en esta carpeta, sin modificarlas. Para regenerar las vistas, usar la barra del harness después de **Restablecer demo**.

## Límites

**UNVERIFIED:** teléfono físico, safe areas reales, lector de pantalla completo y actualización del service worker tras despliegue. No se probó ni se tocó Firebase real, cuentas/clientas reales o WhatsApp. No es una revisión funcional general ni cierre de B12. El puerto local de esta sesión es 8764; si el servidor ya terminó, se puede levantar siguiendo `tests/README.md`.
