import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations('UserPages.createUserPage');
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-3"></div>
      <span className="text-lg font-medium text-gray-700">{t('loading')}</span>
    </div>
  );
}