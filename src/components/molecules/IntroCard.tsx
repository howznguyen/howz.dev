import React from "react";
import { Link } from "../atoms";
import { HiOutlineNewspaper } from "react-icons/hi";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { AiOutlineArrowDown } from "react-icons/ai";
import Image from "next/image";

interface IntroCard {
  className?: string;
}

const IntroCard = () => {
  return (
    <div
      data-fade="0"
      className="relative min-h-screen md:py-24 text-center lg:text-left text-black dark:text-white"
    >
      <div className="grid lg:grid-cols-2 pt-10 flex items-center">
        <div className="mb-0">
          <div
            className="relative block rounded-lg shadow-lg px-6 py-12 md:px-12 lg:-mr-14 bg-transparent"
            style={{ backdropFilter: "blur(30px)", zIndex: 1 }}
          >
            <h2 className="text-xl md:text-3xl font-bold mb-4 display-5">
              {"Xin chào, Mình là Howz Nguyễn"}
            </h2>
            <p className="mb-5">
              {
                "Mình hiện tại đang là một Lập Trình Viên Fullstack. Đây là một website mình tạo ra với mong muốn được chia sẻ kiến thức của mình đến với mọi người. Cảm ơn mọi người đã ghé qua. ❤️"
              }
            </p>
            <div className="mt-4 flex flex-wrap gap-4 gap-y-2 md:mt-8">
              <Link
                href="https://github.com/howznguyen/my-resume/blob/main/pdf/cv_en_vi_howznguyen.pdf"
                target="_blank"
                className="flex items-center"
              >
                <HiOutlineNewspaper className="mr-1" />
                Resume
              </Link>
              <Link
                href="https://facebook.com/howznguyen/"
                target="_blank"
                className="flex items-center"
              >
                <FaFacebook className="mr-1" />
                howznguyen
              </Link>
              <Link
                href="https://github.com/howznguyen/"
                target="_blank"
                className="flex items-center"
              >
                <FaGithub className="mr-1" />
                howznguyen
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <Image
            src="/assets/images/orion-nebula.jpg"
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
        <AiOutlineArrowDown className="h-8 w-8 animate-bounce md:h-10 md:w-10" />
      </a>
    </div>
  );
};

export default IntroCard;
