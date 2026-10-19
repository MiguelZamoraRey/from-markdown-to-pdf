import { describe, expect, it } from 'vitest';

import { A4, buildPrintCss, computeImageWait } from './print';

describe('A4', () => {
  it('es 210 × 297 mm con margen de 20 mm (RF-31)', () => {
    expect(A4.widthMm).toBe(210);
    expect(A4.heightMm).toBe(297);
    expect(A4.marginMm).toBe(20);
  });
});

describe('buildPrintCss', () => {
  it('declara el tamaño A4 y el margen de 20 mm (RF-31)', () => {
    const css = buildPrintCss();
    expect(css).toContain('size: A4');
    expect(css).toContain('margin: 20mm');
  });

  it('evita partir imágenes, tablas, bloques de código y citas (RF-32)', () => {
    const css = buildPrintCss();
    expect(css).toContain('break-inside: avoid');
    expect(css).toContain('img');
    expect(css).toContain('table');
    expect(css).toContain('pre');
    expect(css).toContain('blockquote');
  });

  it('evita dejar encabezados huérfanos (RF-32)', () => {
    const css = buildPrintCss();
    expect(css).toContain('break-after: avoid');
    for (const heading of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
      expect(css).toContain(heading);
    }
  });

  it('usa papel blanco con texto oscuro y color exacto (RF-30)', () => {
    const css = buildPrintCss();
    expect(css).toContain('background: #fff');
    expect(css).toContain('color: #000');
    expect(css).toContain('print-color-adjust: exact');
  });

  it('refleja los valores de otra página pasada como argumento (RF-31)', () => {
    const css = buildPrintCss({ widthMm: 216, heightMm: 279, marginMm: 10 });
    expect(css).toContain('size: 216mm 279mm');
    expect(css).toContain('margin: 10mm');
    expect(css).not.toContain('margin: 20mm');
  });

  it('aísla la impresión y deshace la disposición de la interfaz (RF-29)', () => {
    const css = buildPrintCss();
    expect(css).toContain('.no-print');
    expect(css).toContain('display: none !important');
    expect(css).toContain('.workspace');
    expect(css).toContain('.preview-panel__body');
    expect(css).toContain('overflow: visible');
  });

  it('deja el documento a los márgenes de la página, sin adornos de hoja (RF-30, RF-31)', () => {
    const css = buildPrintCss();
    expect(css).toContain('.paper');
    expect(css).toContain('box-shadow: none');
    expect(css).toContain('border-radius: 0');
    expect(css).toContain('padding: 0');
    expect(css).toContain('margin: 0');
  });

  it('es determinista (RNF-2)', () => {
    expect(buildPrintCss()).toBe(buildPrintCss());
  });
});

describe('computeImageWait', () => {
  it('no espera si no hay imágenes pendientes (RF-33)', () => {
    expect(computeImageWait([], 0)).toEqual({ shouldWait: false, timedOut: false });
    expect(computeImageWait([{ complete: true }], 0)).toEqual({
      shouldWait: false,
      timedOut: false,
    });
  });

  it('espera si hay pendientes y no se alcanzó el límite (RF-33)', () => {
    expect(computeImageWait([{ complete: true }, { complete: false }], 1500)).toEqual({
      shouldWait: true,
      timedOut: false,
    });
  });

  it('deja de esperar y marca expirado al alcanzar los 3 s (RF-33)', () => {
    expect(computeImageWait([{ complete: false }], 3000)).toEqual({
      shouldWait: false,
      timedOut: true,
    });
    expect(computeImageWait([{ complete: false }], 3500)).toEqual({
      shouldWait: false,
      timedOut: true,
    });
  });

  it('respeta un límite distinto pasado como parámetro (RF-33)', () => {
    expect(computeImageWait([{ complete: false }], 900, 1000)).toEqual({
      shouldWait: true,
      timedOut: false,
    });
    expect(computeImageWait([{ complete: false }], 1000, 1000)).toEqual({
      shouldWait: false,
      timedOut: true,
    });
  });
});
