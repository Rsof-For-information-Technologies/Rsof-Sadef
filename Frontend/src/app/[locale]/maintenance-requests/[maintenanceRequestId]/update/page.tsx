
import { notFound } from "next/navigation";
import UpdateMaintenanceRequestForm from "./UpdateMaintenanceRequestForm";
import { getMaintenanceRequestById } from "@/utils/api";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";
import { getTranslations } from "next-intl/server";

interface UpdateMaintenanceRequestProps {
  params: { maintenanceRequestId: string };
}

export default async function UpdateMaintenanceRequest({ params }: UpdateMaintenanceRequestProps) {
  const t = await getTranslations('MaintenancePages.updateMaintenanceRequestPage');
  let data = null;
  try {
    const res = await getMaintenanceRequestById(params.maintenanceRequestId);
    if (!res?.data) return notFound();
    data = res.data;
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
        </div>
        <UpdateMaintenanceRequestForm initialData={data} />
      </Authorize>
    </Authenticate>
  );
}
