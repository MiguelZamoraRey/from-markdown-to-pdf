# Markdown a PDF

Aplicación web para convertir Markdown en PDF directamente en el navegador. Pegas o
escribes Markdown en el panel izquierdo, ves la maqueta del resultado en el derecho y la
exportas a PDF con las opciones de tipografía y color de destacado que elijas. Está
pensada para quien necesita documentación, apuntes o informes con un PDF limpio sin
depender de servicios online: el contenido nunca sale de tu equipo.

## Requisitos

- Node.js 20+ y pnpm.
- Un navegador con diálogo de impresión (para la exportación a PDF).

## Comandos

- `pnpm dev` — servidor de desarrollo de Astro.
- `pnpm test` — tests unitarios (Vitest) de la lógica pura.
- `pnpm check` — comprobación de tipos (`astro check`).
- `pnpm build` — build de producción de Astro.
- `pnpm preview` — sirve el build de producción.

## Privacidad

La conversión y la exportación ocurren por completo en tu navegador: no hay backend ni
peticiones de red que lleven tu documento a ningún sitio. La única excepción son las
**imágenes remotas**: si tu Markdown referencia una imagen por dirección (`https://…`), el
navegador la descarga desde su origen para mostrarla en la vista previa y en el PDF; el
documento en sí nunca se envía. Las imágenes incrustadas (`data:image/*`) no provocan
ninguna petición.

## Notas

- **TypeScript está fijado a la versión 6** (`^6` en `package.json`). `astro check` todavía
  no soporta TypeScript 7, así que se mantiene en la 6 hasta que haya soporte.

## Flujo de trabajo (SDD)

1. **Constitución**: `docs/constitution.md` define los principios innegociables (`/sdd-constitution`).
2. **Spec**: crea `specs/NNN-nombre/spec.md` con requisitos en EARS (`RF-x`) e historias de usuario (`HU-x`), estado `borrador` (`/sdd-spec`).
3. **Clarificación**: revísala como un QA (`/sdd-clarify`).
4. **Plan**: genera `specs/NNN-nombre/plan.md` (`/sdd-plan`).
5. **Tareas**: divide el plan en tareas de 20-30 min con "Hecho cuando:" (`/sdd-tasks`).
6. **Implementación**: una tarea a la vez, tests primero (`/sdd-implement`).
7. **Validación**: recorre la spec RF por RF y verifica los criterios de finalización (`/sdd-validate`).

Los cambios de requisitos van primero a la spec (`/sdd-change`). Consulta `AGENTS.md` para el detalle.

## Estructura

- `docs/constitution.md` — principios innegociables.
- `specs/NNN-nombre/` — cada spec con `spec.md`, `plan.md` y `tasks.md` (plantillas en `specs/_template/`).
- `.opencode/commands/sdd-*.md` — comandos `/sdd-*`.
- `.agents/skills/sdd/` — skill de SDD.

## Convenciones SDD

- Estado: `borrador → aprobada → implementada`.
- Requisitos en EARS (`RF-x`): CUANDO / SI…ENTONCES / MIENTRAS / EL SISTEMA.
- Nunca implementes una spec que no esté `aprobada` ni con dudas `[NECESITA ACLARACIÓN]`.
- Detalle en `AGENTS.md`.
