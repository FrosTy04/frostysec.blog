'use client'

import React, { useEffect, useState, useCallback } from 'react'

interface Post {
  id: number
  slug: string
  title: string
  date: string
  author: string
  excerpt: string
  content: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [publishError, setPublishError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

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
    if (typeof window !== 'undefined') {
      const adminStatus = localStorage.getItem('isAdmin')
      if (adminStatus === 'true') {
        setIsAuthenticated(true)
        fetchPosts()
      } else {
        setLoading(false)
      }
    }
  }, [fetchPosts])

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (code === '2+x2') {
      localStorage.setItem('isAdmin', 'true')
      setIsAuthenticated(true)
      fetchPosts()
    } else {
      setError('Invalid code.')
    }
  }

  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const newPost = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      })

      if (res.ok) {
        const data = await res.json()
        setFormData({ title: '', excerpt: '', content: '' })
        setSuccessMessage('Post published successfully!')
        setPublishError('')
        
        // Immediately update the posts list
        setPosts(data.posts || [])
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const error = await res.json()
        setPublishError(error.error || 'Failed to publish post')
        setSuccessMessage('')
      }
    } catch (error) {
      console.error('Failed to publish post:', error)
      setPublishError('Failed to publish post')
      setSuccessMessage('')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePost = async (id: number) => {
    setDeletingId(id)
  }

  const confirmDeletePost = async (id: number) => {
    try {
      const res = await fetch(`/api/posts?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts || [])
        setSuccessMessage('Post deleted successfully!')
        setPublishError('')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const error = await res.json()
        setPublishError(error.error || 'Failed to delete post')
        setSuccessMessage('')
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
      setPublishError('Failed to delete post')
      setSuccessMessage('')
    } finally {
      setDeletingId(null)
    }
  }

  const cancelDelete = () => {
    setDeletingId(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 w-full max-w-md">
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-code" className="block text-sm font-medium mb-2 text-black dark:text-white">
                Enter admin code
              </label>
              <input
                type="text"
                id="admin-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-black dark:bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-8 text-black dark:text-white">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Add New Post</h2>
            <form onSubmit={handlePublishPost} className="space-y-4">
              {successMessage && (
                <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-md">
                  <p className="text-sm text-green-800 dark:text-green-200">{successMessage}</p>
                </div>
              )}
              {publishError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-md">
                  <p className="text-sm text-red-800 dark:text-red-200">{publishError}</p>
                </div>
              )}
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1 text-black dark:text-white">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium mb-1 text-black dark:text-white">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 bg-white dark:bg-gray-700 text-black dark:text-white"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1 text-black dark:text-white">
                  Content (Markdown)
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 font-mono text-sm bg-white dark:bg-gray-700 text-black dark:text-white"
                  rows={10}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black dark:bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Publishing...' : 'Publish Post'}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Posts ({posts.length})</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {posts.map((post) => (
                <div key={post.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0">
                  {deletingId === post.id ? (
                    <div className="flex items-center justify-between gap-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded">
                      <p className="text-sm text-red-800 dark:text-red-200">Are you sure you want to delete this post?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => confirmDeletePost(post.id)}
                          className="px-3 py-1 text-sm bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-600 rounded transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 text-black dark:text-white">{post.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{post.date}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{post.excerpt}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {post.content.substring(0, 100)}...
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="px-3 py-1 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded transition-colors whitespace-nowrap"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {posts.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No posts yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

