import React from "react";
import { getLeadById } from "@/utils/api";
import { notFound } from "next/navigation";
import { LeadItem } from "@/types/lead";
import CollapsibleSection from "../../(components)/CollapsibleSection";

const leadStatuses = [
  { label: "Pending", value: 0 },
  { label: "Approved", value: 1 },
  { label: "Sold", value: 2 },
  { label: "Rejected", value: 3 },
  { label: "Archived", value: 4 },
];

interface DetailsLeadProps {
  params: { leadId: string };
}

async function DetailsLead({ params }: DetailsLeadProps) {
  let data: LeadItem | null = null;
  try {
    const response = await getLeadById(params.leadId);
    if (!response?.data) return notFound();
    data = response.data;
  } catch {
    return notFound();
  }

  return (
    <div className="max-w-[900px] w-full mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-primary mb-2 tracking-tight">
          Lead Details
        </h2>
        <p className="text-gray-500">
          All information about this lead is organized below.
        </p>
      </div>
      <CollapsibleSection title="Lead Information" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">
              🏷️
            </span>
            <span className="font-semibold text-green-700">ID:</span>
            <span className="text-gray-800">{data?.id}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">
              👤
            </span>
            <span className="font-semibold text-green-700">Full Name:</span>
            <span className="text-gray-800">{data?.fullName}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">
              📧
            </span>
            <span className="font-semibold text-green-700">Email:</span>
            <span className="text-gray-800">{data?.email}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">
              📞
            </span>
            <span className="font-semibold text-green-700">Phone:</span>
            <span className="text-gray-800">{data?.phone}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">
              🏠
            </span>
            <span className="font-semibold text-green-700">Property ID:</span>
            <span className="text-gray-800">{data?.propertyId}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">
              📅
            </span>
            <span className="font-semibold text-green-700">Status:</span>
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
            <span className="font-semibold text-green-700">Message:</span>
          </div>
          <span className="text-gray-800">{data?.message}</span>
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default DetailsLead;
