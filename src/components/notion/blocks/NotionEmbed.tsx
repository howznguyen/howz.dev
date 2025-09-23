"use client";

import { useTheme } from "next-themes";
import Embed from "react-embed";
import Iframe from "react-iframe";
import {
  FacebookEmbed,
  InstagramEmbed,
  TikTokEmbed,
  TwitterEmbed,
} from "react-social-media-embed";
import ReactPlayer from "react-player";
import { Fragment } from "react";

interface NotionEmbedProps {
  url: string;
}

export const NotionEmbed = ({ url }: NotionEmbedProps) => {
  const { theme } = useTheme();
  const link = new URL(url);
  let cpn = <></>;

  if (link.hostname.includes("facebook.com")) {
    cpn = <FacebookEmbed url={url} width={550} />;
  } else if (link.hostname.includes("instagram.com")) {
    cpn = <InstagramEmbed url={url} width={550} />;
  } else if (link.hostname.includes("twitter.com")) {
    cpn = <TwitterEmbed url={url} width={550} />;
  } else if (link.hostname.includes("tiktok.com")) {
    cpn = <TikTokEmbed url={url} width={550} />;
  } else {
    const isDomainsOfEmbed = ["google.com/maps", "mixcloud.com"].find((x) =>
      url.includes(x)
    );
    if (isDomainsOfEmbed) {
      cpn = <Embed isDark={theme === "dark"} url={url} />;
    } else if (link.hostname.includes("soundcloud.com")) {
      cpn = <ReactPlayer url={url} />;
    } else {
      let classNames = "";
      if (link.hostname.includes("replit.com")) {
        link.searchParams.set("embed", "true");
        link.searchParams.set("lite", "true");
      } else if (link.hostname.includes("codepen.io")) {
        link.pathname = link.pathname.replace("/pen/", "/embed/");
      } else if (link.hostname.includes("codesandbox.io")) {
        link.pathname = link.pathname.replace("/s/", "/embed/");
      } else if (link.hostname.includes("jsfiddle.net")) {
        link.pathname = `${link.pathname}/embedded/js,html,css,result/${
          theme === "dark" ? "dark/" : ""
        }`;
      } else if (
        link.hostname.includes("forms.gle") ||
        (link.hostname.includes("docs.google.com") &&
          link.pathname.includes("/forms/"))
      ) {
        classNames = "max-w-[650px] max-h-[800px] md:h-[600px]";
      }
      const afterUrl = link.toString();
      cpn = (
        <Iframe
          title={`iFrame ${link.hostname}`}
          className={`w-full h-[500px] ${classNames}`}
          url={afterUrl}
          sandbox={[
            "allow-scripts",
            "allow-popups",
            "allow-top-navigation-by-user-activation",
            "allow-forms",
            "allow-same-origin",
            "allow-storage-access-by-user-activation",
          ]}
          allowFullScreen={true}
        />
      );
    }
  }

  return (
    <div className="mb-4 w-full flex justify-center min-h-[250px]">{cpn}</div>
  );
};
