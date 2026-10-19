import { describe, expect, it } from 'vitest';

import { nextTheme, resolveTheme } from './theme';

describe('resolveTheme', () => {
  it('usa el tema oscuro cuando no hay preferencia (RF-3)', () => {
    expect(resolveTheme(null)).toBe('dark');
  });

  it('respeta la preferencia clara (RF-6)', () => {
    expect(resolveTheme('light')).toBe('light');
  });

  it('respeta la preferencia oscura (RF-6)', () => {
    expect(resolveTheme('dark')).toBe('dark');
  });

  it('usa el tema oscuro con un valor irreconocible (RF-7)', () => {
    expect(resolveTheme('basura')).toBe('dark');
  });
});

describe('nextTheme', () => {
  it('alterna de oscuro a claro (RF-5)', () => {
    expect(nextTheme('dark')).toBe('light');
  });

  it('alterna de claro a oscuro (RF-5)', () => {
    expect(nextTheme('light')).toBe('dark');
  });
});
