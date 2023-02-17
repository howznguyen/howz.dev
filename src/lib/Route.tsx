const Route = {
    index: () => `/`,
    post: (slug: string) => `/post/${slug}`,
    tag: (slug: string) => `/tag/${slug}`,
};


export default Route;