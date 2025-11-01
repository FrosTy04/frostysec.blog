import type { NextApiRequest, NextApiResponse } from 'next'
import { addPostToJson } from '@/lib/posts'

// TODO: SECURITY WARNING - This API route is protected by Basic Auth middleware
// For production, also implement:
// - Rate limiting (use Cloudflare or Vercel Edge Config)
// - Input sanitization (already partially done in lib/posts.ts)
// - File write permissions check
// - Logging of admin actions

interface PostRequest {
  title: string
  date: string
  author: string
  tags?: string[]
  excerpt: string
  content: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { title, date, author, tags, excerpt, content }: PostRequest = req.body

    // Basic validation
    if (!title || !date || !author || !excerpt || !content) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Sanitize input (basic check)
    if (title.length > 200 || excerpt.length > 500) {
      return res.status(400).json({ error: 'Field length exceeds limit' })
    }

    // Add post to JSON file
    const slug = addPostToJson({
      title: title.trim(),
      date,
      author: author.trim(),
      tags: tags || [],
      excerpt: excerpt.trim(),
      content: content.trim(),
    })

    return res.status(200).json({ 
      success: true,
      slug,
      message: 'Post saved successfully' 
    })
  } catch (error: any) {
    console.error('Error saving post:', error)
    return res.status(500).json({ 
      error: error.message || 'Failed to save post' 
    })
  }
}

