import slugify from "@sindresorhus/slugify";

/**
 * Generates a unique, URL-friendly image ID from a filename.
 * Uses slugify for the name part (transliterates accents, e.g. café → cafe).
 * On collision, inserts -2, -3, etc. before the extension.
 *
 * Mutates `usedIds` by adding the returned ID so that subsequent calls
 * (e.g. when adding multiple images in a batch) produce unique IDs.
 *
 * @returns A unique ID (e.g. "my-photo.jpg", "my-photo-2.jpg")
 */
export function createImageId(name: string, usedIds: Set<string>): string {
  const baseName = name.split(/[/\\]/).pop() ?? "";
  const lastDot = baseName.lastIndexOf(".");
  const nameWithoutExt = lastDot > 0 ? baseName.slice(0, lastDot) : baseName;
  const ext = lastDot > 0 ? baseName.slice(lastDot) : "";

  const slugifiedName = slugify(nameWithoutExt) || "image";
  const extSlug = ext
    .toLowerCase()
    .replace(/^\./, "")
    .replace(/[^a-z0-9]+/g, "");
  const slug = extSlug ? `${slugifiedName}.${extSlug}` : slugifiedName;

  const base = slugifiedName;
  const extPart = extSlug ? `.${extSlug}` : "";

  let candidate = slug;
  let suffix = 2;

  while (usedIds.has(candidate)) {
    candidate = `${base}-${suffix}${extPart}`;
    suffix += 1;
  }

  usedIds.add(candidate);
  return candidate;
}
