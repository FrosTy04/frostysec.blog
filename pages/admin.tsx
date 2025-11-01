'use client'

import { useState, FormEvent, useEffect } from 'react'
import Link from 'next/link'
import { Post } from '@/lib/posts'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  // Check authentication on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAdmin = localStorage.getItem('isAdmin')
      if (isAdmin === 'true') {
        setIsAuthenticated(true)
        loadPosts()
      } else {
        setIsLoading(false)
      }
    }
  }, [])

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/posts/list')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (err) {
      console.error('Error loading posts:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setIsLoginLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store login state
        localStorage.setItem('isAdmin', 'true')
        setIsAuthenticated(true)
        setIsLoginLoading(false)
        loadPosts()
      } else {
        setLoginError(data.error || 'Invalid username or password.')
        setIsLoginLoading(false)
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setLoginError('Failed to connect to server. Please try again.')
      setIsLoginLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    setIsAuthenticated(false)
    setPosts([])
    setUsername('')
    setPassword('')
    setLoginError('')
  }

  const handleAddFormSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    setFormLoading(true)

    try {
      // Auto-fill date (today) and author
      const date = new Date().toISOString().split('T')[0]
      const author = 'frostysec'

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          date,
          author,
          tags: [],
          excerpt: formData.excerpt.trim(),
          content: formData.content.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save post')
      }

      const data = await response.json()
      setFormSuccess('Post published successfully.')
      
      // Reset form
      setFormData({
        title: '',
        excerpt: '',
        content: '',
      })
      
      // Reload posts
      loadPosts()
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setFormSuccess('')
      }, 3000)
    } catch (err: any) {
      setFormError(err.message || 'Failed to save post')
    } finally {
      setFormLoading(false)
    }
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-semibold text-black mb-8 text-center">
              frostysec.blog Admin
            </h1>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>

              {loginError && (
                <p className="text-sm text-red-600 mt-2">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={isLoginLoading}
                className="w-full px-6 py-3 bg-black text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoginLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Show dashboard if authenticated
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-semibold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage and publish your writeups</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-black px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Add New Post Form */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-6">Publish New Post</h2>

        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
            {formError}
          </div>
        )}

        {formSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6">
            {formSuccess}
          </div>
        )}

        <form onSubmit={handleAddFormSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Short description of your post"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Content (Markdown) *
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 font-mono text-sm"
              placeholder="Write your post content in Markdown..."
            />
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {formLoading ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      </div>

      {/* Writeups List */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">All Writeups</h2>
        
        {isLoading ? (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-lg">
            <p className="text-gray-500">Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="block bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
              >
                <h3 className="text-2xl font-semibold mb-3 group-hover:opacity-70 transition-opacity">
                  {post.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>{post.date}</span>
                  {post.author && (
                    <>
                      <span>•</span>
                      <span>{post.author}</span>
                    </>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-lg">
            <p className="text-gray-500">No posts yet. Publish your first post above!</p>
          </div>
        )}
      </div>
    </div>
  )
}
