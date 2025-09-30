/**
 * Notion Color Utility
 * Provides consistent color classes for all Notion blocks
 */

export type NotionColor =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "orange"
  | "purple"
  | "pink"
  | "gray"
  | "brown"
  | "teal"
  | "red_background"
  | "blue_background"
  | "green_background"
  | "yellow_background"
  | "orange_background"
  | "purple_background"
  | "pink_background"
  | "gray_background"
  | "brown_background";

const COLOR_CLASS_MAP: Record<NotionColor, string[]> = {
  // Text colors
  red: ["text-red-600", "dark:text-red-400"],
  blue: ["text-blue-600", "dark:text-blue-400"],
  green: ["text-green-600", "dark:text-green-400"],
  yellow: ["text-yellow-600", "dark:text-yellow-400"],
  orange: ["text-orange-600", "dark:text-orange-400"],
  purple: ["text-purple-600", "dark:text-purple-400"],
  pink: ["text-pink-600", "dark:text-pink-400"],
  gray: ["text-gray-600", "dark:text-gray-400"],
  brown: ["text-amber-700", "dark:text-amber-400"],
  teal: ["text-teal-600", "dark:text-teal-400"],

  // Background colors
  red_background: [
    "bg-red-100",
    "dark:bg-red-900",
    "text-red-900",
    "dark:text-red-100",
  ],
  blue_background: [
    "bg-blue-100",
    "dark:bg-blue-900",
    "text-blue-900",
    "dark:text-blue-100",
  ],
  green_background: [
    "bg-green-100",
    "dark:bg-green-900",
    "text-green-900",
    "dark:text-green-100",
  ],
  yellow_background: [
    "bg-yellow-100",
    "dark:bg-yellow-900",
    "text-yellow-900",
    "dark:text-yellow-100",
  ],
  orange_background: [
    "bg-orange-100",
    "dark:bg-orange-900",
    "text-orange-900",
    "dark:text-orange-100",
  ],
  purple_background: [
    "bg-purple-100",
    "dark:bg-purple-900",
    "text-purple-900",
    "dark:text-purple-100",
  ],
  pink_background: [
    "bg-pink-100",
    "dark:bg-pink-900",
    "text-pink-900",
    "dark:text-pink-100",
  ],
  gray_background: [
    "bg-gray-100",
    "dark:bg-gray-900",
    "text-gray-900",
    "dark:text-gray-100",
  ],
  brown_background: [
    "bg-amber-100",
    "dark:bg-amber-900",
    "text-amber-900",
    "dark:text-amber-100",
  ],
};

/**
 * Get Tailwind CSS classes for a Notion color
 * @param color - Notion color name
 * @returns Array of CSS class names
 */
export const getColorClasses = (color?: string): string[] => {
  if (!color) return [];
  return (
    COLOR_CLASS_MAP[color as NotionColor] || [
      "bg-white",
      "dark:bg-gray-800",
      "text-gray-900",
      "dark:text-gray-100",
    ]
  );
};

/**
 * Check if a color is a background color
 * @param color - Notion color name
 * @returns boolean
 */
export const isBackgroundColor = (color?: string): boolean => {
  return color?.endsWith("_background") || false;
};

/**
 * Get text-only color classes (no background)
 * @param color - Notion color name
 * @returns Array of CSS class names for text only
 */
export const getTextColorClasses = (color?: string): string[] => {
  if (!color) return [];

  // If it's a background color, extract only text classes
  if (isBackgroundColor(color)) {
    const classes = getColorClasses(color);
    return classes.filter((cls) => cls.startsWith("text-"));
  }

  return getColorClasses(color);
};

/**
 * Get background-only color classes (no text)
 * @param color - Notion color name
 * @returns Array of CSS class names for background only
 */
export const getBackgroundColorClasses = (color?: string): string[] => {
  if (!color || !isBackgroundColor(color)) return [];

  const classes = getColorClasses(color);
  return classes.filter((cls) => cls.startsWith("bg-"));
};

export default {
  getColorClasses,
  getTextColorClasses,
  getBackgroundColorClasses,
  isBackgroundColor,
};
