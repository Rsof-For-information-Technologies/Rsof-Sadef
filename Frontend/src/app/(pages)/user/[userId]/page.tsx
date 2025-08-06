
import { getUserById } from "@/utils/api";
import { notFound } from "next/navigation";
import { User } from "@/types/user";
import CollapsibleSection from "../../(components)/CollapsibleSection";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";
import { Badge } from "rizzui";

interface DetailsUserProps {
  params: { userId: string };
}

export default async function DetailsUser({ params }: DetailsUserProps) {
  let data: User | null = null;
  try {
    const response = await getUserById(params.userId);
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
            <h1 className="mb-4 text-2xl font-semibold">User Details</h1>
            <p className="mb-6 text-gray-600"> This page allows you to view the user details. </p>
          </div>

          <CollapsibleSection title="Basic Information" defaultOpen>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200">
                <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏷️</span>
                <span className="font-semibold text-black">ID:</span>
                <span className="text-gray-800">{data.id}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200">
                <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-base shadow">👤</span>
                <span className="font-semibold text-black">First Name:</span>
                <span className="text-gray-800">{data.firstName}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200">
                <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-base shadow">👤</span>
                <span className="font-semibold text-black">Last Name:</span>
                <span className="text-gray-800">{data.lastName}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200">
                <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-base shadow">📧</span>
                <span className="font-semibold text-black">Email:</span>
                <span className="text-gray-800">{data.email}</span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200">
                <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-base shadow">🔐</span>
                <span className="font-semibold text-black">Role:</span>
                <Badge
                  color={
                    data.role === "SuperAdmin" ? "danger" :
                      data.role === "Admin" ? "success" :
                        data.role === "Investor" ? "info" :
                          "warning"
                  }
                  className="min-w-[80px] text-center"
                >
                  {data.role}
                </Badge>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-sm border border-blue-200">
                <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-base shadow">✅</span>
                <span className="font-semibold text-black">Status:</span>
                <Badge
                  color={data.isActive ? "success" : "warning"}
                  className="min-w-[80px] text-center"
                >
                  {data.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Account Summary">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-lg font-bold text-black">{data.firstName} {data.lastName}</div>
                  <div className="text-sm text-gray-600">Full Name</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-lg font-bold text-black">{data.email}</div>
                  <div className="text-sm text-gray-600">Email Address</div>
                </div>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </Authorize>
    </Authenticate>
  );
}
