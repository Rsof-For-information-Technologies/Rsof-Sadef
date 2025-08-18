"use client";

import { useUserStore } from "@/store/user.store";
import { useEffect } from "react";
import LanguageSwitcher from "./header-menu-right-parts/language-switcher";
import ProfileMenu from "./header-menu-right-parts/profile-menu";
import ThemeSwitcher from "./header-menu-right-parts/theme-switcher";

export default function HeaderMenuRight() {
  const { userInfo, getUserInfo } = useUserStore();

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="ms-auto grid shrink-0 grid-cols-3 items-center gap-2 text-gray-700 xs:gap-3 xl:gap-4">

      <ThemeSwitcher />

      <LanguageSwitcher />

      {
        userInfo
          ? <ProfileMenu />
          : null
      }
    </div>
  );
}
