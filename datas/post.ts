export const post = {
  reading_time: (min: any) => {
    return `${min} min read`;
  },
  views: (views: any) => {
    return `${views} views`;
  },
  tags: "Tags",
  relate_post: "Related Posts:",
  table_of_contents: "Table of Contents",
} as const;

export default post;
