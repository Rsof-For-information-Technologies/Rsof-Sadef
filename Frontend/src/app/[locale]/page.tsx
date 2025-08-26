import { routes } from "@/config/routes";
import { Params } from "@/types/params";
import { redirect } from "next/navigation";

export default function Home({ params }: { params: Params }) {
  const { locale } = params;
  redirect(`/${locale}${routes.dashboard}`);
}
