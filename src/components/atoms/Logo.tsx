import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  title: string;
}

const Logo = ({title}: LogoProps) => {
  return (
    <Link href="/" className="flex items-center mr-10">
      <div className="flex items-center justify-center p-2 bg-gray-900 rounded-lg mr-2">
        <Image
          width={20}
          height={20}
          className="h-[20px] w-[20px]"
          src="/assets/images/logo.png"
          alt="Logo"
        />
      </div>
      <span className="text-xl font-bold uppercase dark:text-white">
        {title}
      </span>
    </Link>
  );
};

export default Logo;
