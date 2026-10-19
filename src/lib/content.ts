export function hasContent(markdown: string): boolean {
  return markdown.trim().length > 0;
}

export function normalizePastedText(text: string): string {
  return text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
}
