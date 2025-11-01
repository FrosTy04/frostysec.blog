import { GetStaticProps } from 'next'
import Link from 'next/link'
import { getAllPosts, Post } from '@/lib/posts'

interface HomeProps {
  posts: Post[]
}

export default function Home({ posts }: HomeProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="space-y-12">
        {posts.map((post) => (
          <article key={post.slug} className="border-b border-gray-100 pb-12 last:border-b-0">
            <Link href={`/posts/${post.slug}`} className="block group">
              <h2 className="text-3xl font-semibold mb-3 group-hover:opacity-70 transition-opacity">
                {post.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.author}</span>
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">{post.excerpt}</p>
            </Link>
          </article>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500">No posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts()
  return {
    props: {
      posts,
    },
  }
}

