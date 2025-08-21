import React from "react";
import { getLeadById } from "@/utils/api";
import { notFound } from "next/navigation";
import { LeadItem } from "@/types/lead";
import CollapsibleSection from "../../(components)/CollapsibleSection";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";
import { leadStatuses } from "@/constants/constants";
import { getTranslations } from "next-intl/server";
interface DetailsLeadProps {
  params: { leadId: string };
}

async function DetailsLead({ params }: DetailsLeadProps) {
  const t = await getTranslations('LeadPages.leadDetailPage');
  let data: LeadItem | null = null;
  try {
    const response = await getLeadById(params.leadId);
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
          <CollapsibleSection title={t('leadDetails.basicInformationCard.title')} defaultOpen>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">
                  🏷️
                </span>
                <span className="font-semibold text-green-700">{t('leadDetails.basicInformationCard.infoCard.title')}:</span>
                <span className="text-gray-800">{data?.id}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">
                  👤
                </span>
                <span className="font-semibold text-green-700">{t('leadDetails.basicInformationCard.infoCard.fullName')}:</span>
                <span className="text-gray-800">{data?.fullName}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">
                  📧
                </span>
                <span className="font-semibold text-green-700">{t('leadDetails.basicInformationCard.infoCard.email')}:</span>
                <span className="text-gray-800">{data?.email}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">
                  📞
                </span>
                <span className="font-semibold text-green-700">{t('leadDetails.basicInformationCard.infoCard.phone')}:</span>
                <span className="text-gray-800">{data?.phone}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">
                  🏠
                </span>
                <span className="font-semibold text-green-700">{t('leadDetails.basicInformationCard.infoCard.propertyId')}:</span>
                <span className="text-gray-800">{data?.propertyId}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">
                  📅
                </span>
                <span className="font-semibold text-green-700">{t('leadDetails.basicInformationCard.infoCard.status')}:</span>
                <span className="text-gray-800">
                  {(() => {
                    const found = leadStatuses.find(
                      (opt) => String(opt.value) === String(data?.status)
                    );
                    return found ? found.label : data?.status;
                  })()}
                </span>
              </div>
            </div>
            <div className="flex flex-col mt-6 gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">
                  💬
                </span>
                <span className="font-semibold text-green-700">{t('leadDetails.basicInformationCard.infoCard.message')}:</span>
                <span className="text-gray-800">{data?.message}</span>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </Authorize>
    </Authenticate>
  );
}

export default DetailsLead;
