import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username, password } = req.body

    // Get credentials from environment variables
    const adminUser = process.env.ADMIN_USER
    const adminPass = process.env.ADMIN_PASS

    // Check if environment variables are set
    if (!adminUser || !adminPass) {
      console.error('Admin credentials not configured in environment variables')
      return res.status(500).json({ error: 'Server configuration error' })
    }

    // Validate credentials
    if (username === adminUser && password === adminPass) {
      return res.status(200).json({ 
        success: true,
        message: 'Login successful' 
      })
    } else {
      return res.status(401).json({ 
        error: 'Invalid username or password.' 
      })
    }
  } catch (error: any) {
    console.error('Error during login:', error)
    return res.status(500).json({ 
      error: 'Internal server error' 
    })
  }
}

