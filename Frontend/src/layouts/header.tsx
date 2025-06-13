"use client";

import Link from "next/link";
import HamburgerButton from "./header-parts/hamburger-button";
import Sidebar from "@/layouts/sideBar/sidebar";
import cn from "@/utils/class-names";
import { Suspense } from "react";
import { useIsMounted } from "@/hooks/use-is-mounted";
import useWindowScroll from "react-use/lib/useWindowScroll";
import { useDrawerStore } from "@/app/shared/drawer-views/use-drawer";
import Authenticate from "@/components/auth/authenticate";
import HeaderMenuRight from "./header-parts/header-menu-right";
import SearchWidget from "@/components/search/search";
import { PiMagnifyingGlass } from "react-icons/pi";

export default function Header({ className }: { className?: string }) {
  const isMounted = useIsMounted();

  const windowScroll = useWindowScroll();

  const { state } = useDrawerStore();

  const checkScreenGreater = state?.screenWidth && state?.screenWidth >= 1280;
  const offset = 2;
  return (

    <header
      className={cn(
        `fixed ${state.isOpen && checkScreenGreater ? "w-[calc(100%_-_270px)]" : "w-full"} top-0 flex items-center bg-gray-0/80 p-4 backdrop-blur-xl md:px-5 lg:px-6 z-40 justify-between bg-white xl:pe-8 dark:bg-gray-50/50 shadow-sm`,
        ((isMounted && windowScroll.y) as number) > offset ? 'card-shadow' : '',
        className
      )}
    >



      <div className="flex w-full items-center justify-between gap-5 3xl:gap-6">
        <div className="flex max-w-2xl items-center xl:w-auto">

          <HamburgerButton
            view={<Suspense>
              <Authenticate>
                <Sidebar className="static w-full 2xl:w-full" />
              </Authenticate>
            </Suspense>}
          />

          {/* <Link
            aria-label="Site Logo"
            href="/"
            className="me-4 w-9 shrink-0 text-gray-800 hover:text-gray-900 lg:me-5 xl:hidden"
          >
            <Logo iconOnly={true} />
          </Link>
          <SearchWidget
            icon={<PiMagnifyingGlass className="me-3 h-[20px] w-[20px]" />}
            className="xl:w-[500px]"
          /> */}
        </div>

        <div className="flex items-center justify-between flex-1">
          <HeaderMenuRight />
        </div>
      </div>

    </header>
  );
}
