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

interface DetailsContactProps {
  params: { contactId: string };
}

async function DetailsContact({ params }: DetailsContactProps) {
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
        <div className="max-w-[900px] w-full mx-auto py-8 px-4">
          <div className="py-4 text-center">
            <h1 className="mb-4 text-2xl font-semibold">Contact Details</h1>
            <p className="mb-6 text-gray-600">View detailed contact information and inquiry details.</p>
          </div>

          <CollapsibleSection title="Basic Information" defaultOpen>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏷️</span>
                <span className="font-semibold text-blue-700">ID:</span>
                <span className="text-gray-800">{data?.id}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow">👤</span>
                <span className="font-semibold text-blue-700">Full Name:</span>
                <span className="text-gray-800">{data?.fullName}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow">📧</span>
                <span className="font-semibold text-blue-700">Email:</span>
                <span className="text-gray-800">{data?.email}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow">📞</span>
                <span className="font-semibold text-blue-700">Phone:</span>
                <span className="text-gray-800">{data?.phone}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏠</span>
                <span className="font-semibold text-blue-700">Property ID:</span>
                <span className="text-gray-800">{data?.propertyId}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow">📅</span>
                <span className="font-semibold text-blue-700">Status:</span>
                <Badge
                  color={
                    data?.status === 0 ? "warning" :
                    data?.status === 1 ? "info" :
                    data?.status === 2 ? "success" :
                    data?.status === 3 ? "info" :
                    data?.status === 4 ? "success" :
                    data?.status === 5 ? "danger" :
                    data?.status === 6 ? "secondary" :
                    data?.status === 7 ? "danger" :
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

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow">🚨</span>
                <span className="font-semibold text-blue-700">Urgent:</span>
                <Badge
                  color={data?.isUrgent ? "danger" : "secondary"}
                  className="min-w-[80px] text-center"
                >
                  {data?.isUrgent ? "Urgent" : "Normal"}
                </Badge>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Property Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
                <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow">📋</span>
                <span className="font-semibold text-green-700">Subject:</span>
                <span className="text-gray-800">{data?.subject}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
                <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏢</span>
                <span className="font-semibold text-green-700">Property Type:</span>
                <span className="text-gray-800">{data?.propertyType}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
                <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow">📍</span>
                <span className="font-semibold text-green-700">Location:</span>
                <span className="text-gray-800">{data?.location}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
                <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow">💰</span>
                <span className="font-semibold text-green-700">Budget:</span>
                <span className="text-gray-800">{data?.budget}</span>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Contact Preferences">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-100 to-white rounded-lg shadow-sm border border-purple-200">
                <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow">📞</span>
                <span className="font-semibold text-purple-700">Preferred Contact Method:</span>
                <span className="text-gray-800">{data?.preferredContactMethod}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-100 to-white rounded-lg shadow-sm border border-purple-200">
                <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow">⏰</span>
                <span className="font-semibold text-purple-700">Preferred Contact Time:</span>
                <span className="text-gray-800">{data?.preferredContactTime ? new Date(data.preferredContactTime).toLocaleString() : 'Not specified'}</span>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Message Details">
            <div className="flex flex-col gap-3 p-4 bg-gradient-to-r from-yellow-100 to-white rounded-lg shadow-sm border border-yellow-200">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow">💬</span>
                <span className="font-semibold text-yellow-700">Message:</span>
              </div>
              <span className="text-gray-800">{data?.message}</span>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Timestamps">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-100 to-white rounded-lg shadow-sm border border-gray-200">
                <span className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow">📅</span>
                <span className="font-semibold text-gray-700">Created At:</span>
                <span className="text-gray-800">{data?.createdAt ? new Date(data.createdAt).toLocaleString() : 'N/A'}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-100 to-white rounded-lg shadow-sm border border-gray-200">
                <span className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow">🔄</span>
                <span className="font-semibold text-gray-700">Updated At:</span>
                <span className="text-gray-800">{data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'Not updated'}</span>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </Authorize>
    </Authenticate>
  );
}

export default DetailsContact;
