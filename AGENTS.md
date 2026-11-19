# Ropa — protocolo entre agentes (leer al empezar cualquier tarea)

## ⛔ Repo congelado: versión primaria (19/11/2026)

**Este repo (Ropa v1) es la versión primaria y está CONGELADO por decisión de Nico.** La app quedó terminada y funcionando en https://nicodelos24.github.io/Ropa/; el desarrollo continúa SOLO en la V2 (`archived-Aplicacion-ropa`). No modificar código de la app (`index.html`, `sw.js`, etc.), docs de app ni configuración; no integrar, publicar ni pushear nada acá salvo orden EXPRESA de Nico. Tratar este repo como archivo histórico. Último estado: UX36 final sobre `e7ed7eb`, OK visual de Bianca ([informe](Revision-Bianca-UX36-final-e7ed7eb.md), 22 capturas en `capturas/2026-11-19/bianca-ux36-final/`). Detalle completo en [README.md](README.md).

## Documentación vigente

- **README.md**: descripción del proyecto.
- **INDICE-CAPTURAS.md**: índice único de capturas de Nico, Alba, Bianca y Orion/QA.
- **Revision-Bianca-*.md** y **QA-Orion-*.md**: informes de revisión visual y QA funcional por versión.
- Los hallazgos activos y la decisión de implementar quedan registrados en la tarea correspondiente en APX y en el informe de cada ronda.

## Buzones y documentos Ropa-*.md

Los buzones `Nombre-Recibe.md` / `Nombre-Emite.md` (Alba, Bianca, Orion) y los documentos de memoria `Ropa-Alba.md`, `Ropa-Bianca.md`, `Ropa-Orion.md` **fueron retirados el 2026-11-17 por pedido de Nico**. La comunicación ya no pasa por archivos Markdown en el repo: cada agente reporta en su tarea de APX y sus hallazgos quedan en el informe y el índice de capturas. No crear ni recrear esos archivos; si alguna referencia vieja apunta a ellos, tomar el dato del informe o de la tarea.

## Reglas vigentes

- Nada de contraseñas ni datos de clientas en cualquier archivo del repo.
- Las capturas se guardan en `capturas/AAAA-MM-DD/` y se enlazan desde `INDICE-CAPTURAS.md`; no borrar evidencia histórica.
- Los cambios de código se hacen en worktrees bajo `.worktrees/` con ramas nombradas, no directo en master; no hacer push sin avisar a Nico.
