const HeadMeta = (options: any, head : any) => {
    let { settings, navigation, footer } = options ?? {};
    
    let siteName =  settings?.site_name ?? "Howz Nguyen Blog"; 
    let siteDescription = head?.description ?? settings?.site_description ?? "Howz Nguyen Blog là một blog về phát triển web, lập trình và công nghệ.";
    let siteTitle = head?.title ? `${head.title} | ${siteName}` : siteName;
    let ogImage = head?.image ?? '/assets/images/og.png';
  
    return {
        siteName,
        siteDescription,
        siteTitle,
        ogImage,
    }
}

export default HeadMeta;