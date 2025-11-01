import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllPosts } from '@/lib/posts'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const posts = getAllPosts()
    return res.status(200).json({ posts })
  } catch (error: any) {
    console.error('Error fetching posts:', error)
    return res.status(500).json({ 
      error: error.message || 'Failed to fetch posts' 
    })
  }
}

