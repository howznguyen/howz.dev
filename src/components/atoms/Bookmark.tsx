import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Loading from "./Loading"

interface BookmarkProps {
  url: string;
}

interface DataUrlState {
  title: string;
  description: string;
  banner: string;
  logo: string;
}

const DefaultDataUrlState: DataUrlState = {
    title: "",
    description: "",
    banner: "",
    logo: "",
}

const Bookmark = ({ url }: BookmarkProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataUrl, setDataUrl] = useState<DataUrlState>(DefaultDataUrlState);

  useEffect(() => {
    let ProxyUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;

    axios(ProxyUrl).then((res) => {
      let data : DataUrlState = {...DefaultDataUrlState};
      if(res.data.status === "success") {
          data.title = res.data.data.title;
          data.description = res.data.data.description;
          data.banner = res.data.data.image?.url ?? "";
          data.logo = res.data.data.logo?.url ?? "";
      }
      setIsLoading(false);
      setDataUrl(data);
    }).catch((error) => {
      setIsLoading(false);
      console.log(error);
    })

    return () => {
      setDataUrl(DefaultDataUrlState);
    };
  }, [url]);

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && dataUrl && (
        <div className="mb-4 rounded-lg bg-white border border-gray-200 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <Link
            href={url}
            target="_blank"
            className="md:max-h-32 flex flex-col items-center md:flex-row relative"
          >
            {!dataUrl?.banner ? (
              <div className="h-28 w-full md:h-32 md:w-48 p-4 bg-gray-100 animate-pulse dark:bg-gray-700"></div>
            ) : (
              <Image
                loading="lazy"
                className="hidden md:block w-full md:h-32 md:w-48 object-cover rounded-tl-lg rounded-tr-lg md:rounded-tr-none md:rounded-bl-lg"
                width={1280}
                height={1920}
                src={dataUrl?.banner}
                alt={dataUrl?.title}
              />
            )}
            <div className="w-full md:w-auto flex flex-col justify-between p-4">
              <h5 className="mb-2 text-sm md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white overflow-hidden leading-0 max-h-5 md:max-h-8">
                {dataUrl?.title}
              </h5>
              <div className="mb-3 font-normal text-xs md:text-base text-gray-700 dark:text-gray-400 overflow-hidden leading-4 max-h-8 md:max-h-12 md:h-14">
                {dataUrl?.description}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 w-full max-w-[600px] overflow-hidden max-h-6 md:h-6 flex">
                {dataUrl.logo && <Image width={20} height={20} src={dataUrl.logo} alt={dataUrl?.title} className="pl-0 p-1 inline"/>}
                <span className="py-1">{url}</span>
              </div>
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default Bookmark;
