import MarkdownIt from 'markdown-it';

import { isSafeImageSrc, isSafeLinkHref } from './url';

const markdownIt = new MarkdownIt({
  html: false,
  linkify: false,
  typographer: false,
});

markdownIt.validateLink = () => true;

markdownIt.renderer.rules.link_open = (tokens, idx, options, _env, self) => {
  const token = tokens[idx];
  const hrefValue = token.attrGet('href');
  const href = typeof hrefValue === 'string' ? hrefValue : '';

  if (isSafeLinkHref(href)) {
    token.attrSet('target', '_blank');
    token.attrSet('rel', 'noopener noreferrer');
  } else {
    if (token.attrs) {
      token.attrs = token.attrs.filter(([name]) => name !== 'href');
    }
    token.attrJoin('class', 'link--inert');
  }

  return self.renderToken(tokens, idx, options);
};

markdownIt.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const srcValue = token.attrGet('src');
  const src = typeof srcValue === 'string' ? srcValue : '';

  const alt = self.renderInlineAsText(token.children ?? [], options, env);

  if (!isSafeImageSrc(src)) {
    return markdownIt.utils.escapeHtml(alt);
  }

  token.attrSet('alt', alt);
  return self.renderToken(tokens, idx, options);
};

export function renderMarkdown(markdown: string): string {
  return markdownIt.render(markdown);
}
