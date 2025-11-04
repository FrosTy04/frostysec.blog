import { notFound } from 'next/navigation'
import Link from 'next/link'
import { remark } from 'remark'
import html from 'remark-html'
import { db } from '@/lib/db'

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const posts = await db.post.findMany({
      select: { slug: true },
    })
    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await db.post.findUnique({
    where: { slug },
  })

  if (!post) {
    notFound()
  }

  const processedContent = await remark().use(html).process(post.content)
  const contentHtml = processedContent.toString()

  const dateStr = post.date.toISOString().split('T')[0]

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8 inline-block transition-colors">
        ← Back to posts
      </Link>
      
      <article className="prose prose-lg max-w-none dark:prose-invert">
        <h1 className="text-4xl font-semibold mb-4 text-black dark:text-white">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <span>{dateStr}</span>
          <span>•</span>
          <span>{post.author}</span>
        </div>

        <div 
          className="text-gray-800 dark:text-gray-200 leading-relaxed space-y-4 prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
    </div>
  )
}
