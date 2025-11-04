import fs from 'fs'
import path from 'path'

// Path to posts JSON file (root directory for Vercel compatibility)
const postsJsonPath = path.join(process.cwd(), 'posts.json')

export interface Post {
  slug: string
  title: string
  date: string
  author: string
  tags?: string[]
  excerpt: string
  content: string
}

// Read posts from JSON file
export function getAllPosts(): Post[] {
  try {
    if (!fs.existsSync(postsJsonPath)) {
      return []
    }
    const fileContents = fs.readFileSync(postsJsonPath, 'utf8')
    const posts = JSON.parse(fileContents)
    const validPosts = Array.isArray(posts) ? posts : []
    
    // Sort by date (newest first)
    return validPosts.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  } catch (error) {
    console.error('Error reading posts.json:', error)
    return []
  }
}

// Get post by slug
export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts()
  return posts.find(post => post.slug === slug) || null
}

// Write new post to JSON file
export function addPostToJson(post: Omit<Post, 'slug'>): string {
  try {
    const posts = getAllPosts()
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    // Ensure unique slug
    let uniqueSlug = slug
    let counter = 1
    while (posts.some(p => p.slug === uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    const newPost: Post = {
      ...post,
      slug: uniqueSlug,
    }

    posts.unshift(newPost) // Add to beginning (newest first)
    
    // Sort by date before saving
    posts.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    fs.writeFileSync(postsJsonPath, JSON.stringify(posts, null, 2), 'utf8')
    return uniqueSlug
  } catch (error) {
    console.error('Error writing post to JSON:', error)
    throw new Error('Failed to save post')
  }
}
