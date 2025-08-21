
import { getUserById } from "@/utils/api";
import { notFound } from "next/navigation";
import { User } from "@/types/user";
import CollapsibleSection from "../../(components)/CollapsibleSection";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";
import { Badge } from "rizzui";
import { getTranslations } from "next-intl/server";
interface DetailsUserProps {
  params: { userId: string };
}

export default async function DetailsUser({ params }: DetailsUserProps) {
  const t = await getTranslations("UserPages.userDetailPage");
  let data: User | null = null;
  try {
    const response = await getUserById(params.userId);
    if (!response?.data) return notFound();
    data = response.data;
  } catch {
    return notFound();
  }

  return (
    <Authenticate >
      <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
      <div className="flex flex-col py-6">
          <div>
            <h1 className="mb-4 text-2xl font-semibold">{t('title')}</h1>
            <p className="mb-6 text-gray-600">{t('description')}</p>
          </div>
          <CollapsibleSection title={t('userDetails.basicInformationCard.title')} defaultOpen>
            <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white dark:from-gray-100 dark:to-gray-100 rounded-lg shadow-sm border border-blue-200 dark:border-gray-200">
              <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-base shadow dark:bg-gray-500">👤</span>
                <span className="font-semibold text-black dark:text-white">{t('userDetails.basicInformationCard.infoCard.fullName')}:</span>
                <span className="text-gray-800 dark:text-white">{`${data.firstName} ${data.lastName}`}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200 dark:from-gray-100 dark:to-gray-100 dark:border-gray-200	">
                <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏷️</span>
                <span className="font-semibold text-black dark:text-white">{t('userDetails.basicInformationCard.infoCard.id')}:</span>
                <span className="text-gray-800">{data.id}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200 dark:from-gray-100 dark:to-gray-100 dark:border-gray-200">
                <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-base shadow">👤</span>
                <span className="font-semibold text-black dark:text-white">{t('userDetails.basicInformationCard.infoCard.firstName')}:</span>
                <span className="text-gray-800">{data.firstName}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200 dark:from-gray-100 dark:to-gray-100 dark:border-gray-200">
                <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-base shadow">👤</span>
                <span className="font-semibold text-black dark:text-white">{t('userDetails.basicInformationCard.infoCard.lastName')}:</span>
                <span className="text-gray-800">{data.lastName}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200 dark:from-gray-100 dark:to-gray-100 dark:border-gray-200 dark:bg-gray-100 dark:text-black">
                <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-base shadow">📧</span>
                <span className="font-semibold text-black dark:text-white">{t('userDetails.basicInformationCard.infoCard.email')}:</span>
                <span className="text-gray-800">{data.email}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200 dark:from-gray-100 dark:to-gray-100 dark:border-gray-200">
                <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-base shadow">🔐</span>
                <span className="font-semibold text-black dark:text-white">{t('userDetails.basicInformationCard.infoCard.role')}:</span>
                <Badge
                  color={
                    data.role === "SuperAdmin" ? "danger" :
                      data.role === "Admin" ? "success" :
                        data.role === "Investor" ? "info" :
                          "warning"
                  }
                  className="min-w-[80px] text-center"
                >
                  {data.role}
                </Badge>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200 dark:from-gray-100 dark:to-gray-100 dark:border-gray-200 dark:bg-gray-100 dark:text-black">
                <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-base shadow">✅</span>
                <span className="font-semibold text-black dark:text-white">{t('userDetails.basicInformationCard.infoCard.status')}:</span>
                <Badge
                  color={data.isActive ? "success" : "warning"}
                  className="min-w-[80px] text-center"
                >
                  {data.isActive ? t('userDetails.basicInformationCard.infoCard.active') : t('userDetails.basicInformationCard.infoCard.inactive')}
                </Badge>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </Authorize>
    </Authenticate>
  );
}
