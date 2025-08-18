import { getTranslations } from "next-intl/server";
import { Title } from "rizzui";

export default async function Home() {
  const t = await getTranslations("landingPage");
  return (
    <Title>{t("title")}</Title>
  );
}
