import { describe, expect, it } from 'vitest';

import { isSafeImageSrc, isSafeLinkHref } from './url';

describe('isSafeLinkHref', () => {
  it('acepta http y https (RF-21)', () => {
    expect(isSafeLinkHref('https://example.com')).toBe(true);
    expect(isSafeLinkHref('http://example.com/a?b=c#d')).toBe(true);
  });

  it('acepta mailto y tel (RF-21)', () => {
    expect(isSafeLinkHref('mailto:alguien@example.com')).toBe(true);
    expect(isSafeLinkHref('tel:+34600000000')).toBe(true);
  });

  it('acepta rutas relativas y anclas (RF-21)', () => {
    expect(isSafeLinkHref('/ruta/pagina')).toBe(true);
    expect(isSafeLinkHref('./ruta')).toBe(true);
    expect(isSafeLinkHref('ruta/pagina.html')).toBe(true);
    expect(isSafeLinkHref('#ancla')).toBe(true);
  });

  it('rechaza javascript: incluso con mayúsculas o espacios (RF-21, RF-24)', () => {
    expect(isSafeLinkHref('javascript:alert(1)')).toBe(false);
    expect(isSafeLinkHref('JavaScript:alert(1)')).toBe(false);
    expect(isSafeLinkHref(' javascript:alert(1)')).toBe(false);
    expect(isSafeLinkHref('java\nscript:alert(1)')).toBe(false);
    expect(isSafeLinkHref('java\tscript:alert(1)')).toBe(false);
  });

  it('rechaza data: que no sea imagen y otros esquemas (RF-24)', () => {
    expect(isSafeLinkHref('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafeLinkHref('vbscript:msgbox(1)')).toBe(false);
    expect(isSafeLinkHref('file:///etc/passwd')).toBe(false);
  });
});

describe('isSafeImageSrc', () => {
  it('acepta http(s) y rutas relativas (RF-22)', () => {
    expect(isSafeImageSrc('https://example.com/img.png')).toBe(true);
    expect(isSafeImageSrc('http://example.com/img.png')).toBe(true);
    expect(isSafeImageSrc('/imagenes/a.png')).toBe(true);
    expect(isSafeImageSrc('imagenes/a.png')).toBe(true);
  });

  it('acepta data:image/* de cualquier subtipo (RF-22)', () => {
    expect(isSafeImageSrc('data:image/png;base64,iVBORw0KGgo=')).toBe(true);
    expect(isSafeImageSrc('data:image/svg+xml,<svg/>')).toBe(true);
    expect(isSafeImageSrc('DATA:IMAGE/JPEG;base64,AAAA')).toBe(true);
  });

  it('rechaza data: que no sea imagen (RF-24)', () => {
    expect(isSafeImageSrc('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafeImageSrc('data:application/javascript,alert(1)')).toBe(false);
  });

  it('rechaza javascript: y otros esquemas (RF-24)', () => {
    expect(isSafeImageSrc('javascript:alert(1)')).toBe(false);
    expect(isSafeImageSrc('vbscript:msgbox(1)')).toBe(false);
    expect(isSafeImageSrc('file:///etc/passwd')).toBe(false);
  });
});
