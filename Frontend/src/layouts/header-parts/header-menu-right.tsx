"use client";

import ProfileMenu from "./header-menu-right-parts/profile-menu";
import ThemeSwitcher from "./header-menu-right-parts/theme-switcher";
import { useUserStore } from "@/store/user.store";

export default function HeaderMenuRight() {
  const { userInfo } = useUserStore();
  return (
    <div className="ms-auto grid shrink-0 grid-cols-4 items-center gap-2 text-gray-700 xs:gap-3 xl:gap-4">
      <ThemeSwitcher />
      <ProfileMenu />
      {
        userInfo
          ? <ProfileMenu />
          : null
      }
    </div>
  );
}
