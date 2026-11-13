# Ropa — Memoria de Alba (coordinadora del proyecto)

Última actualización: 13/11/2026, rondas BV-13 + R23 + pedido directo de Nico implementadas (cache `ropa-v28`, hasta `97c5f80`).

## Qué es Ropa

PWA mobile-first para venta de ropa por catálogo, evolucionando a SaaS multi-tenant:
- **Dueño de la app (Nico)** vende la app a negocios (clientas). Cada negocio tiene una admin (la clienta) y vendedoras invitadas con códigos.
- **App de un solo archivo**: `index.html` (~1600 líneas, vanilla JS) + `manifest.json` + `sw.js` + íconos.
- **Firebase** (compat CDN v10.12.2, proyecto `ropa-e7ba3`): Auth email+contraseña + Firestore.

## Cómo operar (comandos y rutinas)

```bash
# servidor local de pruebas
python3 -m http.server 8741 --directory /home/nico/Documents/GitHub/Ropa
# curl SIEMPRE con --noproxy '*'; usar http://localhost:8741 (127.0.0.1 falla)

# publicar
git add -A && git commit -m "..." && git push   # GitHub Pages publica solo

# al cambiar algo visible: bumpear cache en sw.js → const CACHE = "ropa-vNN"
# ACTUAL: ropa-v20
```

- **URL real**: https://nicodelos24.github.io/Ropa/
- **Modo demo (para probar sin tocar Firebase)**: `?demo=1` al final de la URL. Sesión local con datos de ejemplo, `FB.perfil.demo=true`, `pushNow()` no envía nada a la nube. USAR SIEMPRE ESTE MODO PARA QA.
- Probar en navegador headless APX: los `evaluate` a veces dan timeout — reintentar (funciona a la 2ª/3ª). Los `confirm()` nativos se auto-descartan.
- El modelo cambia de vez en cuando: **este documento + Ropa-Orion.md + Ropa-Bianca.md** son la memoria. Releerlos al retomar.

## Arquitectura rápida

- **Roles**: `owner` (Nico, panel de negocios), `admin` (clienta), `user` (vendedora). Perfil en `usuarios/{uid}`.
- **Datos del negocio**: `negocios/{org}/datos/main` = documento único con `{orders,inventory,clients,events,log,users,prefijo,theme}`.
- **Fotos**: fuera del doc principal, en `negocios/{org}/fotos/{idProducto}` (un doc por foto). En el doc principal queda solo `photo:true` como marca. Al cargar, se reúnen (onSnapshot + get de fotos). localStorage guarda fotos si entra; si excede cuota, guarda sin fotos y las recupera de la nube.
- **Códigos**: colección `codigos/{CODIGO}` (el código ES el id, no se pueden listar). `tipo:'admin'|'user'`, `negocioId`, `usado`. Reglas Firestore las protegen (Nico ya las publicó, incluido el bloque `match /fotos/{f}`).
- **Sync**: last-write-wins del documento entero. OK para pocas vendedoras; a futuro migrar pedidos a docs individuales si escala.
- **Alta**: registrarse (nombre/email/pass) → pantalla "completar" pide código UNA vez → valida contra `codigos` vía reglas con campo `claim` → doc usuarios. Owner se registra con la clave secreta de `config/boot` (`ownerTaken` cierra el registro).
- **Google sign-in**: deshabilitado (GOOGLE_ON=false) — el popup funciona pero la sesión no sobrevive por cookies de terceros. Email+contraseña es el camino.

## Estado actual (v20, commit 5fbf954)

Todo esto está hecho y probado:
- Seguridad: códigos no enumerables, sin auto-promoción de roles, XSS blindado (esc() en todo dato de usuario, fotos como dataURL escapadas en atributos), filete anti-crash en render() (si una vista explota muestra aviso, no se queda la vista anterior).
- UI/UX: turquesa global (#14c2ae/#3fe0cd oscuro, #0aa695 claro), azul solo en nav activa (pastel #9db8ff/#6b8af0) y contorno del día del calendario, íconos SVG con pastel por sección (menta/verde agua/ámbar/celeste/rosa/lila), animaciones (rise en inicio, fadeUp discreto 0.18s resto), scroll completo (body min-height + espaciador ::after de 150px), contraste AA en texto sobre color (texto oscuro sobre fondos vivos), main y hojas limitadas a 560px en escritorio.
- Flujos: producto nuevo guarda a la primera con foto (foto se muestra en el formulario sin reabrir); pedidos mixtos (inventario + a mano) funcionan de verdad — al cambiar de pestaña "Del inventario"↔"Escribir a mano" la selección viaja con vos (bug corregido el 13/11: antes el cambio de pestaña descartaba lo seleccionado); productos manuales se agregan solos al inventario (con foto); cuota +/− hasta Pagado; editar cuotas hacia abajo recalcula estado a Pagado si ya cubre; respaldos con validación integral (rechaza inválidos SIN tocar los datos; acepta válidos); búsqueda distingue "sin resultados" de "vacío"; accesos de Inicio con filtro real (Cobrado→Pagados) y tarjetas abren detalle; agenda sin duplicar el día seleccionado en "otras entregas"; etiqueta de estado genérica "En cuotas"; cliente conocido autocompleta teléfono; WhatsApp con prefijo.
- Historial: log con autor (who), filtros por autor, tolerante a datos raros.
- Ajustes: tema, prefijo país, respaldo exportar/importar, borrar todo, instalar PWA.

## Hallazgos pendientes (de Ropa-Orion.md y Ropa-Bianca.md)

Cerrados: O01–O06, B01–B11, B13, la ronda BV-13 (BV-13-01 a BV-13-05) y sus regresiones R23-01 a R23-06 (SVG WhatsApp 21px, askConfirm versionado con foco seguro e inercia, errores inline con fieldErr + toasts err/warn, "Sin WA" abre editor, scroll de hoja nueva arriba, X sticky 44px). Ya no queda ningún `confirm()` nativo en la app. Además: detalle del pedido sin hero fijo — tarjetas horizontales que se resaltan al 1er toque y se amplían al 2º (mostrando la foto del producto adentro); guardado de pedido SIEMPRE une inventario+manual (no depende de la pestaña activa); quitar foto de producto borra también el doc de la nube (`pushNow._p`); íconos SVG en cámara/galería/ajustes/cuentas; tintes sutiles azul (editar) y coral (eliminar) en botones ícono.

**Importante al tocar askConfirm o modales:** vive en `askConfirm()` (~línea 490), usa contador de instancia (`askN`) + `covHideT` para que el cierre de un diálogo no oculte al siguiente — no quitar eso: Bianca encontró esa regresión (R23-02).

**Abiertos (baja prioridad o requieren a Nico):**
1. **B01 parcial**: el botón + sigue superponiéndose visualmente con tarjetas en Pedidos/Inventario (patrón FAB estándar; si molesta, alternativas: botón al final de cada lista o miniaturizarlo).
2. **B10 parcial**: topbar y nav siguen a ancho completo en escritorio (main y hojas ya limitados a 560px).
3. **B12 (P3)**: unificar íconos emoji restantes (categorías de producto 👗👚 etc.) con SVG, y acentos por sección en subtítulos de vista.
4. **Cámara en teléfono físico** (Orion UNVERIFIED): el fix del congelamiento (objectURL en compressPhoto) solo se verificó en escritorio. Nico tiene que probar en su teléfono. Si vuelve a congelar: sospechar del canvas con fotos de alta resolución → bajar MAX de 480 o usar createImageBitmap.
5. **Firebase real con usuarios de prueba**: crear negocio + códigos desde el panel del owner y probar alta admin/vendedora de punta a punta en la app real (no demo). Nico borra los datos después.
6. **Futuro** (no urgente): sync last-write-wins a docs individuales por pedido si escalan vendedoras; límite ~25.000 fotos con Firestore (1GB Spark); renombrar negocio; desvincular teléfono sin perder cuenta.
7. **BV-13 pendiente de QA**: Orion debe revalidar regresiones (eliminaciones, respaldo con confirmación nueva, cuotas) y Bianca debe revisar visualmente lo implementado — ver buzones.

## No romper / no olvidar

- **NUNCA** pushear sin avisar a Nico. Commit sí, push con aviso.
- Al tocar index.html: `node -e "new Function(require('fs').readFileSync('index.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1])"` para validar JS antes de commit.
- Al tocar algo visible: bumpear `ropa-vNN` en sw.js (ahora v20 → v21, etc.).
- El deploy es automático tras push a master (GitHub Pages) — lo que se pushea queda vivo al instante para todos los usuarios.
- Reglas Firestore ya publicadas con el bloque `fotos` — no tocar sin avisar a Nico (ellas son la seguridad).
- La clave secreta del owner NO está en el repo (vive en `config/boot` en Firestore). No pedirla ni guardarla.
- Emails de usuarios y datos de clientas: nunca a repos ni docs.

## Cómo probar rápido (checklist de humo en demo)

1. `?demo=1` → Inicio carga con datos, saludo con nombre, tarjetas SVG con pastel.
2. Pedidos: crear pedido mixto (1 del inventario + 1 manual con 📷) → toast "Guardado ✓ · 1 producto al inventario"; reabrir → modo inventario con ambos marcados; + Cuota hasta "Pagado".
3. Inventario: crear producto nuevo con foto → aparece sin reintentar; editar y borrar.
4. Clientas → Historial: abre con movimientos, filtra por Dueña/Socia.
5. Agenda: tocar día con entrega, ver fecha en tarjeta, "otras entregas" sin duplicar el día; scroll al fondo se ve completo.
6. Ajustes: tema claro/oscuro cambia todo (y el texto del botón), exportar respaldo → borrar todo → importar respaldo → todo vuelve.
7. Consola sin errores JS.

## Pruebas de esta última ronda (13/11, hechas por Alba)

En demo: flujo pedido mixto, cuotas, historial con filtros, agenda completa (meses, días, plegado, fechas), respaldos (4 inválidos rechazados sin perder datos, 1 válido importado), búsqueda sin resultados, tema claro/oscuro, accesos de Inicio. Cero errores JS. Encontrado y corregido en esta ronda: el pedido mixto perdía lo seleccionado del inventario al cambiar a "Escribir a mano" (solo guardaba lo manual). Re-test: pedido con 2 del inventario + 1 manual guardó los 3 productos, total correcto, el manual fue al inventario con toast. Falta: teléfono físico (cámara) y Firebase real (alta de usuarios) — ver pendientes arriba.
