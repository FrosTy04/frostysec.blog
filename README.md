# frostysec.blog

A minimalist blog website for bug bounty, cybersecurity, and penetration testing content. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Clean, minimalist design** - Medium-style layout with white background, black text, and plenty of whitespace
- **Responsive and mobile-friendly** - Works seamlessly on all devices
- **Static site generation** - Fast loading with Next.js static generation
- **Admin panel** - Protected writeup form for adding new posts
- **Markdown support** - Write posts in Markdown with full rendering
- **Basic Auth protection** - Admin panel secured with Basic Auth
- **No database required** - Posts stored as JSON or Markdown files

## 🚨 Security Warnings

### **CRITICAL: Admin Credentials**



**⚠️ YOU MUST CHANGE THESE BEFORE DEPLOYING TO PRODUCTION!**

1. Set environment variables in your hosting platform:
   - `ADMIN_USERNAME` - Your secure username
   - `ADMIN_PASSWORD` - Use a strong, randomly generated password

2. The middleware (`middleware.ts`) will automatically use these environment variables if set, otherwise it falls back to the defaults.

3. **Additional security recommendations:**
   - Enable Cloudflare rate limiting (see Cloudflare setup below)
   - Use two-factor authentication for your hosting account
   - Regularly rotate credentials
   - Monitor access logs for unauthorized attempts
   - If file writes are enabled, ensure proper input sanitization (already implemented in `lib/posts.ts`)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Blog
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your admin credentials:
```bash
ADMIN_USER=well
ADMIN_PASS=woof
```

**Note:** For production, use strong, randomly generated credentials. Never commit `.env.local` to version control (it's already in `.gitignore`).

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Local Workflow

**View posts:**
- Visit `http://localhost:3000` for the homepage
- Visit `http://localhost:3000/about` for the about page
- Visit `http://localhost:3000/admin` for admin login

**Add a new post locally:**
1. Edit `posts.json` directly and add a new entry, OR
2. Add a new markdown file to `/content` directory with frontmatter, OR
3. Use the admin panel at `/admin`

**Rebuild after local changes:**
```bash
npm run build
npm start
```

## Project Structure

```
├── pages/
│   ├── index.tsx          # Homepage (lists all posts)
│   ├── about.tsx          # About page
│   ├── admin.tsx          # Admin login page
│   ├── admin/
│   │   └── dashboard.tsx  # Admin dashboard (after login)
│   ├── posts/
│   │   └── [slug].tsx     # Individual post page
│   └── api/
│       └── posts.ts     # API route to save posts
├── components/
│   └── Navbar.tsx         # Navigation component
├── lib/
│   └── posts.ts           # Post reading/writing utilities
├── content/               # Markdown posts (optional)
├── posts.json             # JSON posts file
├── middleware.ts          # Basic Auth middleware
└── styles/
    └── globals.css        # Global Tailwind styles
```

## Content Sources

Posts can be stored in two formats:

1. **JSON file** (`posts.json`) - Single file with all posts
2. **Markdown files** (`content/*.md`) - Individual markdown files with frontmatter

The system automatically merges both sources. The admin panel saves new posts to `posts.json`.

### Markdown File Format

Create a file in `/content` directory:

```markdown
---
title: "Your Post Title"
date: "2024-03-30"
author: "frostysec"
tags: ["bug-bounty", "writeup"]
excerpt: "Short description of your post"
---

Your markdown content here...
```

## Building for Production

```bash
npm run build
npm start
```

The site uses Next.js static generation, making it perfect for deployment on Vercel, Netlify, or any static hosting provider.

## Deployment

### Deploy to Vercel



### Deploy to Netlify

1. Push your code to GitHub
2. Import project in [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Set environment variables in site settings

## Cloudflare Integration

To connect `frostysec.blog` to Cloudflare and enhance security:

### 1. Add Domain to Cloudflare

1. Sign up for a [Cloudflare account](https://cloudflare.com)
2. Add your domain (`frostysec.blog`)
3. Cloudflare will scan your existing DNS records
4. Update your nameservers to point to Cloudflare (as instructed)

### 2. DNS Configuration

1. In Cloudflare Dashboard → DNS → Records:
   - If using Vercel: Add a CNAME record pointing to `cname.vercel-dns.com`
   - If using Netlify: Add a CNAME record pointing to your Netlify domain
   - Or use an A record with your host's IP address

2. Set **Proxy status** to "Proxied" (orange cloud) for DDoS protection

### 3. SSL/TLS Settings

1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to **Full** (recommended) or **Full (strict)** if your host provides valid certificates
3. Enable **Always Use HTTPS**

### 4. Web Application Firewall (WAF)

1. Go to **Security** → **WAF**
2. Enable the **WAF**
3. Create custom rules:
   - Block requests to `/admin` that don't have proper User-Agent
   - Rate limit `/admin` endpoint (see Rate Limiting below)

4. Recommended OWASP rulesets:
   - Enable **OWASP Core Rule Set** (CRS)
   - Enable protection against SQL injection, XSS, and other common attacks

### 5. Rate Limiting

1. Go to **Security** → **WAF** → **Rate Limiting**
2. Create a rate limiting rule for `/admin`:
   - **Path**: `/admin`
   - **Limit**: `5 requests per 5 minutes` (adjust as needed)
   - **Action**: `Block`
   - This helps prevent brute force attacks

3. Create another rule for API routes:
   - **Path**: `/api/posts`
   - **Limit**: `10 requests per minute`
   - **Action**: `Block`

### 6. Page Rules / Cache Configuration

1. Go to **Rules** → **Page Rules** (or **Cache Rules** in newer accounts)
2. Create rules:

   **Rule 1: Cache static assets**
   - URL pattern: `frostysec.blog/*.css`, `frostysec.blog/*.js`, `frostysec.blog/_next/static/*`
   - Settings: Cache Level → Cache Everything, Edge Cache TTL → 1 month

   **Rule 2: Bypass cache for admin**
   - URL pattern: `frostysec.blog/admin*`
   - Settings: Cache Level → Bypass

   **Rule 3: Bypass cache for API**
   - URL pattern: `frostysec.blog/api/*`
   - Settings: Cache Level → Bypass

### 7. Bot Management (Optional)

1. Go to **Security** → **Bots**
2. Enable **Bot Fight Mode** (free) or **Bot Management** (paid)
3. This helps block malicious bots and scrapers

### 8. Additional Security Settings

1. **Security** → **Settings**:
   - Enable **Challenge Passage** (if needed)
   - Set **Security Level** to Medium or High
   - Enable **Browser Integrity Check**

2. **Speed** → **Optimization**:
   - Enable **Auto Minify** for HTML, CSS, JavaScript
   - Enable **Brotli** compression

### 9. Security Headers

1. Go to **Rules** → **Transform Rules** → **Modify Response Header**
2. Add security headers:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`

### Cloudflare Setup Checklist

- [ ] Domain added to Cloudflare
- [ ] Nameservers updated
- [ ] DNS records configured (CNAME or A record)
- [ ] SSL/TLS mode set to Full
- [ ] WAF enabled with OWASP rules
- [ ] Rate limiting rules configured for `/admin` and `/api/posts`
- [ ] Page rules set for caching (cache static, bypass admin/API)
- [ ] Bot Fight Mode enabled
- [ ] Security headers configured
- [ ] Environment variables set in hosting platform (Vercel/Netlify)

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure

- **Static Generation**: All pages use `getStaticProps` for static generation
- **Basic Auth**: Implemented in `middleware.ts` using Next.js middleware
- **Post Management**: `lib/posts.ts` handles reading from JSON and Markdown, writing to JSON
- **API Routes**: `/api/posts` handles POST requests to save new posts

## Security Notes

### Input Sanitization

- Post titles and content are trimmed and validated for length
- Slug generation sanitizes input (alphanumeric and hyphens only)
- Path traversal protection in `lib/posts.ts`
- File writes are restricted to the project directory

### Authentication

- Basic Auth implemented at middleware level
- Credentials should be stored as environment variables
- Rate limiting recommended via Cloudflare

### Recommendations

1. **Before Production:**
   - Change default Basic Auth credentials to environment variables
   - Enable Cloudflare WAF and rate limiting
   - Enable 2FA on hosting account
   - Regularly audit access logs

2. **File Permissions:**
   - Ensure `posts.json` has restricted write permissions
   - If using file writes, validate all inputs
   - Consider read-only filesystem for production (pre-build posts)

3. **Monitoring:**
   - Set up alerts for failed authentication attempts
   - Monitor API endpoint usage
   - Track changes to `posts.json`

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

**Remember**: Always change the default admin credentials before deploying to production!
# frostysec.blog
