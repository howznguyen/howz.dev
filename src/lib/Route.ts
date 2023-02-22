import { BASE_URL } from '@/lib/env';

const Route = {
    index: (includeDomain = false) => `${includeDomain ? BASE_URL : ''}/`,
    post: (slug: string, includeDomain = false) => `${includeDomain ? BASE_URL : ''}/post/${slug}`,
    blog: (includeDomain = false) => `${includeDomain ? BASE_URL : ''}/blog`,

    // API
    api: {
        post: {
            updateViews : (slug: string, includeDomain = false) => `${includeDomain ? BASE_URL : ''}/api/post/views?slug=${slug}`
        }
    },

    // Image
    defaultCover: (includeDomain = false) => `${includeDomain ? BASE_URL : ''}/assets/images/og.png`,
    defaultLogo: (includeDomain = false) => `${includeDomain ? BASE_URL : ''}/assets/images/logo.png`
};


export default Route;