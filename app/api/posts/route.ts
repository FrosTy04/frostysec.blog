import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const posts = await db.post.findMany({
      orderBy: {
        date: 'desc',
      },
    })
    
    // Format posts for frontend
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date.toISOString().split('T')[0],
      author: post.author,
    }))
    
    return NextResponse.json({ posts: formattedPosts })
  } catch (error: any) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, excerpt, content } = body

    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (title.length > 200 || excerpt.length > 500) {
      return NextResponse.json(
        { error: 'Field length exceeds limit' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Ensure unique slug
    let uniqueSlug = slug
    let counter = 1
    while (await db.post.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    const post = await db.post.create({
      data: {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        slug: uniqueSlug,
        author: 'frostysec',
      },
    })

    const posts = await db.post.findMany({
      orderBy: {
        date: 'desc',
      },
    })

    const formattedPosts = posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      date: p.date.toISOString().split('T')[0],
      author: p.author,
    }))
    
    return NextResponse.json({
      success: true,
      slug: post.slug,
      posts: formattedPosts,
      message: 'Post saved successfully'
    })
  } catch (error: any) {
    console.error('Error saving post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save post' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    const postId = parseInt(id, 10)
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      )
    }

    await db.post.delete({
      where: { id: postId },
    })

    const posts = await db.post.findMany({
      orderBy: {
        date: 'desc',
      },
    })

    const formattedPosts = posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      date: p.date.toISOString().split('T')[0],
      author: p.author,
    }))

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      message: 'Post deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete post' },
      { status: 500 }
    )
  }
}
