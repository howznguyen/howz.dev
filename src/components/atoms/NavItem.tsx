import Link from "next/link";
import React from "react";
import { HiChevronDown, HiChevronRight } from "react-icons/hi";

interface NavItemProps {
    isMobile ?: boolean;
    key: number;
    data ?: any;
}
 
interface NavItemState {
}
 
class NavItem extends React.Component<NavItemProps, NavItemState> {
    state = {
        isShowChildMenu : false,
        setShowChildMenu : () => {
            this.setState({isShowChildMenu: !this.state.isShowChildMenu});
        }
    }
    render() { 
        let children = this.props.data.children;
        return (this.props.isMobile ?
                <>
                    <div className="m-1 flex justify-between px-3 py-1 dark:text-white w-full transition-colors">
                    <Link href={this.props.data.url ?? '#'} className="rounded-md hover:bg-gray-50">
                        <span className="ml-3 text-base font-semibold">{this.props.data.title}</span>
                    </Link>
                    {   
                        children
                        && children.length > 0 
                        && 
                        <button onClick={() => this.state.setShowChildMenu()}>
                            <HiChevronDown className={`ml-2 transition-all duration-300 ${this.state.isShowChildMenu ? 'rotate-180' : ''}`} />
                        </button>
                        
                    }
                    </div>
                    <div className={`dark:text-white list-disc my-1 transition-all duration-500 ${this.state.isShowChildMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        <div className={this.state.isShowChildMenu ? 'block' : 'hidden'} >
                        {children 
                        && children.length > 0 
                        && children.map((item: any, index: number) => 
                            <div className="ml-4 p-3 flex items-center " key={index}>
                                <HiChevronRight className="mr-2" />
                                <Link href={item.url ?? '#'} className="font-semibold">
                                    {item.title}
                                </Link>
                            </div>
                        )}
                        </div>
                    </div>
                </>

            :
                <div className="nav-item mr-5 relative transition-colors dark:text-white hover:dark:text-primary hover:text-primary">
                    <Link  href={this.props.data.url ?? '#'} 
                            className=" relative z-10 
                                        block
                                        overflow-hidden
                                        px-2 py-1
                                        font-semibold"
                    >
                        {this.props.data.title}
                        {children && children.length > 0 && <HiChevronDown className="dropdown-icon inline-block ml-2 transition-all duration-300"/>}
                    </Link>
                    { children && children.length > 0 && 
                        <ul className="nav-item-child-overlay 
                                        transition-all
                                        duration-300
                                        absolute top-5 py-2
                                        w-56 inset-x-0
                                        focus:outline-none
                                        rounded-lg
                                        bg-white text-dark
                                        dark:bg-dark dark:text-white
                                        list-none mt-2">
                            {children && children.length > 0 && children.map((item: any, index: number) => {
                                    return (
                                        <li key={index} className="py-1 pl-2">
                                            <Link href={item.url ?? '#'}>
                                            {item.title}
                                            </Link>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    }
                </div>
        )       
    }
}
 
export default NavItem;