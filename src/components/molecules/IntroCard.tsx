"use client";

import { Icon, Link } from "../atoms";
import Image from "next/image";
import home from "@/datas/home";

interface IntroCard {
  className?: string;
}

const IntroCard = ({}: IntroCard) => {
  return (
    <div
      data-fade="0"
      className="relative min-h-screen md:py-24 text-center lg:text-left text-black dark:text-white"
    >
      <div className="grid lg:grid-cols-2 pt-10 items-center">
        <div className="mb-0">
          <div
            className="relative block rounded-lg shadow-lg px-6 py-12 md:px-12 lg:-mr-14 bg-transparent"
            style={{ backdropFilter: "blur(30px)", zIndex: 1 }}
          >
            <h2 className="text-xl md:text-3xl font-bold mb-4 display-5">
              {home.intro.header}
            </h2>
            <p className="mb-5">{home.intro.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 gap-y-2 md:mt-8">
              {home.intro.links.map((item: any, i: number) => (
                <Link
                  href={item.link}
                  target="_blank"
                  className="flex items-center"
                  key={i}
                >
                  <Icon icon={item.icon} className="mr-1" />
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <Image
            src={home.intro.image}
            width={500}
            height={500}
            className="w-full shadow-lg fancy-border-radius rotate-lg-6"
            alt=""
          />
        </div>
      </div>
      <a
        href="#featured-post"
        className="absolute bottom-20 left-1/2 -translate-x-1/2 cursor-pointer rounded-md transition-colors hover:text-primary-300 focus-visible:text-primary-300"
      >
        <Icon
          icon="AiOutlineArrowDown"
          className="h-8 w-8 animate-bounce md:h-10 md:w-10"
        />
      </a>
    </div>
  );
};

export default IntroCard;
