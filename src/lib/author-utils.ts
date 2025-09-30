/**
 * Author utilities for handling author data and slugs
 */

export interface User {
  id: string;
  name: string;
  avatar?: string;
  profile_photo?: string;
  avatar_url?: string;
}

/**
 * Generate author slug from name
 * Example: "Duy Nguyễn" -> "duynguyen"
 */
export const generateAuthorSlug = (author: User): string => {
  const name = author.name;

  return name
    .toLowerCase()
    .normalize("NFD") // Decompose Vietnamese characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d") // Replace đ with d
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .replace(/\s+/g, "") // Remove spaces
    .trim();
};

/**
 * Generate author URL
 */
export const getAuthorUrl = (author: User): string => {
  const slug = generateAuthorSlug(author);
  return `/u/${slug}`;
};

/**
 * Get author display name
 */
export const getAuthorDisplayName = (author: User): string => {
  return author.name;
};

export default {
  generateAuthorSlug,
  getAuthorUrl,
  getAuthorDisplayName,
};
