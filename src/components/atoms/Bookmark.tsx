import React, { useEffect, useState } from "react";
import { extractMetadata } from "link-meta-extractor";
import Image from "next/image";
import Link from "next/link";

interface BookmarkProps {
  url: string;
}

interface DataUrlState {
  title: string;
  description: string;
  banner: string;
}

const DefaultDataUrlState: DataUrlState = {
    title: "",
    description: "",
    banner: "",
}

const Loading = () => (
  <div className="text-center">
    <div role="status">
      <svg
        aria-hidden="true"
        className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
  </div>
);

const Bookmark = ({ url }: BookmarkProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataUrl, setDataUrl] = useState<DataUrlState>(DefaultDataUrlState);

  useEffect(() => {
    extractMetadata(url).then((data) => {
      setIsLoading(false);
      setDataUrl(data as DataUrlState);
    });

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
            className="md:max-h-32 flex flex-col items-center md:flex-row"
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
                // unoptimized={true}
              />
            )}
            <div className="w-full md:w-auto flex flex-col justify-between p-4">
              <h5 className="mb-2 text-sm md:text-xl font-semibold tracking-tight text-gray-900 dark:text-white overflow-hidden leading-0 max-h-5 md:max-h-8">
                {dataUrl?.title}
              </h5>
              <div className="mb-3 font-normal text-xs md:text-base text-gray-700 dark:text-gray-400 overflow-hidden leading-4 max-h-8 md:max-h-12 md:h-14">
                {dataUrl?.description}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 w-full overflow-hidden max-h-6 md:h-6">
                {url}
              </div>
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default Bookmark;
