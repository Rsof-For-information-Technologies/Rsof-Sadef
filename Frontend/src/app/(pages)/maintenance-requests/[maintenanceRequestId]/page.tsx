
import { getMaintenanceRequestById } from "@/utils/api";
import { CollapsibleSection } from "./collapsibleSection";
import { notFound } from "next/navigation";
import Image from "next/image";
import { DataItem } from "@/types/maintenanceRequest";

const maintenenceStatuses = [
  { label: 'Pending', value: 0 },
  { label: 'Approved', value: 1 },
  { label: 'Sold', value: 2 },
  { label: 'Rejected', value: 3 },
  { label: 'Archived', value: 4 },
];

interface DetailsMaintenanceRequestProps {
  params: { maintenanceRequestId: string };
}

export default async function DetailsMaintenanceRequest({ params }: DetailsMaintenanceRequestProps) {
  let data: DataItem | null = null;
  try {
    const response = await getMaintenanceRequestById(params.maintenanceRequestId);
   if (!response?.data) return notFound();
    data = response.data;
  } catch {
    return notFound();
  }

  return (
    <div className="max-w-[900px] w-full mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-primary mb-2 tracking-tight">Maintenance Request Details</h2>
        <p className="text-gray-500">All information about this maintenance request is organized below.</p>
      </div>

      <CollapsibleSection title="Basic Information" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏷️</span>
            <span className="font-semibold text-green-700">ID:</span>
            <span className="text-gray-800">{data.id}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏷️</span>
            <span className="font-semibold text-green-700">Lead ID:</span>
            <span className="text-gray-800">{data.leadId}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">📄</span>
            <span className="font-semibold text-green-700">Status:</span>
            <span className="text-gray-800">{
              (() => {
                const found = maintenenceStatuses.find(
                  (opt) => String(opt.value) === String(data?.status)
                );
                return found ? found.label : data?.status;
              })()
            }</span>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Description">
        <div dangerouslySetInnerHTML={{ __html: data.description || '<span class="text-gray-400">No description provided.</span>' }} className="prose max-w-none text-gray-700"></div>
      </CollapsibleSection>

      <CollapsibleSection title="Images & Videos">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {Array.isArray(data.imageBase64Strings) && data.imageBase64Strings.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {data.imageBase64Strings.map((imgSrc: string, idx: number) =>
                imgSrc ? (
                  <Image
                    height={200}
                    width={300}
                    key={idx}
                    src={imgSrc}
                    alt={`Maintenence Request Preview ${idx + 1}`}
                    className="rounded-lg shadow-md w-full md:w-64 h-48 object-cover border border-gray-200"
                  />
                ) : null
              )}
            </div>
          ) : null}
          {data.videoUrls && data.videoUrls.length > 0 && (
            <div className="flex-1">
              {data.videoUrls.map((video: string, idx: number) => (
                <video
                  key={idx}
                  src={video}
                  controls
                  className="rounded-lg shadow-md w-full md:w-64 h-48 object-cover border border-gray-200 mb-4"
                />
              ))}
            </div>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );
}
