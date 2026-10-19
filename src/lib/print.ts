export interface PageSize {
  widthMm: number;
  heightMm: number;
  marginMm: number;
}

export interface ImageState {
  complete: boolean;
}

export interface ImageWaitResult {
  shouldWait: boolean;
  timedOut: boolean;
}

export const A4: PageSize = { widthMm: 210, heightMm: 297, marginMm: 20 };

function formatSize(page: PageSize): string {
  const isA4 = page.widthMm === A4.widthMm && page.heightMm === A4.heightMm;
  return isA4 ? 'A4' : `${page.widthMm}mm ${page.heightMm}mm`;
}

export function buildPrintCss(page: PageSize = A4): string {
  return [
    '@page {',
    `  size: ${formatSize(page)};`,
    `  margin: ${page.marginMm}mm;`,
    '}',
    '',
    // `!important` porque la hoja de impresión se inyecta antes que las hojas
    // de la interfaz; sin él, estas reglas perderían en la cascada (RF-29,
    // RF-30, RF-31).
    'html, body {',
    '  background: #fff !important;',
    '  color: #000 !important;',
    '}',
    '',
    // Aísla la impresión: el documento fluye en varias páginas en lugar de
    // quedar recortado por la disposición de la interfaz (RF-29).
    'body,',
    '.workspace,',
    '.preview-panel,',
    '.preview-panel__body {',
    '  display: block !important;',
    '  min-height: 0 !important;',
    '  overflow: visible !important;',
    '}',
    '',
    '.workspace {',
    '  padding: 0 !important;',
    '}',
    '',
    // La hoja pierde márgenes, relleno y adornos propios: el margen de la
    // página lo fija @page (RF-30, RF-31).
    '.paper {',
    '  width: auto !important;',
    '  min-height: 0 !important;',
    '  margin: 0 !important;',
    '  padding: 0 !important;',
    '  border-radius: 0 !important;',
    '  box-shadow: none !important;',
    '}',
    '',
    '#preview {',
    '  -webkit-print-color-adjust: exact;',
    '  print-color-adjust: exact;',
    '}',
    '',
    '.no-print {',
    '  display: none !important;',
    '}',
    '',
    'img, table, pre, blockquote {',
    '  break-inside: avoid;',
    '}',
    '',
    'h1, h2, h3, h4, h5, h6 {',
    '  break-after: avoid;',
    '}',
  ].join('\n');
}

export function computeImageWait(
  images: ReadonlyArray<ImageState>,
  elapsedMs: number,
  limitMs = 3000,
): ImageWaitResult {
  const hasPending = images.some((image) => !image.complete);
  return {
    shouldWait: hasPending && elapsedMs < limitMs,
    timedOut: hasPending && elapsedMs >= limitMs,
  };
}
