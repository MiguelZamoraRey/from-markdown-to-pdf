const SCHEME_PATTERN = /^([a-z][a-z0-9+.-]*):/i;

const LINK_SCHEMES = new Set(['http', 'https', 'mailto', 'tel']);
const IMAGE_SCHEMES = new Set(['http', 'https']);

const IGNORED_IN_SCHEME = /[\u0000-\u0020\u007f]+/g;

function normalizeForSchemeCheck(value: string): string {
  return value.replace(IGNORED_IN_SCHEME, '');
}

function getScheme(value: string): string | null {
  const match = SCHEME_PATTERN.exec(normalizeForSchemeCheck(value));
  return match ? match[1].toLowerCase() : null;
}

export function isSafeLinkHref(href: string): boolean {
  const scheme = getScheme(href);
  return scheme === null || LINK_SCHEMES.has(scheme);
}

export function isSafeImageSrc(src: string): boolean {
  const scheme = getScheme(src);
  if (scheme === null || IMAGE_SCHEMES.has(scheme)) {
    return true;
  }
  if (scheme === 'data') {
    return normalizeForSchemeCheck(src).toLowerCase().startsWith('data:image/');
  }
  return false;
}
