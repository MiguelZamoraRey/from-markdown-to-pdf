import { describe, expect, it } from 'vitest';

import { headingSizes } from './typography';

describe('headingSizes', () => {
  it('devuelve seis tamaños estrictamente decrecientes (RF-14)', () => {
    const sizes = headingSizes(16);
    expect(sizes.h1).toBeGreaterThan(sizes.h2);
    expect(sizes.h2).toBeGreaterThan(sizes.h3);
    expect(sizes.h3).toBeGreaterThan(sizes.h4);
    expect(sizes.h4).toBeGreaterThan(sizes.h5);
    expect(sizes.h5).toBeGreaterThan(sizes.h6);
  });

  it('todos los tamaños superan el texto normal (RF-14)', () => {
    const basePx = 16;
    const sizes = headingSizes(basePx);
    for (const size of Object.values(sizes)) {
      expect(size).toBeGreaterThan(basePx);
    }
  });

  it('mantiene la escala con otra base y es determinista (RF-14)', () => {
    const first = headingSizes(10);
    const second = headingSizes(10);
    expect(first).toEqual(second);
    for (const size of Object.values(first)) {
      expect(size).toBeGreaterThan(10);
    }
  });
});
