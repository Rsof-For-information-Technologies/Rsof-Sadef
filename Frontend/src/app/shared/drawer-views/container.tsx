'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Drawer } from 'rizzui';
import { useDrawerStore } from '@/app/shared/drawer-views/use-drawer';

export default function GlobalDrawer() {
  const { state: { isOpen, view, placement, customSize, screenWidth }, closeDrawer, openDrawer } = useDrawerStore();
  const pathname = usePathname();

  useEffect(() => {
    closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  useEffect(() => {
    const setScreenWidth = () => {
      openDrawer({ screenWidth: window.innerWidth })

    }
    setScreenWidth()
    window.addEventListener("resize", setScreenWidth);
    return () => window.removeEventListener("resize", setScreenWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <Drawer
      isOpen={(screenWidth as number) <= 1280 && isOpen as boolean}
      onClose={closeDrawer}
      placement={placement}
      customSize={Number(customSize?.split("px")[0]) ? Number(customSize?.split("px")[0]) : 0}
      overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-md"
      containerClassName="dark:bg-gray-100 min-w-20"
      className="z-[9999]"
    >
      {view}
    </Drawer>
  );
}
