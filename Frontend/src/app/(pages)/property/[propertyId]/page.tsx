import { getPropertyById } from "@/utils/api";
import { notFound } from "next/navigation";
import CollapsibleSection from "../../(components)/CollapsibleSection";
import { propertyOptions, propertyStatuses, unitsOptions, featuresOptions, } from "../../../../constants/constants";
import InfoCard from "../../(components)/InfoCard";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";

export default async function DetailsPropertyPage({
  params,
}: {
  params: { propertyId: string };
}) {
  try {
    const response = await getPropertyById(params.propertyId);
    const BASE_URL = process.env.SERVER_BASE_URL;

    if (!response?.data) {
      return notFound();
    }

    const data = response.data;

    return (
      <Authenticate >
        <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
          <div className="max-w-[900px] w-full mx-auto py-8 px-4">
            <div className="py-4 text-center">
              <h1 className="mb-4 text-2xl font-semibold">Property Details</h1>
              <p className="mb-6 text-gray-600"> This page allows you to view the property details. </p>
            </div>

            <CollapsibleSection title="Basic Information" defaultOpen>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard icon="🏷️" label="Title" value={data.title} color="green" />
                <InfoCard icon="🏠" label="Type" value={getOptionLabel(data.propertyType, propertyOptions)} color="green" />
                <InfoCard icon="🏢" label="Unit Category" value={getOptionLabel(data.unitCategory, unitsOptions)} color="green" />
                <InfoCard icon="🏙️" label="City" value={data.city} color="green" />
                <InfoCard icon="📍" label="Location" value={data.location} color="green" />
                <InfoCard icon="📏" label="Area Size" value={data.areaSize} color="green" />
                <InfoCard icon="📄" label="Status" value={getOptionLabel(data.status, propertyStatuses)} color="green" />
                <InfoCard icon="💼" label="Investor Only" value={data.isInvestorOnly ? "Yes" : "No"} color="green" />
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Financial & Dates">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard icon="💰" label="Price" value={data.price} color="orange" />
                <InfoCard icon="📈" label="Projected Resale Value" value={data.projectedResaleValue} color="orange" />
                <InfoCard icon="🏦" label="Expected Annual Rent" value={data.expectedAnnualRent} color="orange" />
                <InfoCard icon="🛡️" label="Warranty Info" value={data.warrantyInfo} color="orange" />
                <InfoCard icon="📅" label="Expected Delivery Date" value={data.expectedDeliveryDate} color="orange" />
                <InfoCard icon="⏳" label="Expiry Date" value={data.expiryDate} color="orange" />
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Unit Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard icon="🏷️" label="Unit Name" value={data.unitName} color="purple" />
                <InfoCard icon="🛏️" label="Bedrooms" value={data.bedrooms} color="purple" />
                <InfoCard icon="🛁" label="Bathrooms" value={data.bathrooms} color="purple" />
                <InfoCard icon="🏢" label="Total Floors" value={data.totalFloors} color="purple" />
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Location & Contact">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard icon="🌐" label="Latitude" value={data.latitude} color="cyan" />
                <InfoCard icon="🌐" label="Longitude" value={data.longitude} color="cyan" />
                <InfoCard icon="📱" label="WhatsApp Number" value={data.whatsAppNumber} color="cyan" />
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Features">
              <div className="flex flex-wrap gap-2">
                {Array.isArray(data.features) && data.features.length > 0 ? (
                  data.features.map((feature: string | number, idx: number) => {
                    const label = getOptionLabel(feature, featuresOptions);
                    return (
                      <span
                        key={idx}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {label}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-gray-400">No features listed.</span>
                )}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Description">
              <div
                dangerouslySetInnerHTML={{
                  __html: data.description || "<span class='text-gray-400'>No description provided.</span>",
                }}
                className="prose max-w-none text-gray-700"
              ></div>
            </CollapsibleSection>

            <CollapsibleSection title="Images & Videos">
              <div className="flex flex-col gap-6 items-start">
                {data.imageUrls && data.imageUrls.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {data.imageUrls.map((imgSrc, idx) => (
                      <img
                        key={idx}
                        src={`${BASE_URL}/${imgSrc}`}
                        alt={`Property Preview ${idx + 1}`}
                        className="rounded-lg shadow-md w-full md:w-64 h-48 object-cover border border-gray-200"
                      />
                    ))}
                  </div>
                )}
                {Array.isArray(data?.videoUrls) && data.videoUrls.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {data.videoUrls.map((video: File, idx: number) => (
                      <video
                        key={idx}
                        src={`${BASE_URL}/${video}`}
                        controls
                        className="rounded-lg shadow-md w-full md:w-64 h-48 object-cover border border-gray-200 mb-4"
                      />
                    ))}
                  </div>
                )}
              </div>
            </CollapsibleSection>
          </div>
        </Authorize>
      </Authenticate>
    );
  } catch (error) {
    throw new Error("Failed to load property data");
  }
}

function getOptionLabel(
  value: number | string | undefined,
  options: Array<{ label: string; value: number | string }>
) {
  const found = options.find((opt) => String(opt.value) === String(value));
  return found ? found.label.replace(/([A-Z])/g, " $1").trim() : value;
}
