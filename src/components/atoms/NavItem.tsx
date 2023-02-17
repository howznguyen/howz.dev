import Link from "next/link";
import React from "react";
import { HiChevronRight } from "react-icons/hi";

interface NavItemProps {
    children: React.ReactNode;
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
        let child = this.props.data.child;
        return (this.props.isMobile ?
                <>
                    <div className="m-1 flex justify-between p-3 dark:text-white">
                    <Link href={this.props.data.url ?? '#'} className="rounded-md hover:bg-gray-50">
                        <span className="ml-3 text-base font-semibold text-gray-900">{this.props.children}</span>
                    </Link>
                    {   
                        child 
                        && child.length > 0 
                        && 
                        <button onClick={() => this.state.setShowChildMenu()}>
                            <i className={`dropdown-icon fa-solid fa-chevron-down ml-2 transition-all duration-300 ${this.state.isShowChildMenu ? 'rotate-180' : ''}`}
                            />
                        </button>
                        
                    }
                    </div>
                    <div className={`dark:text-white list-disc my-1 transition-all duration-300 ${this.state.isShowChildMenu ? 'block opacity-100 scale-100' : 'hidden opacity-0 scale-95'}`}>
                        {child 
                        && child.length > 0 
                        && child.map((item: any, index: number) => 
                            <div className="ml-4 p-3 flex items-center " key={index}>
                                <HiChevronRight className="mr-2" />
                                <Link href={item.url ?? '#'} className="font-semibold">
                                    {item.name}
                                </Link>
                            </div>
                        )}
                    </div>
                </>

            :
                <div className="nav-item mr-5 relative dark:text-white">
                    <Link  href={this.props.data.url ?? '#'} 
                            className=" relative z-10 
                                        block
                                        overflow-hidden
                                        px-2 py-1
                                        font-semibold"
                    >
                        {this.props.children}
                        {child && child.length > 0 && <i className="dropdown-icon fa-solid fa-chevron-down ml-2 transition-all duration-300"></i>}
                    </Link>
                    { child && child.length > 0 && 
                        <ul className="nav-item-child-overlay 
                                        transition-all
                                        duration-300
                                        absolute top-5 py-2
                                        w-56 inset-x-0
                                        focus:outline-none
                                        list-none mt-2">
                            {child && child.length > 0 && child.map((item: any, index: number) => {
                                    return (
                                        <li key={index} className="py-1 pl-2">
                                            <Link href={item.url ?? '#'} className="font-semibold">
                                            {item.name}
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