/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://howz.dev',
    generateRobotsTxt: true,
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 5000,
    exclude: ['/sitemap-howz.xml'], 
    robotsTxtOptions: {
        additionalSitemaps: [
            'https://howz.dev/sitemap-howz.xml',
        ],
    },
}