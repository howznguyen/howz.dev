import React from "react";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href ?: string;
}

class Button extends React.Component<ButtonProps> {
  render() {
    return (
        <Link 
            href={this.props.href ?? '#'} 
            className=" bg-neutral-700
                        hover:bg-neutral-800
                        active:bg-neutral-900
                        text-white 
                        py-2 px-4 rounded-lg">
            {this.props.children}
        </Link>
    );
  }
}

export default Button;
