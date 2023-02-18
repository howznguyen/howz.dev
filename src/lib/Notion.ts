import { Client } from '@notionhq/client';
import { NotionToMarkdown }  from "notion-to-md";
import readingTime from 'reading-time';
import { 
    NOTION_API_KEY, 
    SETTING_DATABASE_ID,
    NAVIGATION_DATABASE_ID,
    FOOTER_DATABASE_ID,
    POST_DATABASE_ID,
} from '@/lib/env'

const notion = new Client({ auth: NOTION_API_KEY});
// passing notion client to the option
const n2m = new NotionToMarkdown({ notionClient: notion });

const Notion = {

    /**
     * Retrieves posts from a Notion database using the Notion API, with support for custom filters and sorting rules.
     *
     * @async
     * @function getPosts
     *
     * @param {Object} [options={}] - An optional object parameter.
     * @param {Object} [options.filter={}] - An optional object containing custom filters to apply to the query.
     * @param {Object} [options.sort={}] - An optional object containing custom sorting rules to apply to the query.
     *
     * @returns {Promise<Array>} A Promise that resolves to an array of post objects.
     *
     * @example
     *
     * const posts = await getPosts({ 
     *   filter: { 
     *     category: { equals: 'Technology' } 
     *   }, 
     *   sort: { 
     *     views: 'descending' 
     *   } 
     * });
     */
    async getPosts({ filter = {}, sort = {}} = {}) {
        let _filter : any = Object.entries(filter).map(([key, value] : [string, any]) => {
            return {
                property: key,
                ...value,
            };
        });

        let _sorts = Object.entries(sort).map(([key, value] : [string, any]) => {
            return {
                property: key,
                direction: value,
            };
        });

        const response = await notion.databases.query({
            database_id: POST_DATABASE_ID,
            filter: {
                and : [
                    {
                        property: 'published',
                        date: { before: new Date().toISOString() },
                    },
                    ..._filter,
                ]
            },
            sorts: [
                ..._sorts,
                {
                    property: 'published',
                    direction: 'descending',
                },
            ],
        });

        let posts = await this.convertNotionDatabaseToPosts(response.results);

        return posts;
    },
    

    async getPostBySlug(slug : string) {
        let post : any = {};
        const response = await notion.databases.query({
            database_id: POST_DATABASE_ID,
            filter: {
                property: 'slug',
                rich_text: { equals: slug },
            },
        });

        if(response.results.length === 0)
            return {};
        let posts = await this.convertNotionDatabaseToPosts(response.results);

        post = {
            ...(posts[0])
        };

        post.contents = await this.getChildern(post.id);

        return post;
    },

    async updateViewsBySlug(slug : string) {
        const response = await notion.databases.query({
            database_id: POST_DATABASE_ID,
            filter: {
                property: 'slug',
                rich_text: { equals: slug },
            },
        });

        if(response.results.length === 0)
            return {};

        let post : any = response.results[0];

        let views = this.getProperties(post.properties.views);
        views = views ? views + 1 : 1;

        return await notion.pages.update({
            page_id: post.id,
            properties: {
                views: {
                    number: views,
                },
            },
        });
    },

    async getTagsBySlug(slug : string) {
        let posts : any = [];
        const response = await notion.databases.query({
            database_id: POST_DATABASE_ID,
            filter: {
                property: 'tags',
                multi_select: { contains: slug },
            },
        });
        
        posts = await this.convertNotionDatabaseToPosts(response.results);

        return posts;
    },

    async getNotionOptions() {
        let settings = await this.getSettings();
        let navigation = await this.getNavigation();
        let footer = await this.getFooter();

        return {
            settings,
            navigation,
            footer,
        };
    },

    async getSettings() {
        let response = await notion.databases.query({
            database_id: SETTING_DATABASE_ID,
        });

        let settings = response.results.reduce((acc : any, item : any) => {
            let key = this.getProperties(item.properties.name).content;
            let value = this.getProperties(item.properties.value).content;
            acc[key] = value;
            return acc;
        }, {});

        return settings;
    },

    async getNavigation() {
        let response = await notion.databases.query({
            database_id: NAVIGATION_DATABASE_ID,
        });

        let navigation = response.results.sort((a : any, b : any) => {
            let aParent = this.getProperties(a.properties.parent)?.id || null;
            let bParent = this.getProperties(b.properties.parent)?.id || null;

            if(aParent === bParent || (!aParent && !bParent)){
                let aIndex = this.getProperties(a.properties.index);
                let bIndex = this.getProperties(b.properties.index);
                return aIndex - bIndex;
            } else {
                if(aParent && bParent){
                    return aParent.localeCompare(bParent);
                } else {
                    return aParent ? 1 : -1;
                }
            }
        }).map((item : any) => {
            let id = item.id;
            let title = this.getProperties(item.properties.title).content;
            let index = this.getProperties(item.properties.index);
            let url = this.getProperties(item.properties.url).content;
            let parent = this.getProperties(item.properties.parent)?.id || null;
            let children: any[] = [];

            return {
                id,
                title,
                index,
                url,
                parent,
                children,
            };
        });

        navigation = navigation.reduce((acc : any, item : any) => {
            let parentObj = (item.parent) ? navigation.filter(el => el.id === item.parent) : [];

            if (parentObj.length) {
                parentObj[0].children.push(item);
            } else {
                acc.push(item);
            }
            return acc;
        }, []);

        return navigation;
    },

    async getFooter() {
        let response = await notion.databases.query({
            database_id: FOOTER_DATABASE_ID,
        });

        let footer = response.results.sort((a : any, b : any) => {
            let aIndex = this.getProperties(a.properties.index);
            let bIndex = this.getProperties(b.properties.index);
            return aIndex - bIndex;
        }).map((item : any) => {
            let id = item.id;
            let title = this.getProperties(item.properties.title).content;
            let index = this.getProperties(item.properties.index);
            let url = this.getProperties(item.properties.url).content;

            return {
                id,
                title,
                index,
                url,
            };
        });

        return footer;
    },

    async getChildern(id : string) {
        let _this = this;
        const response = await notion.blocks.children.list({
            block_id: id,
        });

        let results : any = response.results;

        for (let i in results) {
            let item = results[i];
            if(item.has_children){
                let children = await _this.getChildern(item.id);
                results[i].children = children;
            }
            
        }

        return results;
    },


    async convertNotionDatabaseToPosts(notionDatabase : any) {
        return await Promise.all(notionDatabase.map(async (post : any) => {
            const mdblocks = await n2m.pageToMarkdown(post.id);
            const mdString = n2m.toMarkdownString(mdblocks);

            const {minutes} = readingTime(mdString);

            return {
                id: post.id,
                title: this.getProperties(post.properties.title).content,
                cover: this.getProperties(post.cover).url,
                published: this.getProperties(post.properties.published),
                slug: this.getProperties(post.properties.slug).content,
                tags: this.getProperties(post.properties.tags, true) || [],
                authors: this.getProperties(post.properties.authors, true),
                description: this.getProperties(post.properties.description).content,
                featured: this.getProperties(post.properties.featured),
                readingTime: Math.ceil(minutes),
                views: this.getProperties(post.properties.views),
            };
        }));
    },

    getProperties(param : any, isGetAllArray : boolean = false) : any{
        if (param && param instanceof Object && 'object' in param && param.object === 'user') {
            return param;
        } else if(param && param instanceof Object && 'type' in param) {
            return this.getProperties(param[param.type], isGetAllArray);
        } else if (param && param instanceof Array) {
            if(isGetAllArray){
                return param.map((item : any) => this.getProperties(item, isGetAllArray));
            }else{
                return this.getProperties(param[0], isGetAllArray);
            }
        } else {
            return param;
        }
    }
}


export default Notion;