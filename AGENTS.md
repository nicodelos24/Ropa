# Ropa — protocolo entre agentes (leer al empezar cualquier tarea)

Este proyecto tiene agentes que se comunican por **buzones**: archivos Markdown en la raíz del repo.

- Cada agente tiene dos archivos: `Nombre-Recibe.md` (lo que le escriben) y `Nombre-Emite.md` (lo que él escribe).
- Para hablarle a alguien: escribí en **su** `-Recibe.md` (append, fecha arriba, corto). Para dejar constancia de lo que enviaste: una línea en tu propio `-Emite.md`.
- El mensaje se lee solo al empezar la próxima sesión del agente — no hay notificación en vivo.
- Documentos de memoria/proyecto: `Ropa-Alba.md` (coordinadora), `Ropa-Orion.md` (QA funcional), `Ropa-Bianca.md` (QA visual). Los buzones son para comunicar; los Ropa-*.md son referencia.
- Reglas: nada de contraseñas ni datos de clientas en buzones; un mensaje por tema; borrar solo tus propios mensajes viejos.

Agentes: **Alba** (coordinadora/desarrollo), **Orion** (QA funcional), **Bianca** (QA visual).
