import React from "react";
import { getContactById } from "@/utils/api";
import { notFound } from "next/navigation";
import { Contact } from "@/types/contact";
import CollapsibleSection from "../../(components)/CollapsibleSection";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";
import { Badge } from "rizzui";
import { contactStatuses } from "@/constants/constants";
import { getTranslations } from "next-intl/server";
interface DetailsContactProps {
  params: { contactId: string };
}

async function DetailsContact({ params }: DetailsContactProps) {
  const t = await getTranslations('ContactPages.contactDetailPage')
  let data: Contact | null = null;
  try {
    const response = await getContactById(params.contactId);
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

          <CollapsibleSection title={t('contactDetails.basicInformationCard.title')} defaultOpen>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white dark:from-gray-100 dark:to-gray-100 rounded-lg shadow-sm border border-blue-200 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow dark:bg-gray-500">🏷️</span>
                <span className="font-semibold text-black dark:text-white">{t('contactDetails.basicInformationCard.infoCard.id')}:</span>
                <span className="text-gray-800 dark:text-white">{data?.id}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white dark:from-gray-100 dark:to-gray-100 rounded-lg shadow-sm border border-blue-200 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow dark:bg-gray-500">👤</span>
                <span className="font-semibold text-black dark:text-white">{t('contactDetails.basicInformationCard.infoCard.fullName')}:</span>
                <span className="text-gray-800 dark:text-white">{data?.fullName}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white dark:from-gray-100 dark:to-gray-100 rounded-lg shadow-sm border border-blue-200 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow dark:bg-gray-500">📧</span>
                <span className="font-semibold text-black dark:text-white">{t('contactDetails.basicInformationCard.infoCard.email')}:</span>
                <span className="text-gray-800 dark:text-white">{data?.email}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white dark:from-gray-100 dark:to-gray-100 rounded-lg shadow-sm border border-blue-200 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow dark:bg-gray-500">📞</span>
                <span className="font-semibold text-black dark:text-white">{t('contactDetails.basicInformationCard.infoCard.phone')}:</span>
                <span className="text-gray-800 dark:text-white">{data?.phone}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white dark:from-gray-100 dark:to-gray-100 rounded-lg shadow-sm border border-blue-200 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow dark:bg-gray-500">🏠</span>
                <span className="font-semibold text-black dark:text-white">{t('contactDetails.basicInformationCard.infoCard.propertyId')}:</span>
                <span className="text-gray-800 dark:text-white">{data?.propertyId}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white dark:from-gray-100 dark:to-gray-100 rounded-lg shadow-sm border border-blue-200 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow dark:bg-gray-500">📅</span>
                <span className="font-semibold text-black dark:text-white">{t('contactDetails.basicInformationCard.infoCard.status')}:</span>
                <Badge
                  color={
                    data?.status === "New" ? "warning" :
                    data?.status === "InProgress" ? "info" :
                    data?.status === "Contacted" ? "success" :
                    data?.status === "Responded" ? "info" :
                    data?.status === "Scheduled" ? "success" :
                    data?.status === "Completed" ? "success" :
                    data?.status === "Cancelled" ? "secondary" :
                    data?.status === "Spam" ? "danger" :
                    "secondary"
                  }
                  className="min-w-[80px] text-center"
                >
                  {(() => {
                    const found = contactStatuses.find(
                      (opt) => String(opt.value) === String(data?.status)
                    );
                    return found ? found.label : data?.status;
                  })()}
                </Badge>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white dark:from-gray-100 dark:to-gray-100 rounded-lg shadow-sm border border-blue-200 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow dark:bg-gray-500">🚨</span>
                <span className="font-semibold text-black dark:text-white">{t('contactDetails.basicInformationCard.infoCard.urgent')}:</span>
                <Badge
                  color={data?.isUrgent ? "danger" : "secondary"}
                  className="min-w-[80px] text-center"
                >
                  {data?.isUrgent ? "Urgent" : "Normal"}
                </Badge>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title={t('contactDetails.propertyInformationCard.title')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white dark:from-gray-100 dark:to-gray-100 rounded-lg shadow-sm border border-green-200 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow dark:bg-gray-500">📋</span>
                <span className="font-semibold text-black dark:text-white">{t('contactDetails.propertyInformationCard.infoCard.subject')}:</span>
                <span className="text-gray-800 dark:text-white">{data?.subject}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white dark:from-gray-100 dark:to-gray-100 rounded-lg shadow-sm border border-green-200 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow dark:bg-gray-500">🏢</span>
                <span className="font-semibold text-black dark:text-white">{t('contactDetails.propertyInformationCard.infoCard.propertyType')}:</span>
                <span className="text-gray-800 dark:text-white">{data?.propertyType}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white dark:from-gray-100 dark:to-gray-100 rounded-lg shadow-sm border border-green-200 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow dark:bg-gray-500">📍</span>
                <span className="font-semibold text-black dark:text-white">{t('contactDetails.propertyInformationCard.infoCard.location')}:</span>
                <span className="text-gray-800 dark:text-white">{data?.location}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white dark:from-gray-100 dark:to-gray-100 rounded-lg shadow-sm border border-green-200 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow dark:bg-gray-500">💰</span>
                <span className="font-semibold text-black dark:text-white">{t('contactDetails.propertyInformationCard.infoCard.budget')}:</span>
                <span className="text-gray-800 dark:text-white">{data?.budget}</span>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title={t('contactDetails.contactPreferencesCard.title')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-100 to-white dark:from-gray-100 dark:to-gray-100 rounded-lg shadow-sm border border-purple-200 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow dark:bg-gray-500">📞</span>
                <span className="font-semibold text-black dark:text-white">{t('contactDetails.contactPreferencesCard.infoCard.preferredContactMethod')}:</span>
                <span className="text-gray-800 dark:text-white">{data?.preferredContactMethod}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-100 to-white dark:from-gray-100 dark:to-gray-100 rounded-lg shadow-sm border border-purple-200 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow dark:bg-gray-500">⏰</span>
                <span className="font-semibold text-black dark:text-white">{t('contactDetails.contactPreferencesCard.infoCard.preferredContactTime')}:</span>
                <span className="text-gray-800 dark:text-white">{data?.preferredContactTime ? new Date(data.preferredContactTime).toLocaleString() : 'Not specified'}</span>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title={t('contactDetails.messageDetailsCard.title')}>
            <div className="flex flex-col gap-3 p-4 bg-gradient-to-r from-yellow-100 to-white dark:from-gray-100 dark:to-gray-100 rounded-lg shadow-sm border border-yellow-200 dark:border-gray-200">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow dark:bg-gray-500">💬</span>
                <span className="font-semibold text-black dark:text-white">{t('contactDetails.messageDetailsCard.infoCard.message')}:</span>
              </div>
              <span className="text-gray-800 dark:text-white">{data?.message}</span>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title={t('contactDetails.timestampsCard.title')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-100 to-white dark:from-gray-100 dark:to-gray-100 rounded-lg shadow-sm border border-gray-200 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow dark:bg-gray-500">📅</span>
                <span className="font-semibold text-black dark:text-white">{t('contactDetails.timestampsCard.infoCard.createdAt')}:</span>
                <span className="text-gray-800 dark:text-white">{data?.createdAt ? new Date(data.createdAt).toLocaleString() : 'N/A'}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-100 to-white dark:from-gray-100 dark:to-gray-100 rounded-lg shadow-sm border border-gray-200 dark:border-gray-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow dark:bg-gray-500">🔄</span>
                <span className="font-semibold text-black dark:text-white">{t('contactDetails.timestampsCard.infoCard.updatedAt')}:</span>
                <span className="text-gray-800 dark:text-white">{data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'Not updated'}</span>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </Authorize>
    </Authenticate>
  );
}

export default DetailsContact;
