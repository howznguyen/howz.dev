# Howz.Dev - Personal Website and Blog

[![](https://img.shields.io/github/issues/howznguyen/howz.dev?color=0088ff)](https://github.com/howznguyen/howz.dev/issues)
[![](https://img.shields.io/github/languages/top/howznguyen/howz.dev)](https://github.com/howznguyen/howz.dev)
[![](https://img.shields.io/github/manifest-json/v/howznguyen/howz.dev)](https://github.com/howznguyen/howz.dev/releases)
[![](https://img.shields.io/github/discussions/howznguyen/howz.dev)](https://github.com/howznguyen/howz.dev/discussions)

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

You can duplicate the Notion page for database template [here](https://howznguyen.notion.site/Howz-Nguyen-Blog-Template-6085aaf78b84462bb137db0e8fea2676). 

Once you have your own duplicate page, you can get the `NOTION_API_KEY` and database IDs needed to run the project. To get your `NOTION_API_KEY`, follow these steps:

1. Go to your [Notion integrations page](https://developers.notion.com/docs/getting-started#step-2-share-a-database-with-your-integration).
2. Click on the "Create new integration" button.
3. Give your integration a name and click the "Submit" button.
4. You'll now see your integration listed on the page. Click on the integration's name.
5. You should now see your integration details page. You can find your `NOTION_API_KEY` under the "Internal Integration Tokens" section.

To add your app into page, folow these steps:
1. Open your duplicated database in Notion.
2. Click on the three dots in the top-right corner of the page.
3. Then you selecting "Add connections" and choosing your app name.

To get the database IDs, follow these steps:

1. Open your duplicated database in Notion.
2. Click on the three dots in the top-right corner of the page.
3. Click on "Copy link URL."
4. You should see the database ID in the URL. It's the long string of characters between the last two forward slashes.

Update the `.env` file with your `NOTION_API_KEY` and the database IDs for your settings, navigation, footer, and posts databases. Use the `.env.example` file as a guide.

### Customization Language Content & Categories in Home Page (Optional)

You can customize the language content and categories in folder `src/lang`
In this folder, you can see 2 files `en.json` and `vi.json`. You can add more language file with the same format.

If you want to customize the categories in home page, you can edit values in key `categories` in `en.ts` and `vi.ts` file.

### Giscus Setup (Optional)

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

### Google Analytics Setup (Optional)

To enable Google Analytics, you need to set up a Google Analytics account and obtain a tracking ID. You can find more information on the [Google Analytics website](https://analytics.google.com/).

1. Sign up for a Google Analytics account and create a new property.
2. Choose the "Web" option as your platform.
3. Configure your property by providing your website information.
4. In your `.env` file, add the following variable with the value for your Google Analytics tracking ID:

```env
NEXT_PUBLIC_GA_TRACKING_ID=tracking-id
```

### Running the Project

To run the project, you can use the following command:
```bash
npm run start:all
```

The project will be available at [http://localhost:3000](http://localhost:3000).