export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')      // Remove non-word, non-space, non-hyphen
    .replace(/[\s_-]+/g, '-')      // Replace spaces/underscores with hyphen
    .replace(/^-+|-+$/g, '');      // Trim hyphens
}
