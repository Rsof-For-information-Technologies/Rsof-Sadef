import { getPropertyById } from "@/utils/api";
import { notFound } from "next/navigation";
import UpdatePropertyForm from "./updatePropertyForm";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";

export default async function UpdatePropertyPage({
  params,
}: {
  params: { propertyId: string };
}) {
  try {
    const response = await getPropertyById(params.propertyId);

    if (!response?.data) {
      return notFound();
    }

    return (
      <Authenticate >
        <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
          <div className="container">
            <div className="py-4 text-center">
              <h1 className="mb-4 text-2xl font-semibold">Update Property</h1>
              <p className="mb-6 text-gray-600">
                This page allows you to update the property details.
              </p>
            </div>
            <UpdatePropertyForm propertyId={params.propertyId} initialData={response.data} />
          </div>
        </Authorize>
      </Authenticate>
    );
  } catch (error) {
    throw new Error("Failed to load property data");
  }
}
