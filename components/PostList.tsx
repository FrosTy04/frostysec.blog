'use client'

import { useEffect, useState, useCallback } from 'react'
import PostCard from './PostCard'

interface Post {
  slug: string
  title: string
  date: string
  author: string
  tags?: string[]
  excerpt: string
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/posts')
      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
    
    // Refetch posts when window gains focus (user returns to tab)
    const handleFocus = () => {
      fetchPosts()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchPosts])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="space-y-12">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">No posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  )
}

