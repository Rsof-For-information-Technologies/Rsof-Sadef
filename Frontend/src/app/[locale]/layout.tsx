import type { Metadata } from "next";
import HydrogenLayout from "@/layouts/layout";
import { DirectionProvider } from "@/components/direction-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Params } from "@/types/params";

export const metadata: Metadata = {
  title: {
    template: "%s | Sadef - Property",
    default: "Sadef - Property",
  },
  keywords: ["Sadef", "Property Seller", "Real Estate", "Property Management"],
  description: "Sadef is a platform that connects property sellers with potential buyers, making the process of selling properties easier and more efficient.",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<Params>
}) {

  const awaitedParams = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={awaitedParams.locale} messages={messages}>
      <DirectionProvider locale={awaitedParams.locale}>
        <HydrogenLayout>
          {children}
        </HydrogenLayout>
      </DirectionProvider>
    </NextIntlClientProvider>
  );
}
