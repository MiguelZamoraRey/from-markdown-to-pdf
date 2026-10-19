import { describe, expect, it } from 'vitest';

import { hasContent, normalizePastedText } from './content';

describe('hasContent', () => {
  it('devuelve falso con la cadena vacía (RF-25)', () => {
    expect(hasContent('')).toBe(false);
  });

  it('devuelve falso con solo espacios (RF-25)', () => {
    expect(hasContent('   ')).toBe(false);
  });

  it('devuelve falso con saltos de línea y tabuladores (RF-27)', () => {
    expect(hasContent('\n\t')).toBe(false);
  });

  it('devuelve verdadero con contenido real (RF-27)', () => {
    expect(hasContent('# Hola')).toBe(true);
  });
});

describe('normalizePastedText', () => {
  it('quita el BOM inicial (RF-10)', () => {
    expect(normalizePastedText('\uFEFFhola')).toBe('hola');
  });

  it('unifica CRLF a LF (RF-10)', () => {
    expect(normalizePastedText('a\r\nb')).toBe('a\nb');
  });

  it('unifica CR a LF (RF-10)', () => {
    expect(normalizePastedText('a\rb')).toBe('a\nb');
  });
});
