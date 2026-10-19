# Constitución — Markdown a PDF

Principios innegociables. Toda spec, plan y tarea debe cumplirlos.

1. **Simplicidad primero**: Astro + TypeScript estricto con pnpm; la dependencia mínima imprescindible, sin librerías pesadas ni backend propio.
2. **La spec manda**: nada se implementa si no está en la spec activa. Si falta una decisión, se para y se pregunta.
3. **Lógica separada de la interfaz**: la lógica pura (transformar Markdown, calcular estilos, resolver el color de destacado) son funciones puras, sin DOM ni estado global, que reciben los parámetros explícitamente y devuelven el resultado.
4. **Tests como puerta**: la lógica pura se prueba con `pnpm test` (Vitest). Prohibido avanzar con tests en rojo.
5. **Los datos del usuario son sagrados**: el Markdown nunca sale del navegador (sin backend ni terceros); el usuario controla su contenido y lo exporta cuando quiere.
6. **Idioma**: código en inglés; interfaz y documentación en español.
