# MEMORY.md — Diario de Estudio

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no
aporte.

## Estado actual

- Proyecto: **Markdown a PDF** — web (pnpm + Astro salida estática, sin adaptador,
  TypeScript estricto, sin framework de UI, sin backend) que convierte Markdown a PDF en
  el navegador. Nada sale del dispositivo.
- Spec **001-nucleo**: `Estado: implementada` y **VALIDADA**. T1..T10 hechas; veredicto
  final del @reviewer **APROBADA** (33 RF + 8 RNF cubiertos, criterios cumplidos).
- Comandos: `pnpm test` → 59 tests en verde (6 archivos); `pnpm check` → 0 errores;
  `pnpm build` → OK (1 página). También `dev`, `preview`.
- Dependencia de runtime única: `markdown-it`. Tests Vitest en `src/lib/**/*.test.ts`.
- Estructura: `src/lib/` (`content`, `theme`, `markdown`, `typography`, `url`, `print`),
  `src/layouts/BaseLayout.astro`, `src/components/` (`Navbar`, `ThemeToggle`,
  `EditorPanel`, `PreviewPanel`, `PrintStyles`), `src/pages/index.astro`,
  `src/scripts/app.ts`, `src/styles/{global,paper}.css`.

## Decisiones (y por qué)

- PDF con `window.print()` + CSS de impresión (`@page` A4, márgenes 20 mm): cero
  dependencias, gratis, sin backend. Aislamiento con `.no-print`.
- Renderizador: `markdown-it` con `html: false` + reglas propias para enlaces
  (`javascript:`/`data:` no navegan) e imágenes (`data:image/*` y remotas permitidas).
- Vista previa **siempre papel blanco** (token `--font-paper`, serif, sobrescribible por
  la 002), independiente del tema. Tema oscuro por defecto, preferencia solo en
  `localStorage` (`markdown-a-pdf:theme`), sin flash (script inline bloqueante en `<head>`).
- Paleta «mesa de trabajo»: acento azul de corrección y foco ámbar
  (`--color-focus` oscuro `#e8c15a`; claro `#8a4b00`, ≥4,5:1, RNF-4).
- **TypeScript fijado a `^6`**: `astro check` aún no soporta TS 7.
- Imágenes remotas permitidas (excepción documentada a la privacidad: el navegador pide la
  imagen a su origen, el documento nunca se envía).
- El usuario gestiona el git: los agentes nunca hacen add/commit/push.

## Aprendizajes y errores a evitar

- En este entorno las llamadas de subagente muy largas (muchas tareas o verificación en
  navegador incluidas) pueden cancelarse: parte las tareas grandes (T6 se hizo en 2 tramos).
- RNF-5 verificado a mano en **Chrome, Firefox y Edge**; **Safari sin verificar** (no
  disponible en Linux) → pendiente antes de publicar.
- RF-32 (paginación) y RNF-3 (rendimiento) verificados a mano: doc realista de 100 000 car.
  ≈61-68 ms (cumple); con documentos de densidad extrema hay limitación conocida (la spec
  la registra).

## Próximos pasos

- Spec **002 — tipografía**: selector de fuentes (del sistema + Roboto servida en local),
  reutilizando el token `--font-paper` ya previsto.
- Spec **003 — colores de destacado**: paleta fija curada + input de color libre.
- Opcional pendiente: una pasada de verificación en Safari de escritorio (RNF-5).
