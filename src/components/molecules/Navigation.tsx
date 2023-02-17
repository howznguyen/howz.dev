import React from "react";
import { NavItem, Logo } from "@/components/atoms";
import { HiBars3, HiXMark } from "react-icons/hi";

interface NavigationProps {
  data: Array<any>;
}

interface NavigationState {}

class Navigation extends React.Component<NavigationProps, NavigationState> {
  state = {
    isShowMobileMenu: false,
    setShowMobileMenu: () => {
      this.setState({ isShowMobileMenu: !this.state.isShowMobileMenu });
    },
  };
  render() {
    let { data } = this.props;
    return (
      <>
        <nav className="hidden md:flex">
          {data.map((item, index) => {
            return (
              <NavItem key={index} data={item}>
                {item.label}
              </NavItem>
            );
          })}
        </nav>

        <div className="md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            aria-expanded="false"
            onClick={() => this.state.setShowMobileMenu()}
          >
            <span className="sr-only">Open menu</span>
            <HiBars3 />
          </button>
        </div>

        <div
          className={`absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden ${
            this.state.isShowMobileMenu
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }`}
        >
          <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center justify-between">
                <Logo />
                <div className="mr-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    onClick={() => this.state.setShowMobileMenu()}
                  >
                    <span className="sr-only">Close Menu</span>
                    <HiXMark />
                  </button>
                </div>
              </div>
              <div className="mt-6 flex">
                <nav className="grid gap-y-0">
                  {data.map((item, index) => {
                    return (
                      <NavItem key={index} data={item} isMobile={true}>
                        {item.label}
                      </NavItem>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Navigation;
