# Howz.Dev - Personal Website and Blog

![](https://img.shields.io/github/issues/howznguyen/howz.dev?color=0088ff)
![](https://img.shields.io/github/languages/top/howznguyen/howz.dev)
![](https://img.shields.io/github/package-json/v/howznguyen/howz.dev)
![](https://img.shields.io/github/discussions/howznguyen/howz.dev)

💠 This is my personal website and blog, built using Next.js, TypeScript, Tailwind CSS, and Notion. The blog posts are managed in Notion, and the website pulls the content from the Notion API at build time.

## Notable Features

- Landing page with customizable background image and hero text
- Blog page with pagination and search functionality
- Separate pages for each blog post
- Dynamically generated RSS feed
- Automatic sitemap generation
- Notion as a CMS for blog content management
- Integration with Giscus for comment section

## Setup & Config
To get started with this project, follow these steps:

To get started with this project, you can clone the repository and install the dependencies:
```bash
git clone https://github.com/howznguyen/howz.dev.git
cd howz.dev
npm install
```

Copy the .env file to .env.example:
```bash
cp .env .env.example
```
### Notion Database Setup

You can duplicate the Notion page for database template [here](https://chenjinguyen.notion.site/chenjinguyen/Howz-Nguyen-Blog-Template-6085aaf78b84462bb137db0e8fea2676). 

Once you have your own duplicate page, you can get the `NOTION_API_KEY` and database IDs needed to run the project. To get your `NOTION_API_KEY`, follow these steps:

1. Go to your [Notion integrations page](https://developers.notion.com/docs/getting-started#step-2-share-a-database-with-your-integration).
2. Click on the "Create new integration" button.
3. Give your integration a name and click the "Submit" button.
4. You'll now see your integration listed on the page. Click on the integration's name.
5. You should now see your integration details page. You can find your `NOTION_API_KEY` under the "Internal Integration Tokens" section.

To get the database IDs, follow these steps:

1. Open your duplicated database in Notion.
2. Click on the three dots in the top-right corner of the page.
3. Click on "Properties."
4. You should see the database ID in the URL. It's the long string of characters between the last two forward slashes.

Update the `.env` file with your `NOTION_API_KEY` and the database IDs for your settings, navigation, footer, and posts databases. Use the `.env.example` file as a guide.

### Giscus Setup

To enable commenting functionality using Giscus, you need to set up a repository and obtain a repository ID. You can find more information on the [Giscus website](https://giscus.app/).

1. Sign up for a Giscus account and create a new site.
2. Choose the "GitHub Discussions" option as your comment platform.
3. Configure your site by providing your GitHub repository information and choosing a category name.
4. In your `.env` file, add the following variables with the values for your Giscus site:

```env
GISCUS_REPO=username/repository
GISCUS_REPO_ID=repository-id
GISCUS_CATEGORY=category-name
GISCUS_CATEGORY_ID=category-id
```

### Running the Project

To run the project, you can use the following command:
```bash
npm run start:all
```

The project will be available at [http://localhost:3000](http://localhost:3000).


## Customization

### Home Page

To customize the landing page, you can edit the `index.tsx` file.

### Blog Page

To customize the blog page, you can edit the `pages/blog.tsx` file.

### Blog Post Pages

To customize the blog post pages, you can edit the `pages/posts/[slug].tsx` file.

### Styling

To customize the styling, you can edit