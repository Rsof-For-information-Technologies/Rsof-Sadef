"use client";

import { ActionIcon, Badge } from "rizzui";
import ProfileMenu from "./header-menu-right-parts/profile-menu";
import ThemeSwitcher from "./header-menu-right-parts/theme-switcher";
import { useUserStore } from "@/store/user.store";
import RingBellSolidIcon from "@/components/icons/ring-bell-solid";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/shadCn/ui/popover";

export default function HeaderMenuRight() {
  const { userInfo } = useUserStore();
  return (
    <div className="ms-auto grid shrink-0 grid-cols-3 items-center gap-2 text-gray-700 xs:gap-3 xl:gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <ActionIcon
            aria-label="Notification"
            variant="text"
            className="relative h-[34px] w-[34px] shadow backdrop-blur-md md:h-9 md:w-9 dark:bg-gray-100"
          >
            <RingBellSolidIcon className="h-[18px] w-auto" />
            <Badge
              renderAsDot
              color="warning"
              enableOutlineRing
              className="absolute right-2.5 top-2.5 -translate-y-1/3 translate-x-1/2"
            />
          </ActionIcon>
        </PopoverTrigger>
        <PopoverContent align="end" className="p-0 w-80">
          <div className="p-4">
            <div className="font-semibold mb-2">Notifications</div>
            <ul className="space-y-2">
              <li className="text-sm text-gray-700">New comment on your post</li>
              <li className="text-sm text-gray-700">Your password was changed</li>
              <li className="text-sm text-gray-700">System maintenance at 2:00 AM</li>
            </ul>
          </div>
        </PopoverContent>
      </Popover>
      <ThemeSwitcher />
      {/* <ProfileMenu /> */}
      {
        userInfo
          ? <ProfileMenu />
          : null
      }
    </div>
  );
}
