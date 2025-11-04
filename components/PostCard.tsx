import Link from 'next/link'

interface Post {
  slug: string
  title: string
  date: string
  author: string
  tags?: string[]
  excerpt: string
}

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="border-b border-gray-100 dark:border-gray-800 pb-12 last:border-b-0">
      <Link href={`/posts/${post.slug}`} className="block group">
        <h2 className="text-3xl font-semibold mb-3 text-black dark:text-white group-hover:opacity-70 transition-opacity">
          {post.title}
        </h2>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.author}</span>
          {post.tags && post.tags.length > 0 && (
            <>
              <span>•</span>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-black dark:text-white">
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{post.excerpt}</p>
      </Link>
    </article>
  )
}

