"use client"
import { useDrawerStore } from '@/app/shared/drawer-views/use-drawer';
import Header from '@/layouts/header';
import Sidebar from '@/layouts/sideBar/sidebar';
import { Suspense } from 'react';

export default function HydrogenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state: { isOpen, screenWidth } } = useDrawerStore()
  return (
    <main className="flex min-h-screen flex-grow pt-[90px]">
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
