# Howz.Dev - Personal Website and Blog

[![](https://img.shields.io/github/languages/top/howznguyen/howz.dev)](https://github.com/howznguyen/howz.dev)
[![](https://img.shields.io/github/manifest-json/v/howznguyen/howz.dev)](https://github.com/howznguyen/howz.dev/releases)
[![](https://img.shields.io/github/discussions/howznguyen/howz.dev)](https://github.com/howznguyen/howz.dev/discussions)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC.svg)](https://tailwindcss.com/)
[![Notion](https://img.shields.io/badge/Notion-CMS-000000.svg)](https://notion.so/)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE)

💠 A modern, performant personal website and blog built with Next.js 14, TypeScript, and Tailwind CSS. Content is managed through Notion as a headless CMS, providing a seamless writing experience with powerful features.

## ⚠️ Important Notice

**Development Status**: This repository will continue to be maintained and developed. However, please note that future versions of my blog may not be open source. This current version remains fully open source and available for use.

## ✨ Features

### 🚀 Core Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Notion CMS Integration**: Write and manage content directly in Notion
- **Performance Optimized**: ISR (Incremental Static Regeneration) for fast loading
- **SEO Ready**: Automatic sitemap generation, RSS feed, and meta tags
- **Responsive Design**: Mobile-first approach with dark/light theme support

### 📝 Content Management

- **Notion as CMS**: Manage blog posts, pages, and content in Notion
- **Rich Content Support**: Headings, lists, code blocks, images, videos, bookmarks
- **Tag System**: Organize content with tags and categories
- **Reading Time**: Automatic calculation of reading time
- **Views Tracking**: Integration with Umami analytics

### 🎨 User Experience

- **Dark/Light Theme**: Automatic theme switching with system preference
- **Table of Contents**: Auto-generated TOC for blog posts
- **Search Functionality**: Basic search through blog posts (title and description)
- **Pagination**: Efficient content browsing
- **Comments**: Giscus integration for community engagement

### 🔧 Developer Experience

- **Type Safety**: Full TypeScript coverage
- **Modular Architecture**: Well-organized service layer
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Performance Monitoring**: Built-in analytics and performance tracking

## 🏗️ Architecture

### Technical Decisions

This project implements a pure unofficial Notion APIs approach, inspired by [Anh-Thi Dinh's architectural insights](https://dinhanhthi.com/note/how-i-create-this-site/#how-to-use-unofficial-apis-f7780):

**Why This Architecture?**

- **Unofficial APIs Only**: Complete implementation using unofficial Notion APIs
- **Maximum Performance**: Fastest possible data retrieval and rendering
- **Full Feature Support**: Complete access to all Notion block types and styles

### Service Layer Structure

```
src/services/notion/
├── index.ts                 # Main entry point
├── main.service.ts          # Core Notion service (unofficial APIs)
├── api.service.ts           # Unofficial API functions
├── utils.service.ts         # Utility functions & data conversion
├── notion-x.service.ts      # NotionX integration (unofficial APIs)
├── enhanced.service.ts      # Enhanced service with performance optimizations
├── unofficial-api.service.ts # Unofficial API service
└── render.service.ts        # Content rendering & styling
```

### Component Architecture

```
src/components/
├── atoms/                   # Basic UI components
├── molecules/               # Composite components
├── organisms/               # Complex components
├── templates/               # Page templates
├── notion/                  # Notion-specific components
└── providers/               # Context providers
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Notion account
- GitHub account (for comments)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/howznguyen/howz.dev.git
cd howz.dev
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Environment Setup**

```bash
cp .env.example .env.local
```

4. **Configure environment variables**

```env
# Notion Configuration
NOTION_API_KEY=your_notion_api_key
NOTION_POST_DATABASE_ID=your_database_id
NOTION_SPACE_ID=your_space_id
NOTION_TOKEN_V2=your_token_v2
NOTION_ACTIVE_USER=your_active_user
NOTION_API_WEB=https://www.notion.so/api/v3

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME="Your Site Name"
NEXT_PUBLIC_SITE_DESCRIPTION="Your site description"

# Analytics (Optional)
NEXT_PUBLIC_GA_TRACKING_ID=your_ga_id
UMAMI_WEBSITE_ID=your_umami_id
UMAMI_SCRIPT_URL=your_umami_url

# Comments (Optional)
GISCUS_REPO=username/repository
GISCUS_REPO_ID=repository_id
GISCUS_CATEGORY_ID=category_id
```

## 📋 Notion Setup

### Why Unofficial APIs?

Based on the insights from [Anh-Thi Dinh's experience](https://dinhanhthi.com/note/how-i-create-this-site/#how-to-use-unofficial-apis-f7780), we use unofficial Notion APIs instead of official ones for several critical reasons:

- **Speed**: Unofficial APIs are extremely fast, with retrieval speed equal to that of the Notion site
- **Full Style Support**: Complete support for all block styles and formatting
- **No Rate Limits**: Avoid 429 "Too many requests" errors that plague official APIs
- **Search Functionality**: Basic search through blog posts (title and description)
- **Image Support**: Direct access to images uploaded to Notion
- **Future Enhancement**: Full-text search capability can be added using unofficial APIs

### 1. Database Template

Use our [Notion template](https://howznguyen.notion.site/Howz-Nguyen-Blog-Template-6085aaf78b84462bb137db0e8fea2676) or create your own with these properties:

**Posts Database:**

- `title` (Title)
- `slug` (Rich Text)
- `description` (Rich Text)
- `tags` (Multi-select)
- `status` (Select: Published, Draft, Archived)
- `published` (Date)
- `featured` (Checkbox)
- `views` (Number)

### 2. Get Required IDs and Tokens

**From Notion URLs:**

- **Database ID**: Found in the URL after the last `/`
- **Space ID**: Found in the URL after `notion.so/`
- **Collection View ID**: Found in the database view URL

**From Browser (Chrome/Edge):**

1. **Open Notion** in your browser and log in
2. **Open Developer Tools** (F12 or right-click → Inspect)
3. **Go to Application tab** → Cookies → `https://www.notion.so`
4. **Find these cookies:**
   - `token_v2`: Copy the value (this is your `NOTION_TOKEN_V2`)
   - `notion_active_user`: Copy the value (this is your `NOTION_ACTIVE_USER`)

**Alternative - From Network Tab:**

1. **Open Developer Tools** → Network tab
2. **Refresh Notion page** or navigate to your database
3. **Look for API requests** to `notion.so/api/v3`
4. **Check request headers** for `cookie` field containing the tokens

**Detailed Guide (Based on [Dinh Anh Thi's approach](https://dinhanhthi.com/note/how-i-create-this-site/#how-to-use-unofficial-apis-f7780)):**

The unofficial APIs we use are actually from Notion, but they are not publicly available. When you view your note in the browser, you're already signed in and using your credentials to request content from Notion using their hidden APIs.

**To see the requests:**

1. Open Developer Tools → Network tab
2. Browse your database in Notion
3. Look for requests to `notion.so/api/v3`

**For authorization, you need:**

- `token_v2`: Your authentication token
- `notion_user_id`: Your user ID (found in `notion_active_user` cookie)

**Request headers should include:**

```json
{
  "Content-Type": "application/json",
  "cookie": "token_v2={{your_token_v2}}",
  "x-notion-active-user-header": "{{your_notion_user_id}}"
}
```

**To fill the request body:**
Simply replicate the actions performed in the "Payload" tab of each request you see in the browser.

### 3. Environment Variables (Unofficial APIs Only)

```env
# Site Settings
BASE_URL=https://your-domain.com

# Unofficial Notion APIs Configuration
NOTION_TOKEN_V2=your_token_v2_from_browser_cookies
NOTION_ACTIVE_USER=your_active_user_from_browser_cookies
NOTION_SPACE_ID=your_space_id_from_notion_url
NOTION_POST_DATABASE_VIEW=your_collection_view_id
NOTION_POST_DATABASE_ID=your_database_id
NOTION_API_WEB=https://www.notion.so/api/v3

# Umami Analytics (Optional)
UMAMI_HOST=https://api.umami.is/v1
UMAMI_WEBSITE_ID=your_umami_website_id
UMAMI_TOKEN=your_umami_api_token
NEXT_PUBLIC_UMAMI_SCRIPT=https://cloud.umami.is
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your_umami_website_id

# Google Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_measurement_id
```

### 4. Giscus Setup (Optional)

This project supports Giscus for comments. To enable comments:

1. **Create a GitHub Repository** (if you haven't already)
2. **Install Giscus App** on your repository
3. **Get Configuration** from [giscus.app](https://giscus.app)
4. **Add Environment Variables**:

```env
# Giscus Configuration
GISCUS_REPO=your-username/your-repo
GISCUS_REPO_ID=your_github_repo_id
GISCUS_CATEGORY=General
GISCUS_CATEGORY_ID=your_giscus_category_id
```

### 5. Performance Considerations

As mentioned in [the detailed guide](https://dinhanhthi.com/note/how-i-create-this-site/#how-to-use-unofficial-apis-f7780), consider these optimizations:

- **Separate Databases**: Use different databases for different content types (posts, projects, bookmarks)
- **Image Handling**: Consider using third-party services like Cloudinary for image optimization
- **Build Time**: Unofficial APIs significantly reduce build times compared to official APIs
- **Rate Limiting**: Unofficial APIs don't have the same rate limits as official APIs

### 6. Troubleshooting Common Issues

Based on [real-world experience](https://dinhanhthi.com/note/how-i-create-this-site/#how-to-use-unofficial-apis-f7780), here are common issues and solutions:

**429 Errors (Too Many Requests)**

- Problem: Not applicable with unofficial APIs
- Solution: Unofficial APIs don't have the same rate limits as official APIs

**404 Errors on Posts**

- Problem: Server-side rendering issues
- Solution: Instruct users to refresh the page

**Build Timeouts on Vercel**

- Problem: Free tier has 10-second execution limit
- Solution: Use unofficial APIs and optimize code performance

**Database Privacy Concerns**

- Problem: Need to make database public for full functionality
- Solution: Use third-party image services (Cloudinary, Imgur) for images

## 🎨 Customization

### Content Management

- **Blog Posts**: Create in your Notion database
- **Pages**: Add to the pages database
- **Navigation**: Update in `datas/navigation.ts`
- **Footer**: Customize in `datas/footer.ts`

### Styling

- **Theme**: Modify `tailwind.config.js`
- **Colors**: Update CSS variables in `globals.css`
- **Components**: Customize in `src/components/`

### Features

- **Comments**: Configure Giscus in environment variables
- **Analytics**: Add Google Analytics or Umami tracking
- **Search**: Customize search functionality in components

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app works on any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for excellent user experience
- **ISR**: Content updates without full rebuilds
- **Image Optimization**: Next.js Image component with WebP support
- **Code Splitting**: Automatic code splitting for optimal loading

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Notion](https://notion.so/) - The amazing CMS
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Giscus](https://giscus.app/) - Comments system
- [Umami](https://umami.is/) - Privacy-focused analytics

## 🚀 Roadmap

### Planned Features

- **Full-text Search**: Advanced search through all content using unofficial APIs
- **Advanced Filtering**: Filter posts by multiple tags, date ranges, and categories
- **Content Recommendations**: Related posts and content suggestions
- **Performance Optimizations**: Further improvements to build times and loading speeds

### Future Enhancements

- **Multi-language Support**: Internationalization for different languages
- **Advanced Analytics**: Enhanced tracking and insights
- **Content Scheduling**: Schedule posts for future publication
- **API Endpoints**: RESTful API for external integrations

## 📞 Support

If you have any questions or need help:

- 📧 Email: [me@howznguyen.dev](mailto:me@howznguyen.dev)
- 🐛 Issues: [GitHub Issues](https://github.com/howznguyen/howz.dev/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/howznguyen/howz.dev/discussions)

---

⭐ **Star this repository if you found it helpful!**

Made with ❤️ by [Howz Nguyen](https://howz.dev)
