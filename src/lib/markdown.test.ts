import { describe, expect, it } from 'vitest';

import { renderMarkdown } from './markdown';

describe('renderMarkdown — encabezados', () => {
  it('representa los seis niveles como h1..h6 (RF-14)', () => {
    for (let level = 1; level <= 6; level += 1) {
      const html = renderMarkdown(`${'#'.repeat(level)} Título ${level}`);
      expect(html).toContain(`<h${level}>`);
      expect(html).toContain(`</h${level}>`);
    }
  });
});

describe('renderMarkdown — énfasis', () => {
  it('distingue la negrita (RF-15)', () => {
    expect(renderMarkdown('**x**')).toContain('<strong>x</strong>');
  });

  it('distingue la cursiva (RF-15)', () => {
    expect(renderMarkdown('*x*')).toContain('<em>x</em>');
  });

  it('distingue el tachado (RF-15)', () => {
    expect(renderMarkdown('~~x~~')).toContain('<s>x</s>');
  });
});

describe('renderMarkdown — listas', () => {
  it('representa listas no ordenadas (RF-16)', () => {
    expect(renderMarkdown('- a\n- b')).toContain('<ul>');
  });

  it('representa listas ordenadas (RF-16)', () => {
    expect(renderMarkdown('1. a\n2. b')).toContain('<ol>');
  });

  it('representa listas anidadas con su sangría (RF-16)', () => {
    const html = renderMarkdown('- a\n  - b');
    expect(html.match(/<ul>/g)).toHaveLength(2);
    expect(html).toContain('<li>b</li>');
  });
});

describe('renderMarkdown — citas', () => {
  it('representa la cita en bloque (RF-17)', () => {
    expect(renderMarkdown('> cita')).toContain('<blockquote>');
  });
});

describe('renderMarkdown — código', () => {
  it('representa el código en línea (RF-18)', () => {
    expect(renderMarkdown('`a  b`')).toContain('<code>a  b</code>');
  });

  it('conserva los espacios en un bloque fenced (RF-18)', () => {
    expect(renderMarkdown('```\na  b\n```')).toContain('<pre><code>a  b\n</code></pre>');
  });

  it('no interpreta el contenido del código como formato (RF-18)', () => {
    const html = renderMarkdown('```\n**no negrita**\n```');
    expect(html).toContain('<pre><code>**no negrita**');
    expect(html).not.toContain('<strong>');
  });
});

describe('renderMarkdown — tablas', () => {
  it('representa una tabla GFM con encabezado y celdas (RF-19)', () => {
    const html = renderMarkdown('| a | b |\n| - | - |\n| 1 | 2 |');
    expect(html).toContain('<table>');
    expect(html).toContain('<th>a</th>');
    expect(html).toContain('<td>1</td>');
  });
});

describe('renderMarkdown — Markdown incompleto', () => {
  it('no lanza con un bloque de código sin cerrar y devuelve HTML (RF-26)', () => {
    expect(() => renderMarkdown('```\ncode')).not.toThrow();
    expect(renderMarkdown('```\ncode')).toContain('<pre><code>');
  });
});

describe('renderMarkdown — enlaces (RF-21)', () => {
  it('abre el enlace seguro en pestaña nueva con aislamiento (RF-21)', () => {
    const html = renderMarkdown('[ejemplo](https://example.com)');
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('>ejemplo</a>');
  });

  it('deja el enlace javascript: con estilo pero sin navegar (RF-21)', () => {
    const html = renderMarkdown('[malo](javascript:alert(1))');
    expect(html).not.toContain('href="javascript:');
    expect(html).not.toContain('javascript:alert(1)"');
    expect(html).toContain('link--inert');
    expect(html).toContain('>malo</a>');
  });

  it('neutraliza data: como enlace (RF-21, RF-24)', () => {
    const html = renderMarkdown('[malo](data:text/html,x)');
    expect(html).not.toContain('href="data:');
    expect(html).toContain('link--inert');
  });
});

describe('renderMarkdown — imágenes (RF-22, RF-24)', () => {
  it('representa una imagen incrustada data:image/* (RF-22)', () => {
    const html = renderMarkdown('![alt](data:image/png;base64,iVBORw0KGgo=)');
    expect(html).toContain('<img');
    expect(html).toContain('src="data:image/png;base64,iVBORw0KGgo="');
    expect(html).toContain('alt="alt"');
  });

  it('representa una imagen remota (RF-22)', () => {
    const html = renderMarkdown('![alt](https://example.com/a.png)');
    expect(html).toContain('<img');
    expect(html).toContain('src="https://example.com/a.png"');
  });

  it('sustituye la imagen insegura por su texto alternativo (RF-24)', () => {
    const html = renderMarkdown('![alt](javascript:alert(1))');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('javascript:');
    expect(html).toContain('alt');
  });
});

describe('renderMarkdown — HTML crudo y eventos (RF-24)', () => {
  it('escapa el HTML crudo como texto, sin crear etiquetas (RF-24)', () => {
    const html = renderMarkdown('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
  });

  it('escapa un atributo de evento, sin crear la etiqueta (RF-24)', () => {
    const html = renderMarkdown('<img src="x" onerror="alert(1)">');
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
  });
});
