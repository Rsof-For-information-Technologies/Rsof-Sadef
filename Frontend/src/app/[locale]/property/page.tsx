import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { GetProperties } from "@/types/property";
import { UserRole } from "@/types/userRoles";
import { getAllProperties } from "@/utils/api";
import { Metadata } from "next";
import NavigateCreateProperty from "./(components)/navigateCreateProperty";
import PropertyPageClient from "./(components)/PropertyPageClient";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Property List Page",
};

type SearchParams = {
  pageNumber?: number,
  pageSize?: number
};

async function getProperties(searchParams: SearchParams) {
  try {
    const properties = await getAllProperties(searchParams.pageNumber, searchParams.pageSize)
    return properties;
  } catch (error) {
    console.log("Error fetching properties:", error);
    return { succeeded: false } as GetProperties;
  }
}

export default async function PropertyPage() {
  const properties = await getProperties({ pageNumber: 1, pageSize: 10 });
  const activeProperties = properties.data.items.filter((item) => item.isActive);
  const t = await getTranslations('PropertyPages.propertyListPage')
  return (
    <Authenticate >
      <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="mb-4 text-2xl font-semibold">{t('title')}</h1>
            <p className="mb-6 text-gray-600">{t('description')}</p>
          </div>
          <div>
            <NavigateCreateProperty />
          </div>
        </div>
        <PropertyPageClient initialProperties={activeProperties} />
      </Authorize>
    </Authenticate>
  );
}
