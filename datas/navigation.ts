import { Navigation } from '@/types';

export const navigation = [
  {
    id: "1",
    title: "Blog",
    index: 1,
    url: "/blog",
    parent: null,
    children: [],
  },
  {
    id: "2",
    title: "Tag",
    index: 2,
    url: "/tag",
    parent: null,
    children: [],
  },
] as const;

export default navigation;