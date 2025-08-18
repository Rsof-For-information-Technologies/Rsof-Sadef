"use client";

import { useDrawerStore } from "@/app/shared/drawer-views/use-drawer";
import { useIsMounted } from "@/hooks/useIsMounted";
import Sidebar from "@/layouts/sideBar/sidebar";
import cn from "@/utils/class-names";
import { Suspense } from "react";
import useWindowScroll from "react-use/lib/useWindowScroll";
import HamburgerButton from "./header-parts/hamburger-button";
import HeaderMenuRight from "./header-parts/header-menu-right";

export default function Header({ className }: { className?: string; }) {
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
              <Sidebar className="static w-full 2xl:w-full" />
            </Suspense>}
          />
        </div>

        <div className="flex items-center justify-between flex-1">
          <HeaderMenuRight />
        </div>
      </div>

    </header>
  );
}
