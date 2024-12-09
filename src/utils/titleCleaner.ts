export function cleanTitle(title: string): string {
  return title
    .trim()
    .replace(/^[-\d.\s"]+/, '')
    .replace(/^[^a-zA-Z0-9]+/, '')
    .replace(/["]+/g, '')
    .replace(/\s+/g, ' ');
}