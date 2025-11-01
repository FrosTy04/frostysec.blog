import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Path to posts JSON file
const postsJsonPath = path.join(process.cwd(), 'posts.json')
const contentDirectory = path.join(process.cwd(), 'content')

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
function getPostsFromJson(): Post[] {
  try {
    if (!fs.existsSync(postsJsonPath)) {
      return []
    }
    const fileContents = fs.readFileSync(postsJsonPath, 'utf8')
    const posts = JSON.parse(fileContents)
    return Array.isArray(posts) ? posts : []
  } catch (error) {
    console.error('Error reading posts.json:', error)
    return []
  }
}

// Read posts from markdown files in content directory
function getPostsFromMarkdown(): Post[] {
  try {
    if (!fs.existsSync(contentDirectory)) {
      return []
    }
    const files = fs.readdirSync(contentDirectory)
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(contentDirectory, file)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const { data, content } = matter(fileContents)
        return {
          slug: file.replace(/\.md$/, ''),
          title: data.title || '',
          date: data.date || '',
          author: data.author || 'frostysec',
          tags: data.tags || [],
          excerpt: data.excerpt || '',
          content: content,
        } as Post
      })
    return files
  } catch (error) {
    console.error('Error reading markdown posts:', error)
    return []
  }
}

// Get all posts (merge JSON and markdown sources)
export function getAllPosts(): Post[] {
  const jsonPosts = getPostsFromJson()
  const markdownPosts = getPostsFromMarkdown()
  const allPosts = [...jsonPosts, ...markdownPosts]
  
  // Sort by date (newest first)
  return allPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

// Get post by slug
export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts()
  return posts.find(post => post.slug === slug) || null
}

// Write new post to JSON file
export function addPostToJson(post: Omit<Post, 'slug'>): string {
  try {
    const posts = getPostsFromJson()
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

    posts.push(newPost)
    
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
