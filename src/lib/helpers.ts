import slugify from "slugify";

export const defaultBlurData = {
  url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==",
  width: 1,
  height: 1,
};

export function cleanText(text: string | undefined): string {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim();
}

export function idToUuid(id: string): string {
  if (id.length === 36) return id;
  if (id.length === 32) {
    return [
      id.slice(0, 8),
      id.slice(8, 12),
      id.slice(12, 16),
      id.slice(16, 20),
      id.slice(20, 32),
    ].join("-");
  }
  return id;
}

export function makeSlugText(text: string): string {
  return slugify(text, { lower: true, strict: true, locale: "vi" });
}

export function createSlugFromTitleAndUuid(
  title: string,
  uuid: string
): string {
  const slugFromTitle = makeSlugText(title);
  const uuidPrefix = uuid.replace(/-/g, "").substring(0, 8);
  return `${slugFromTitle}-${uuidPrefix}`;
}
