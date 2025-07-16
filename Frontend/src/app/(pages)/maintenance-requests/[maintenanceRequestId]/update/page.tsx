
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
    <UpdateMaintenanceRequestForm initialData={data} />
  );
}
