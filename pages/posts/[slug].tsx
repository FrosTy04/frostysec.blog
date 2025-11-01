import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { remark } from 'remark'
import html from 'remark-html'
import { getAllPosts, getPostBySlug, Post } from '@/lib/posts'

interface PostPageProps {
  post: Post & { contentHtml: string }
}

function ShareButton({ platform, title, url }: { platform: 'twitter' | 'linkedin'; title: string; url: string }) {
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }
  
  const labels = {
    twitter: 'Share on Twitter',
    linkedin: 'Share on LinkedIn',
  }
  
  return (
    <a
      href={shareUrls[platform]}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-gray-600 hover:text-black transition-colors"
    >
      {labels[platform]}
    </a>
  )
}

export default function PostPage({ post }: PostPageProps) {
  // Base URL for social sharing (update this to your actual domain)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://frostysec.blog'
  const postUrl = `${baseUrl}/posts/${post.slug}`
  
  // Generate table of contents from headings (simple implementation)
  const headingRegex = /<h([2-3])[^>]*>(.*?)<\/h[2-3]>/g
  const toc: Array<{ level: number; text: string; id: string }> = []
  let match
  
  while ((match = headingRegex.exec(post.contentHtml)) !== null) {
    const level = parseInt(match[1])
    const text = match[2].replace(/<[^>]+>/g, '')
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    toc.push({ level, text, id })
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" className="text-gray-600 hover:text-black mb-8 inline-block transition-colors">
        ← Back to posts
      </Link>
      
      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-semibold mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
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

        {/* Table of Contents (optional, shows for posts with 2+ headings) */}
        {toc.length >= 2 && (
          <div className="border-l-2 border-gray-200 pl-6 py-4 mb-12 bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-sm">
              {toc.map((item, idx) => {
                // Add id to heading if not already present
                return (
                  <li key={idx} style={{ marginLeft: `${(item.level - 2) * 1}rem` }}>
                    <a href={`#${item.id}`} className="text-gray-700 hover:text-black">
                      {item.text}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Social Share Buttons (optional, minimal) */}
        <div className="flex gap-4 mb-12 pb-8 border-b border-gray-200">
          <ShareButton 
            platform="twitter" 
            title={post.title} 
            url={postUrl}
          />
          <ShareButton 
            platform="linkedin" 
            title={post.title} 
            url={postUrl}
          />
        </div>

        <div 
          className="text-gray-800 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts()
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      notFound: true,
    }
  }

  // Convert markdown to HTML
  const processedContent = await remark().use(html).process(post.content)
  const contentHtml = processedContent.toString()

  return {
    props: {
      post: {
        ...post,
        contentHtml,
      },
    },
  }
}

