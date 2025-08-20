import { getPropertyById } from "@/utils/api";
import { notFound } from "next/navigation";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";
import PropertyDetailsClient from "../(components)/PropertyDetailsClient";
import { getTranslations } from "next-intl/server";

export default async function DetailsPropertyPage({
  params,
}: {
  params: { propertyId: string };
}) {
  try {
    const t = await getTranslations('PropertyPages.propertyDetailPage');
    const response = await getPropertyById(params.propertyId);
    const BASE_URL = process.env.SERVER_BASE_URL || '';

    if (!response?.data) {
      return notFound();
    }

    const data = response.data;

    return (
      <Authenticate>
        <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="flex flex-col justify-between items-start py-6">
            <div>
              <h1 className="mb-4 text-2xl font-semibold">{t('title')}</h1>
              <p className="mb-6 text-gray-600">{t('description')}</p>
            </div>
            <PropertyDetailsClient propertyData={data} baseUrl={BASE_URL} />
          </div>
        </Authorize>
      </Authenticate>
    );
  } catch (error) {
    throw new Error("Failed to load property data");
  }
}
