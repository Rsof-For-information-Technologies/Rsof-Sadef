"use client"
import { useDrawerStore } from '@/app/shared/drawer-views/use-drawer';
import { routes } from '@/config/routes';
import Header from '@/layouts/header';
import Sidebar from '@/layouts/sideBar/sidebar';
import { Params } from '@/types/params';
import { useParams, usePathname } from 'next/navigation';
import { Suspense } from 'react';

export default function HydrogenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state: { isOpen, screenWidth } } = useDrawerStore()
  const pathname = usePathname();
  const params = useParams<Params>()
  const authRoutes = [`/${params.locale}${routes.auth.login}`, `/${params.locale}${routes.auth.signup}`, `/${params.locale}${routes.auth.forgotPassword}`, `/${params.locale}${routes.auth.resetPassword}`];
  const isAuthPage = authRoutes.includes(pathname);
  return (
    <main className={`flex min-h-screen flex-grow ${isAuthPage ? "pt-[80px]" : "pt-[80px]"}`}>

      <Suspense>
        <Sidebar className="fixed hidden xl:block dark:bg-gray-50" />
      </Suspense>

      <div className={`flex w-full flex-col flex-1 ${isOpen && (screenWidth as number) > 1280 ? "xl:ms-[270px]" : ""}`} >
        <Header />

        <div id='main-page-container' className="flex flex-grow flex-col px-[10px] sm:px-4 pb-6 pt-2 md:px-5 lg:px-6 lg:pb-8 3xl:px-8 3xl:pt-4 4xl:px-10 4xl:pb-9 @container">
          {children}
        </div>

      </div>

    </main>
  );
}
