# Revisión UX/UI de Ropa v33 → propuestas v34

Bianca · 14 de noviembre de 2026 · tarea `task_13ee081695514dfb`.

## Entrega y versión

- **Lista accionable:** entrada «Mejoras UX/UI de v33 para v34» en `Revision-Bianca-UX35.md`, IDs **UX34-01–17**: 5 P1, 9 P2 y 3 P3. Incluye ubicación, motivo, CSS/copy y criterios para los cambios críticos.
- **Base:** master `3e48d0d` (integración de la corrección visual v33); demo pública `https://nicodelos24.github.io/Ropa/?demo=1`. `sw.js` público leído antes y después de la continuación: **`ropa-v33`**.
- **Sin implementación:** no modifiqué `index.html`/`sw.js`, no hice commit, merge, push ni publicación. Las propuestas NO certifican que la implementación v34 en curso ya las cumpla.
- **Evidencia:** 43 PNG de navegador, conservados en esta carpeta. Los mosaicos muestran iframes de la app real, no diseños inventados. Viewports internos 320×568, 393×700 y 1280×640; escritorio reescalado únicamente para entrar en la lámina. Algunas capturas iniciales individuales tienen mayor alto visible. Son emulaciones de viewport de escritorio, no teléfonos físicos.
- Solo datos demo descartables e imagen sintética. Sin datos reales de clientas ni mensajes enviados.

## Qué funciona y debe conservarse

La identidad/paleta y las tres columnas de Inventario. Selección de tarjetas sin el salto que se había corregido; barra de editar/borrar/cerrar visible; lightbox con cierre y foco; legibilidad de estados del detalle, cuotas y Total. Los tintes azul/coral de editar/borrar sí se ven. Agenda ya no presenta FAB en v33: no trasladar automáticamente ese hallazgo antiguo a esta vista.

Las siete vistas principales se recorrieron en claro/oscuro a 320/393/1280, sin desbordamiento horizontal de documento en las matrices observadas. Hay problemas de contenido dentro de tarjetas y superposición del FAB aunque el documento no desborde: no son equivalentes.

## Qué falla / qué conviene mejorar

### P1: 01–05

- **01 · Confianza en el total:** inventario $1.200 + manual $300 → volver a inventario deja Total $1.200; guardar/reabrir muestra $1.500 y conserva ambos productos. No reporto pérdida de productos: reporto discrepancia entre importe mostrado y guardado. La función de total debe usar la misma selección unificada que guardar.
- **02 · Acceso:** FAB sobre acciones de Contactos, con intersecciones medidas de 1.298px² en 320 y 902px² en 393. Más padding final permite apartar la última tarjeta, pero no elimina la superposición durante el scroll. Propuesta: alta contextual en cabecera, misma identidad visual.
- **03 · Lectura en claro:** filtros de estado 2,34:1 inactivos / 2,47:1 activos; nav activo 3,20:1; error de producto 2,06:1. Medición de color computado/fondo, no una evaluación global de WCAG. Separar tintas de texto de acentos decorativos. Estos controles son distintos de los estados del detalle corregidos en v33.
- **04 · Tarjetas estrechas:** cuatro productos en 320 dan ancho de tarjeta 74px; tres dan 134px. En cuatro, miniatura y padding dejan texto excesivamente comprimido/desbordado. Mantener cascada y selección fija, pero imponer ancho mínimo útil y recorrido explícito.
- **05 · Foto manual:** botón de cámara 16×39px y SVG 0×0 en la pasada inicial y los cruces añadidos. Debe tener caja e ícono propios, sin compresión flex ni opacidad .35.

### P2: 06–14

Alinear header/nav con columna de escritorio; reducir cabecera sticky de listados; unificar cierre/scroll y pie de las hojas sin obstruir contenido; priorizar Nombre/Precio en alta de producto; vacíos con salida contextual; alta de Agenda junto al día; jerarquía monetaria de Inicio; distinguir «Pagados» de «entregados» en Contactos; confirmación neutral para cambios normales de estado.

### P3: 15–17

Completar familia SVG sin cambiar identidad; separar precio/categoría y truncado en Inventario manteniendo tres columnas; limpiar Ajustes y unificar voseo/formato regional de importes.

La especificación concreta está en el buzón de Alba, no repetida aquí en su totalidad. Implementación: Alba (`5938bef9347d-developer`). Regresión funcional de importes y persistencia: Orion (`5938bef9347d-qa-engineer`). No pedí otra ronda para completar esta entrega.

## Cobertura con enlaces

Los archivos de esta tabla están junto a este índice.

### Siete vistas · matriz 320 / 393 / 1280

| Vista | Claro | Oscuro |
|---|---|---|
| Inicio | [Matriz](ux-v33-inicio-claro-matriz.png) | [Matriz](ux-v33-inicio-oscuro-matriz.png) |
| Pedidos | [Matriz](ux-v33-pedidos-claro-matriz.png) | [Matriz](ux-v33-pedidos-oscuro-matriz.png) |
| Inventario | [Matriz](ux-v33-inventario-claro-matriz.png) | [Matriz](ux-v33-inventario-oscuro-matriz.png) |
| Contactos | [Matriz](ux-v33-contactos-claro-matriz.png) | [Matriz](ux-v33-contactos-oscuro-matriz.png) |
| Agenda | [Día vacío y próximas](ux-v33-agenda-dia-vacio-claro-matriz.png) | [Matriz](ux-v33-agenda-oscuro-matriz.png) |
| Historial | [Matriz](ux-v33-historial-claro-matriz.png) | [Matriz](ux-v33-historial-oscuro-matriz.png) |
| Ajustes | [Matriz](ux-v33-ajustes-claro-matriz.png) | [Scroll inferior](ux-v33-ajustes-abajo-oscuro-matriz.png) |

### Hojas · matriz completada sin repetir los cruces previos

| Hoja / estado | Claro | Oscuro |
|---|---|---|
| Alta de pedido · inventario | [320/393/1280](ux-v33-alta-pedido-claro-matriz.png) | [320/393/1280 añadido](ux-v33-extra-pedido-inventario-oscuro-matriz.png) |
| Alta de pedido · manual | [320/393/1280 añadido](ux-v33-extra-pedido-manual-claro-matriz.png) | [320/393/1280](ux-v33-pedido-manual-oscuro-matriz.png) |
| Alta de producto | [320/393/1280](ux-v33-alta-producto-claro-matriz.png) · [393](ux-v33-alta-producto-claro-393.png) | [320: validación](ux-v33-producto-error-oscuro-320.png) · [393/1280 añadido](ux-v33-extra-producto-oscuro-393-1280.png) |
| Alta de contacto | [393](ux-v33-alta-cliente-claro-393.png) · [320/1280 añadido](ux-v33-extra-cliente-claro-320-1280.png) | [320](ux-v33-alta-cliente-oscuro-320.png) · [393/1280 añadido](ux-v33-extra-cliente-oscuro-393-1280.png) |
| Detalle con tres productos | [393](ux-v33-detalle3-claro-393.png) · [320/1280 añadido](ux-v33-extra-detalle3-claro-320-1280.png) | [320/393/1280 añadido](ux-v33-extra-detalle3-oscuro-matriz.png) |
| Detalle con cuatro productos | No completado en esta ronda | [320](ux-v33-detalle4-oscuro-320.png); 393/1280 no completados en esta ronda |

Los cruces añadidos de hojas no mostraron overflow horizontal de documento; anchos internos medidos de hoja: 305 / 378 / 560px. Cámara manual sigue con SVG de ancho 0. En detalle de tres productos se midieron tarjetas de 134 / 222 / 304px para 320 / 393 / 1280. Se editaron y guardaron selecciones demo para abrir detalles; no equivale a una regresión funcional completa de edición/persistencia.

### Flujos, vacíos y pruebas focales

| Contexto | Evidencia |
|---|---|
| Pedido mixto: Total antes de guardar, 393 | [Antes](ux-v33-total-mixto-antes-393.png) |
| Pedido mixto: Total tras guardar/reabrir, 393 | [Después](ux-v33-total-mixto-despues-393.png) |
| Pedido mixto: antes, matriz | [Matriz](ux-v33-total-mixto-antes-matriz.png) |
| Pedido mixto: después, matriz | [Matriz](ux-v33-total-mixto-despues-matriz.png) |
| Confirmación de cambio de estado, oscuro 320 | [Diálogo](ux-v33-confirmacion-oscuro-320.png) |
| Editar contacto, claro 320 | [Formulario](ux-v33-editar-cliente-claro-320.png) |
| Ficha de contacto, oscuro 393 | [Ficha](ux-v33-ficha-contacto-oscuro-393.png) |
| Imagen sintética ampliada, oscuro 393 | [Lightbox](ux-v33-foto-sintetica-oscuro-393.png) |
| Inicio vacío, claro 320 | [Vacío](ux-v33-inicio-vacio-claro-320.png) |
| Inventario vacío, oscuro 393 | [Vacío](ux-v33-inventario-vacio-oscuro-393.png) |
| Búsqueda sin coincidencias, claro 393 | [Sin resultados](ux-v33-sin-resultados-claro-393.png) |
| Inicio, claro 393 | [Vista individual](ux-v33-inicio-claro-393.png) |
| Escritorio, claro 1280 | [Desalineación de cabecera/nav](ux-v33-escritorio-claro-1280.png) |

## Límites explícitos

1. **Detalle con cuatro productos:** verificado aquí en oscuro 320. No cierro la matriz claro 320/393/1280 ni oscuro 393/1280. Tras exportar la séptima matriz adicional APX se reinició; la pestaña devolvió `unknown tab t1`. Reabrí la demo y confirmé que seguía en `ropa-v33`. La evaluación para los últimos cruces **no se ejecutó**: `the owner did not answer in time`. No repetí esa llamada ni eludí la autorización. El PNG de detalle de tres productos claro 320/1280 sí había quedado escrito y fue leído después del reinicio.
2. **No teléfono físico, teclado virtual, safe areas reales, lector de pantalla completo ni fotos reales.** No se valida desde una captura la operación con lector ni el tamaño físico de una diana táctil.
3. Sin validación de cuentas/nube, envío de WhatsApp, respaldo integral ni caché después de desplegar v34. El recorrido no constituye aprobación de seguridad ni QA funcional integral.
4. **OK de v33 anterior ≠ esta revisión de mejoras:** el OK previo era de seis correcciones puntuales. Esta entrega amplía el alcance; contiene fallas reproducibles y propuestas que deben priorizarse sin deshacer las decisiones de Nico.
