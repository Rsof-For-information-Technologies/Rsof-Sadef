
import { notFound } from "next/navigation";
import UpdateMaintenanceRequestForm from "./UpdateMaintenanceRequestForm";
import { getMaintenanceRequestById } from "@/utils/api";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";

interface UpdateMaintenanceRequestProps {
  params: { maintenanceRequestId: string };
}

export default async function UpdateMaintenanceRequest({ params }: UpdateMaintenanceRequestProps) {
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
        <div className="py-4 text-center">
          <h1 className="mb-4 text-2xl font-semibold">Update Maintenance Request</h1>
          <p className="mb-6 text-gray-600"> This page allows you to update the maintenance request details. </p>
        </div>
        <UpdateMaintenanceRequestForm initialData={data} />
      </Authorize>
    </Authenticate>
  );
}
