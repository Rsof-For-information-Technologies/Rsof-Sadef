
import { notFound } from "next/navigation";
import UpdateMaintenanceRequestForm from "./UpdateMaintenanceRequestForm";
import { getMaintenanceRequestById } from "@/utils/api";

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
    <>
      <div className="py-4 text-center">
        <h1 className="mb-4 text-2xl font-semibold">Update Maintenance Request</h1>
        <p className="mb-6 text-gray-600"> This page allows you to update the maintenance request details. </p>
      </div>
      <UpdateMaintenanceRequestForm initialData={data} />
    </>
  );
}
