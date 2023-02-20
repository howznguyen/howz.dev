import React from 'react'
import { PostCard } from '.'

interface PostListProps {
    posts: any[],
    limit ?: number,
    className ?: string,
}

const PostList = ({ posts, limit, className }: PostListProps) => {
  if( posts.length === 0) return <></>

  return (
    <div className={`grid grid-cols-1 gap-5 place-items-stretch md:grid-cols-3 ${className}`}>
        {posts.slice(0, limit).map((post : any, index : number) => (
            <PostCard key={index} post={post} />
        ))}
    </div>
  )
}

export default PostList