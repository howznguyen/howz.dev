import { createElement } from "react";
import * as ri_ci from "react-icons/ci";
import * as ri_fa from "react-icons/fa";
import * as ri_io from "react-icons/io";
import * as ri_io5 from "react-icons/io5";
import * as ri_md from "react-icons/md";
import * as ri_ti from "react-icons/ti";
import * as ri_go from "react-icons/go";
import * as ri_fi from "react-icons/fi";
import * as ri_gi from "react-icons/gi";
import * as ri_wi from "react-icons/wi";
import * as ri_di from "react-icons/di";
import * as ri_ai from "react-icons/ai";
import * as ri_bs from "react-icons/bs";
import * as ri_ri from "react-icons/ri";
import * as ri_fc from "react-icons/fc";
import * as ri_gr from "react-icons/gr";
import * as ri_hi from "react-icons/hi";
import * as ri_hi2 from "react-icons/hi2";
import * as ri_si from "react-icons/si";
import * as ri_sl from "react-icons/sl";
import * as ri_im from "react-icons/im";
import * as ri_bi from "react-icons/bi";
import * as ri_cg from "react-icons/cg";
import * as ri_vs from "react-icons/vsc";
import * as ri_tb from "react-icons/tb";
import * as ri_tf from "react-icons/tfi";
import * as ri_rx from "react-icons/rx";

const icons: any = {
  ...ri_ci,
  ...ri_fa,
  ...ri_io,
  ...ri_io5,
  ...ri_md,
  ...ri_ti,
  ...ri_go,
  ...ri_fi,
  ...ri_gi,
  ...ri_wi,
  ...ri_di,
  ...ri_ai,
  ...ri_bs,
  ...ri_ri,
  ...ri_fc,
  ...ri_gr,
  ...ri_hi,
  ...ri_hi2,
  ...ri_si,
  ...ri_sl,
  ...ri_im,
  ...ri_bi,
  ...ri_cg,
  ...ri_vs,
  ...ri_tb,
  ...ri_tf,
  ...ri_rx,
};

interface IconProps {
  icon: string;
  className?: string;
}

const Icon = ({ icon, className }: IconProps) => {
  const iconComponent = icons[icon] ?? icons.FaFileExcel;
  return createElement(iconComponent, {
    className: className,
  });
};

export default Icon;
