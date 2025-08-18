"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Title, Collapse } from "rizzui";
import { cn } from "@/utils/class-names";
import { PiCaretDownBold } from "react-icons/pi";
import SimpleBar from "@/components/ui/simplebar";
import { MenuItems } from "@/layouts/sideBar/menu-items";
import { useDrawerStore } from "@/app/shared/drawer-views/use-drawer";
import Authorize from "@/components/auth/authorize";
import { routes } from "@/config/routes";
import { useUserStore } from "@/store/user.store";
import Image from "next/image";
import { Params } from "@/types/params";
import { useTranslations } from "next-intl";

export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const params = useParams<Params>()
  const { state: { isOpen } } = useDrawerStore();
  const { userInfo } = useUserStore()
  const t = useTranslations('SideMenu');

  const safeT = (key: string) => {
    try { return t(key); } catch { return key; }
  };

  return (

    <aside
      style={{
        width: isOpen ? "270px" : "0px"
      }}
      className={cn(
        "fixed bottom-0 duration-200 start-0 z-50 h-full w-[270px] border-e-2 border-gray-100 bg-white 2xl:w-72 dark:bg-gray-100/50 overflow-hidden",
        className
      )}
    >
      <div className="sticky flex justify-center top-0 z-40 bg-gray-0/10 px-6 py-2 2xl:px-8 2xl:pt-6 dark:bg-gray-100/5">
        <Link
          href={`/${params.locale}${routes.dashboard}`}
          aria-label="Sadef Logo"
          className="text-gray-800 hover:text-gray-900 w-fit inline-block"
        >
          <Image
            src={"/sadef-logo.png"}
            alt="Sadef Logo"
            height={200}
            width={200}
            priority
            className="w-[70px] sm:w-[130px]"
          />
        </Link>
      </div>

      <SimpleBar className="h-[calc(100%-80px)]">
        <div className="mt-4 pb-3 3xl:mt-6">
          {
            userInfo ?

              MenuItems(params.locale || "en", userInfo).map((item, index) => {
                const isActive = pathname === (item?.href as string);
                const pathnameExistInDropdowns = item?.dropdownItems?.filter((dropdownItem) => dropdownItem.href === pathname);
                const isDropdownOpen = Boolean(pathnameExistInDropdowns?.length);

                return (
                  <Authorize allowedRoles={item.allowedRoles} key={item.translationKey + "-" + index} >
                    {item?.href
                      ? (
                        <>
                          {item?.dropdownItems
                            ? (
                              <Collapse
                                defaultOpen={isDropdownOpen}
                                header={({ open, toggle }) => (
                                  <div
                                    onClick={toggle}
                                    className={cn(
                                      "group relative mx-3 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 font-medium lg:my-1 2xl:mx-5 2xl:my-2",
                                      isDropdownOpen
                                        ? "before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
                                        : "text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-700/90 dark:hover:text-gray-700"
                                    )}
                                  >
                                    <span className="flex items-center">
                                      {item?.icon && (
                                        <span
                                          className={cn(
                                            "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
                                            isDropdownOpen
                                              ? "text-primary"
                                              : "text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700"
                                          )}
                                        >
                                          {item?.icon}
                                        </span>
                                      )}
                                      {safeT(item.translationKey)}
                                    </span>

                                    <PiCaretDownBold
                                      strokeWidth={3}
                                      className={cn(
                                        "h-3.5 w-3.5 -rotate-90 text-gray-500 transition-transform duration-200 rtl:rotate-90",
                                        open && "rotate-0 rtl:rotate-0"
                                      )}
                                    />
                                  </div>
                                )}
                              >
                                {item?.dropdownItems?.map((dropdownItem, index) => {
                                  const isChildActive = pathname === dropdownItem.href;

                                  return (
                                    <Authorize
                                      allowedRoles={dropdownItem.allowedRoles}
                                      key={index + " " + dropdownItem.href}
                                    >
                                      <Link
                                        href={`${dropdownItem?.href}`}
                                        key={dropdownItem?.translationKey + index}
                                        className={cn(
                                          "mx-3.5 mb-0.5 flex items-center justify-between rounded-md px-3.5 py-2 font-medium capitalize last-of-type:mb-1 lg:last-of-type:mb-2 2xl:mx-5",
                                          isChildActive
                                            ? "text-primary"
                                            : "text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
                                        )}
                                      >
                                        <div className="flex items-center truncate">
                                          <span
                                            className={cn(
                                              "me-[18px] ms-1 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200",
                                              isChildActive
                                                ? "bg-primary ring-[1px] ring-primary"
                                                : "opacity-40"
                                            )}
                                          />{" "}
                                          <span className="truncate">
                                            {safeT(dropdownItem?.translationKey)}
                                          </span>
                                        </div>
                                      </Link>
                                    </Authorize>
                                  );
                                })}
                              </Collapse>
                            )
                            : (
                              <Link
                                href={`${item?.href}`}
                                className={cn(
                                  "group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2",
                                  isActive
                                    ? "before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
                                    : "text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-700/90"
                                )}
                              >
                                <div className="flex items-center truncate">
                                  {item?.icon && (
                                    <span
                                      className={cn(
                                        "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
                                        isActive
                                          ? "text-primary"
                                          : "text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700"
                                      )}
                                    >
                                      {item?.icon}
                                    </span>
                                  )}
                                  <span className="truncate">{safeT(item.translationKey)}</span>
                                </div>
                              </Link>
                            )
                          }
                        </>
                      )
                      : (
                        <Title
                          as="h6"
                          className={cn(
                            "mb-2 truncate px-6 text-xs font-normal uppercase tracking-widest text-gray-500 2xl:px-8",
                            index !== 0 && "mt-6 3xl:mt-7"
                          )}
                        >
                          {safeT(item.translationKey)}
                        </Title>
                      )}
                  </Authorize>
                );
              })
              : null
          }
        </div>
      </SimpleBar>
    </aside>

  );
}