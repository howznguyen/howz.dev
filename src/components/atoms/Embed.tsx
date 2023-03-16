import { useTheme } from 'next-themes';
import React, { useEffect } from 'react'
import { renderToString } from 'react-dom/server';
import Embed from 'react-embed';
import Iframe from 'react-iframe';
import { FacebookEmbed, InstagramEmbed, TikTokEmbed, TwitterEmbed } from 'react-social-media-embed';

interface EmbedBlockProps {
    url: string;
}

const EmbedBlock = ({url} : EmbedBlockProps) => {
  const { theme } = useTheme();
  const link = new URL(url);
  let cpn = <></>;
  if(link.hostname.includes("facebook.com")) {
    cpn = <FacebookEmbed url={url} width={550} />
  } else if (link.hostname.includes("instagram.com")) {
    cpn = <InstagramEmbed url={url} width={550} />
  } else if (link.hostname.includes("twitter.com")) {
    cpn = <TwitterEmbed url={url} width={550} />
  } else if (link.hostname.includes("tiktok.com")) {
    cpn = <TikTokEmbed url={url} width={550} />
  } else {
    const embed = <Embed isDark={theme === "dark"} url={url} />;
    const stringHTML = renderToString(embed);
    const notIncludesOfDomains = !link.hostname.includes("jsfiddle.net");
    if(stringHTML !== "<!--$--><!--/$-->" && notIncludesOfDomains) {
      cpn = embed;
    } else {
      let classNames = "";
      if(link.hostname.includes("replit.com")) {
          link.searchParams.set("embed", "true")
          link.searchParams.set("lite", "true")
      } else if (link.hostname.includes("codepen.io")) {
          link.pathname = link.pathname.replace('/pen/','/embed/');
      } else if (link.hostname.includes("codesandbox.io")) {
        link.pathname = link.pathname.replace('/s/','/embed/');
      } else if (link.hostname.includes("jsfiddle.net")) {
        link.pathname = `${link.pathname}/embedded/js,html,css,result/${theme === "dark" ? "dark/" : "" }`
      } else if (link.hostname.includes("forms.gle")) {
        classNames = "max-w-[650px] max-h-[800px] h-[600px]"
      }
      const afterUrl = link.toString();
      
      cpn = <Iframe className={`w-full h-[500px] dark:border-gray-700 dark:text-white ${classNames}`} url={afterUrl} sandbox={["allow-scripts", "allow-popups", "allow-top-navigation-by-user-activation", "allow-forms", "allow-same-origin", "allow-storage-access-by-user-activation"]} allowFullScreen={true} />
    }
  }


  return (
    <div className="mb-4 w-full flex justify-center dark:border-gray-700 dark:text-white">{cpn}</div>
  )
}

export default EmbedBlock