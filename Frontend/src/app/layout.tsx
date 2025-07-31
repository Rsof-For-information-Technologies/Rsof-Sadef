import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { inter, lexendDeca } from "@/app/fonts";
import GlobalDrawer from "@/app/shared/drawer-views/container";
import GlobalModal from "@/app/shared/modal-views/container";
import { cn } from "@/utils/class-names";
import { Suspense } from "react";
import { SoonerToaster } from "@/components/shadCn/ui/sooner";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Sadef - Property seller",
  description: "Sadef is a platform that connects property sellers with potential buyers, making the process of selling properties easier and more efficient.",
};

export default async function RootLayout({ children }: { children: React.ReactNode;  }) {

  return (
    <html
      // 💡 Prevent next-themes hydration warning
      suppressHydrationWarning
    >
      <body
        // 💡 Prevent hydration warnings caused by third-party extensions, such as Grammrly.
        suppressHydrationWarning
        className={cn(inter.variable, lexendDeca.variable, "font-inter")}
      >
        <Suspense>
          <SoonerToaster position="bottom-right" duration={(1000 * 6)} richColors />
          <ThemeProvider>
            {children}
            <GlobalDrawer />
            <GlobalModal />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
