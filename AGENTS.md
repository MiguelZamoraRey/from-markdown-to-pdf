# AGENTS.md

Convenciones y flujo de trabajo para cualquier agente que trabaje en este repositorio.

## Qué es este proyecto

**Markdown a PDF** es una aplicación web (Astro + TypeScript estricto) que convierte
Markdown en PDF en el propio navegador. El usuario pega o edita Markdown en un panel,
ve la maqueta del resultado en otro y la exporta a PDF con las opciones de tipografía y
color de destacado que elija. Está dirigida a quien necesita documentación, apuntes o
informes con un PDF limpio sin servicios online: el contenido nunca sale del navegador.
La especificación se divide en tres specs: **001** núcleo, **002** tipografía y
**003** colores de destacado.

## Estructura

- **Constitución**: `docs/constitution.md` (principios innegociables del proyecto).
- **Specs**: `specs/NNN-nombre/` con `spec.md`, `plan.md` y `tasks.md`.
- **Código**: `src/` (páginas y componentes Astro, lógica pura en `src/lib/`).
- **Comandos SDD**: `.opencode/commands/sdd-*.md` (invoca `/sdd-*`).
- **Skill**: `.agents/skills/sdd/`.
- **Agentes SDD**: `.opencode/agents/` (coordinator, planner, implementer, reviewer).

## Flujo de trabajo SDD

Flujo: Constitución → Spec → Clarificación → Plan → Tareas → Implementación → Validación → Cambio.

### Estado de las specs

Una spec pasa por `borrador` → `aprobada` → `implementada` (línea "Estado:" al inicio de `spec.md`).

### 1. Constitución

- `docs/constitution.md` define los principios innegociables. Crea o adapta con `/sdd-constitution`.
- Toda spec, plan y tarea debe cumplirlos.

### 2. Especificar

- Crea `specs/NNN-nombre/spec.md` con `/sdd-spec` o siguiendo la skill `sdd`.
- Requisitos en EARS (`RF-x`: CUANDO / SI…ENTONCES / MIENTRAS / EL SISTEMA) e historias de usuario (`HU-x`).
- La spec describe el QUÉ y el POR QUÉ. Nada de stack, arquitectura ni nombres de archivos.

### 3. Clarificar

- Revisa la spec como un QA con `/sdd-clarify`: ambigüedades, contradicciones, casos límite, conflictos con la constitución y seguridad (OWASP).
- No implementes una spec que no esté `aprobada` o que tenga dudas abiertas `[NECESITA ACLARACIÓN]`.

### 4. Planificar

- Genera `specs/NNN-nombre/plan.md` con `/sdd-plan`: archivos, funciones, algoritmo, interfaz y decisiones justificadas, cubriendo todos los RF.

### 5. Tareas

- Genera `specs/NNN-nombre/tasks.md` con `/sdd-tasks`: tareas de 20-30 min, con los RF que cubre cada una y "Hecho cuando:" verificable.

### 6. Implementar

- Una tarea a la vez con `/sdd-implement`, tests primero.
- Referencia el ID de cada requisito (`RF-x`) en comentarios.

### 7. Validar

- Recorre la spec RF por RF con `/sdd-validate`: qué test cubre cada RF y su resultado.
- Comprueba los criterios de finalización antes de marcar la spec como `implementada`.

### Cambios (mantenimiento)

- Un nuevo requisito va primero a la spec (`/sdd-change`), luego al plan y las tareas, y por último al código.

## Convenciones

- **La spec manda.** No implementes lógica no descrita en la spec sin avisar.
- **Requisitos en EARS** (`RF-x`) verificables; nada de "rápido", "intenso" o "bonito" sin criterio medible.
- **Stack**: Astro + TypeScript estricto con pnpm. Dependencias mínimas; prioriza lo nativo del navegador (p. ej. `window.print()` para el PDF) frente a librerías.
- **TypeScript estricto.** No uses `any` salvo justificación.
- **Tests**: unitarios (Vitest) de la lógica pura, junto a ella en `src/lib/**/*.test.ts`; ejecútalos con `pnpm test`. Un test por RF cuando aplique.
- **No añadas comentarios** innecesarios; el código debe explicarse por sí mismo.
- **Documentación**: cualquier cambio relevante de arquitectura se refleja en `README.md` y `AGENTS.md`.
- **Commits**: los realiza siempre el mantenedor. Los agentes **nunca** commitean ni hacen push.

## Seguridad

- No commitees secretos ni claves. Usa `.env.example` en lugar de `.env`.
- La app es solo-cliente: el Markdown y los PDFs **nunca** salen del navegador. No añadas backend ni envíes contenido a terceros.
- Sanea el HTML derivado del Markdown antes de renderizarlo (nada de ejecutar HTML/JS pegado por el usuario).
- Aplica principios OWASP en las specs (validación de entrada, datos sensibles, dependencias mínimas).

## Antes de terminar

- Ejecuta `pnpm test` (tests unitarios) y `pnpm check` (comprobación de tipos).
- Confirma que no hay errores de build (`pnpm build`).

## Memoria

- Al empezar, lee `MEMORY.md` para conocer el estado del proyecto y las decisiones
  tomadas.
- Al terminar una tarea, actualízalo: estado actual, decisiones importantes (con su
  porqué) y errores a evitar.
- Mantenlo breve (máximo ~50 líneas): resume o elimina lo que ya no aporte.
- Si algo se convierte en una regla permanente, propón moverlo a `AGENTS.md` en lugar de
  dejarlo en la memoria.
- No guardes nunca datos sensibles (claves, tokens, datos personales)
