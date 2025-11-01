export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-semibold mb-8">About</h1>
      <div className="prose prose-lg max-w-none space-y-6 text-gray-800 leading-relaxed">
        <p>
          Welcome to <strong>frostysec.blog</strong> — a minimalist blog dedicated to bug bounty hunting, 
          cybersecurity, and penetration testing.
        </p>
        <p>
          This site serves as a repository of writeups, tools, techniques, and lessons learned from 
          security research and bug bounty programs.
        </p>
        <p>
          The goal is to share knowledge, document findings, and contribute to the cybersecurity community 
          in a clean, readable format.
        </p>
        <div className="pt-8 border-t border-gray-200 mt-12">
          <p className="text-sm text-gray-600">
            For security researchers, by security researchers.
          </p>
        </div>
      </div>
    </div>
  )
}

