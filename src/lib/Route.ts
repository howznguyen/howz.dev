import { BASE_URL } from '@/lib/env';

const Route = {
    index: (includeDomain = false) => `${includeDomain ? BASE_URL : ''}/`,
    post: (slug: string, includeDomain = false) => `${includeDomain ? BASE_URL : ''}/post/${slug}`,
    blog: (includeDomain = false) => `${includeDomain ? BASE_URL : ''}/blog`,
    author: (slug: string, includeDomain = false) => `${includeDomain ? BASE_URL : ''}/author/${slug}`,
    tag: {
        index: (includeDomain = false) => `${includeDomain ? BASE_URL : ''}/tag`,
        get: (slug: string, includeDomain = false) => `${includeDomain ? BASE_URL : ''}/tag/${slug}`,
    },

    // API
    api: {
        post: {
            updateViews : (slug: string, language: string, includeDomain = false) => `${includeDomain ? BASE_URL : ''}/api/post/views?slug=${slug}&language=${language}`
        }
    },

    // Image
    image: (file: string, includeDomain = false) => `${includeDomain ? BASE_URL : ''}/assets/images/${file}`,
    defaultCover: (includeDomain = false) => `${includeDomain ? BASE_URL : ''}/assets/images/og.png`,
    defaultLogo: (includeDomain = false) => `${includeDomain ? BASE_URL : ''}/assets/images/logo.png`,
};


export default Route;