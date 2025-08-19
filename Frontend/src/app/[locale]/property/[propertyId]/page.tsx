import { getPropertyById } from "@/utils/api";
import { notFound } from "next/navigation";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";
import PropertyDetailsClient from "../(components)/PropertyDetailsClient";

export default async function DetailsPropertyPage({
  params,
}: {
  params: { propertyId: string };
}) {
  try {
    const response = await getPropertyById(params.propertyId);
    const BASE_URL = process.env.SERVER_BASE_URL || '';

    if (!response?.data) {
      return notFound();
    }

    const data = response.data;

    return (
      <Authenticate>
        <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
          <div className="max-w-[900px] w-full mx-auto py-8 px-4">
            <div className="py-4 text-center">
              <h1 className="mb-4 text-2xl font-semibold">Property Details</h1>
              <p className="mb-6 text-gray-600">This page allows you to view the property details.</p>
            </div>
            <PropertyDetailsClient propertyData={data} baseUrl={BASE_URL} />
          </div>
        </Authorize>
      </Authenticate>
    );
  } catch (error) {
    throw new Error("Failed to load property data");
  }
}
