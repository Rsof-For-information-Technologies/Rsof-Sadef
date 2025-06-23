import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sadef - Property seller",
  keywords: ["Sadef", "Property Seller", "Real Estate", "Property Management"],
  description: "Sadef is a platform that connects property sellers with potential buyers, making the process of selling properties easier and more efficient.",
};

export default async function RootLayout({ children }: { children: React.ReactNode; }) {

  return (
    <>
      {children}
    </>
  );
}
