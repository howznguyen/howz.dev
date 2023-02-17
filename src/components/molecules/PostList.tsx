import React from 'react'
import { PostCard } from '.'

interface PostListProps {
    posts: any
    limit ?: number
}

const PostList = ({ posts, limit }: PostListProps) => {
  return (
    <div className="grid grid-cols-1 gap-5 place-items-stretch md:grid-cols-3">
        {posts.slice(0, limit).map((post : any, index : number) => (
            <PostCard key={index} post={post} />
        ))}
    </div>
  )
}

export default PostList