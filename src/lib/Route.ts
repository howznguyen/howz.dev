const Route = {
    index: () => `/`,
    post: (slug: string) => `/post/${slug}`,
    tag: (slug: string) => `/tag/${slug}`,
    blog: () => `/blog`,
};


export default Route;