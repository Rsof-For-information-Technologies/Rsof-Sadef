"use client";
import { Title, Text, Button, Popover } from "rizzui";
import cn from "@/utils/class-names";
import { routes } from "@/config/routes";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user.store";
import { ShadcnAvatar, ShadcnAvatarFallback } from "@/components/shadCn/ui/avatar";
import { Params } from "@/types/params";
import { PiLockKey, PiSignOut } from "react-icons/pi";
import { useTranslations } from "next-intl"; 

function DropdownMenu() {
  const { logOutUser, userInfo } = useUserStore();
  const params = useParams<Params>()
  const router = useRouter();
  const t = useTranslations("ProfileMenu");
  return (
    <div className="w-64 text-left rtl:text-right">
      <div className="flex items-center border-b border-gray-300 px-5 pb-5 pt-6">
        <ShadcnAvatar className="!h-9 w-9 sm:!h-10 sm:!w-10">
          {/* <ShadcnAvatarImage
            src={userInfo?.profileImage
              ? `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/image/${userInfo?.profileImage}`
              : ""}
          /> */}
          <ShadcnAvatarFallback>
            {userInfo?.firstName?.charAt(0)}{userInfo?.lastName?.charAt(0)}
          </ShadcnAvatarFallback>
        </ShadcnAvatar>

        <Link href={`/${params.locale}${routes.profile}`} className="ms-3">
          <Title as="h6" className="font-semibold max-w-42 break-words">
            {userInfo?.firstName + " " + userInfo?.lastName}
          </Title>
          <Text className="text-gray-600 max-w-42 break-words">{userInfo?.email}</Text>
          <Text className="max-w-max text-center font-semibold border-2 bg-gray-100 border-gray-200 rounded-full px-2 mt-2">{userInfo?.role}</Text>
        </Link>
      </div>
      <div className="px-6 pb-5 pt-5">
        <Button
          className="h-auto w-full justify-start p-0 font-medium text-gray-700 outline-none focus-within:text-gray-600 hover:text-gray-900 focus-visible:ring-0"
          variant="text"
          onClick={() => {
            router.push(`/${params.locale}${routes.profile.changePassword}`);
          }}
        >
          <PiLockKey className="mr-2 h-5 w-5" />
          {t('changePassword')}
        </Button>
      </div>
      <div className="border-t border-gray-300 px-6 pb-5 pt-5">
        <Button
          className="h-auto w-full justify-start p-0 font-medium text-gray-700 outline-none focus-within:text-gray-600 hover:text-gray-900 focus-visible:ring-0"
          variant="text"
          onClick={() => {
            logOutUser(true);
            router.push(`/${params.locale}${routes.auth.login}`);
          }}
        >
          <PiSignOut className="mr-2 h-5 w-5" />
          {t('signOut')}
        </Button>
      </div>
    </div>
  );
}

export default function ProfileMenu({
  buttonClassName,
  username = false,
}: { buttonClassName?: string; avatarClassName?: string; username?: boolean; }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { userInfo } = useUserStore();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Popover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      shadow="sm"
      placement="bottom-end"
    >
      <Popover.Trigger>
        <Button
          className={cn(
            "w-9 shrink-0 rounded-full outline-none focus-visible:ring-[1.5px] focus-visible:ring-gray-400 focus-visible:ring-offset-2 active:translate-y-px sm:w-10",
            buttonClassName
          )}
        >
          <ShadcnAvatar className="!h-9 w-9 sm:!h-10 sm:!w-10">
            {/* <ShadcnAvatarImage
              src={userInfo?.profileImage
                ? `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/image/${userInfo?.profileImage}`
                : ""}
            /> */}
            <ShadcnAvatarFallback>
              {userInfo?.firstName?.charAt(0)}{userInfo?.lastName?.charAt(0)}
            </ShadcnAvatarFallback>
          </ShadcnAvatar>


          {!!username && (
            <span className="username hidden text-gray-200 md:inline-flex dark:text-gray-700">
              Hi, Andry
            </span>
          )}
        </Button>
      </Popover.Trigger>

      <Popover.Content className="z-[9999] p-0 dark:bg-gray-100 [&>svg]:dark:fill-gray-100">
        <DropdownMenu />
      </Popover.Content>
    </Popover>
  );
}
