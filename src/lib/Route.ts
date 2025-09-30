import { BASE_URL } from "@/lib/env";

const Route = {
  index: (includeDomain = false) => {
    const base = includeDomain ? BASE_URL : "";
    return `${base}/`;
  },
  post: (slug: string, includeDomain = false) => {
    const base = includeDomain ? BASE_URL : "";
    return `${base}/post/${slug}`;
  },
  blog: (includeDomain = false) => {
    const base = includeDomain ? BASE_URL : "";
    return `${base}/blog`;
  },
  author: (slug: string, includeDomain = false) => {
    const base = includeDomain ? BASE_URL : "";
    return `${base}/u/${slug}`;
  },
  tag: {
    index: (includeDomain = false) => {
      const base = includeDomain ? BASE_URL : "";
      return `${base}/tag`;
    },
    get: (slug: string, includeDomain = false) => {
      const base = includeDomain ? BASE_URL : "";
      return `${base}/tag/${slug}`;
    },
  },

  // RSS
  rss: (includeDomain = false) => {
    const base = includeDomain ? BASE_URL : "";
    return `${base}/rss.xml`;
  },

  // API
  api: {
    // Removed post views API
  },

  // Image
  image: (file: string, includeDomain = false) =>
    `${includeDomain ? BASE_URL : ""}/assets/images/${file}`,
  defaultCover: (includeDomain = false) =>
    `${includeDomain ? BASE_URL : ""}/assets/images/og.png`,
  defaultLogo: (includeDomain = false) =>
    `${includeDomain ? BASE_URL : ""}/assets/images/logo.png`,
};

export default Route;
