
import { getMaintenanceRequestById } from "@/utils/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import { DataItem } from "@/types/maintenanceRequest";
import CollapsibleSection from "../../(components)/CollapsibleSection";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";
import { maintenanceRequestStatuses } from "@/constants/constants";
import { getTranslations } from "next-intl/server";

export default async function DetailsMaintenanceRequest({
  params,
}: {
  params: { maintenanceRequestId: string };
}) {
  let data: DataItem | null = null;
  const BASE_URL = process.env.SERVER_BASE_URL || '';
  const t = await getTranslations('MaintenancePages.maintenanceDetailPage')

  try {
    const response = await getMaintenanceRequestById(params.maintenanceRequestId);
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
          <CollapsibleSection title={t('maintenanceDetails.basicInformationCard.title')} defaultOpen>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200 dark:from-gray-100 dark:to-gray-100 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏷️</span>
                <span className="font-semibold text-black dark:text-white">{t('maintenanceDetails.basicInformationCard.infoCard.id')}:</span>
                <span className="text-gray-800 dark:text-white">{data.id}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200 dark:from-gray-100 dark:to-gray-100 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏷️</span>
                <span className="font-semibold text-black dark:text-white">{t('maintenanceDetails.basicInformationCard.infoCard.leadId')}:</span>
                <span className="text-gray-800 dark:text-white">{data.leadId}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200 dark:from-gray-100 dark:to-gray-100 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">📄</span>
                <span className="font-semibold text-black dark:text-white">{t('maintenanceDetails.basicInformationCard.infoCard.status')}:</span>
                <span className="text-gray-800 dark:text-white">{
                  (() => {
                    const found = maintenanceRequestStatuses.find(
                      (opt) => String(opt.value) === String(data?.status)
                    );
                    return found ? found.label : data?.status;
                  })()
                }</span>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title={t('maintenanceDetails.basicInformationCard.infoCard.description')}>
            <div dangerouslySetInnerHTML={{ __html: data.description || '<span class="text-gray-400">No description provided.</span>' }} className="prose max-w-none text-gray-700 dark:text-white"></div>
          </CollapsibleSection>

          <CollapsibleSection title={t('maintenanceDetails.basicInformationCard.infoCard.images&Videos')}>
            <div className="flex flex-col gap-6 items-start">
              {data.imageUrls && data.imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {data.imageUrls.map((imgSrc: File, idx: number) => (
                    <Image
                      width={256}
                      height={192}
                      key={idx}
                      src={`${BASE_URL}/${imgSrc}`}
                      alt={`Property Preview ${idx + 1}`}
                      className="rounded-lg shadow-md w-full md:w-64 h-48 object-cover border border-gray-200 dark:border-gray-500"
                    />
                  ))}
                </div>
              )}
              {Array.isArray(data?.videoUrls) && data.videoUrls.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {data.videoUrls.map((video: File, idx: number) => (
                    <video
                      key={idx}
                      src={`${BASE_URL}/${video}`}
                      controls
                      className="rounded-lg shadow-md w-full md:w-64 h-48 object-cover border border-gray-200 dark:border-gray-500 mb-4"
                    />
                  ))}
                </div>
              )}
            </div>
          </CollapsibleSection>
        </div>
      </Authorize>
    </Authenticate>
  );
}
