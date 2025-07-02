"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { getPropertyById } from "@/utils/api";

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm mb-4">
      <button
        className="w-full flex justify-between items-center px-6 py-4 text-lg font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none transition"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <svg className={`w-5 h-5 transition-transform ${open ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-6 pb-4 pt-2">{children}</div>}
    </div>
  );
}

const propertyOptions = [
  { label: 'Apartment', value: 0 },
  { label: 'Villa', value: 1 },
  { label: 'House', value: 2 },
  { label: 'Office', value: 3 },
  { label: 'Shop', value: 4 },
  { label: 'Plot', value: 5 },
  { label: 'Warehouse', value: 6 },
  { label: 'Building', value: 7 },
  { label: 'Farmhouse', value: 8 },
  { label: 'Penthouse', value: 9 },
  { label: 'Studio', value: 10 },
  { label: 'Commercial', value: 11 },
  { label: 'Industrial', value: 12 },
  { label: 'MixedUse', value: 13 },
  { label: 'Hotel', value: 14 },
  { label: 'Mall', value: 15 },
];

const propertyStatuses = [
  { label: 'Pending', value: 0 },
  { label: 'Approved', value: 1 },
  { label: 'Sold', value: 2 },
  { label: 'Rejected', value: 3 },
  { label: 'Archived', value: 4 },
];

const unitsOptions = [
  { label: "Residential Apartment", value: 0 },
  { label: "Rooftop Unit", value: 1 },
  { label: "Duplex", value: 2 },
  { label: "Studio", value: 3 },
  { label: "Penthouse", value: 4 },
  { label: "Ground Floor Unit", value: 5 },
  { label: "Loft", value: 6 },
  { label: "Commercial Suite", value: 7 },
  { label: "Executive Office", value: 8 },
  { label: "Retail Shop", value: 9 },
  { label: "Warehouse Unit", value: 10 },
  { label: "Hotel Room", value: 11 },
  { label: "Shared Unit", value: 12 },
];

const featuresOptions = [
  { label: "AirConditioning", value: "0" },
  { label: "Balcony", value: "1" },
  { label: "BuiltInWardrobes", value: "2" },
  { label: "CentralHeating", value: "3" },
  { label: "CoveredParking", value: "4" },
  { label: "Elevator", value: "5" },
  { label: "Garden", value: "6" },
  { label: "FitnessCenter", value: "7" },
  { label: "MaidsRoom", value: "8" },
  { label: "PetsAllowed", value: "9" },
  { label: "PrivateGarage", value: "10" },
  { label: "PrivatePool", value: "11" },
  { label: "SecuritySystem", value: "12" },
  { label: "SharedPool", value: "13" },
  { label: "SmartHomeSystem", value: "14" },
  { label: "StorageRoom", value: "15" },
  { label: "StudyOrOffice", value: "16" },
  { label: "ViewofLandmark", value: "17" },
  { label: "ViewofWater", value: "18" },
  { label: "WalkinCloset", value: "19" },
  { label: "WheelchairAccess", value: "20" },
  { label: "ChildrenPlayArea", value: "21" },
  { label: "BarbecueArea", value: "22" },
  { label: "LaundryRoom", value: "23" },
  { label: "HighFloor", value: "24" },
  { label: "LowFloor", value: "25" },
  { label: "NearPublicTransport", value: "26" },
  { label: "NearSchool", value: "27" },
  { label: "NearSupermarket", value: "28" },
  { label: "ConciergeService", value: "29" },
  { label: "InternetOrWiFiReady", value: "30" },
];

function DetailsProperty() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const params = useParams();
  const propertyIdRaw = params?.propertyId;
  const propertyId = Array.isArray(propertyIdRaw) ? propertyIdRaw[0] : propertyIdRaw;
  const { watch, reset } = useForm({});
  const formValues = watch();

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true);
      try {
        if (!propertyId) return;
        const response = await getPropertyById(propertyId);
        if (response?.data) {
          reset({
            title: response.data.title || "",
            description: response.data.description || "",
            price: response.data.price || 0,
            propertyType: response.data.propertyType || null,
            unitCategory: response.data.unitCategory || null,
            city: response.data.city || "",
            location: response.data.location || "",
            areaSize: response.data.areaSize || 0,
            bedrooms: response.data.bedrooms || 0,
            bathrooms: response.data.bathrooms || 0,
            totalFloors: response.data.totalFloors || 0,
            status: response.data.status || 0,
            videos: response.data.videoBase64Strings || [],
            unitName: response.data.unitName || "",
            projectedResaleValue: response.data.projectedResaleValue || 0,
            expectedAnnualRent: response.data.expectedAnnualRent || 0,
            warrantyInfo: response.data.warrantyInfo || "",
            expectedDeliveryDate: response.data.expectedDeliveryDate || "",
            latitude: response.data.latitude || null,
            longitude: response.data.longitude || null,
            whatsAppNumber: response.data.whatsAppNumber || "",
            expiryDate: response.data.expiryDate || null,
            isInvestorOnly: response.data.isInvestorOnly || false,
            features: response.data.features || [],
            createdAt: response.data.createdAt || "",
            updatedAt: response.data.updatedAt || "",
            imageBase64Strings: response.data.imageBase64Strings || [],
            videoBase64Strings: response.data.videoBase64Strings || [],
          });
          let imgSrc: string | null = null;
          if (response.data.imageBase64Strings && Array.isArray(response.data.imageBase64Strings) && response.data.imageBase64Strings.length > 0) {
            const base64 = response.data.imageBase64Strings[0];
            if (base64.startsWith('data:image/')) {
              imgSrc = base64;
            } else {
              imgSrc = `data:image/jpeg;base64,${base64}`;
            }
          }
          setPreviewImage(imgSrc);
        }
      } catch {
        setError("Failed to load property data.");
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [propertyId, reset]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mr-3"></div>
      <span className="text-lg font-medium text-gray-700">Loading property details...</span>
    </div>
  );

  return (
    <div className="max-w-[900px] w-full mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-primary mb-2 tracking-tight">Property Details</h2>
        <p className="text-gray-500">All information about this property is organized below.</p>
      </div>
      {error && (
        <div className="flex justify-center w-full mb-4">
          <div role="alert" className="flex items-center max-w-lg w-full justify-center gap-3 bg-red-100 border border-red-500 text-red-500 pb-2 px-4 py-2 rounded-md font-medium text-center shadow-sm" >
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" > <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /> <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /> </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <CollapsibleSection title="Basic Information" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏷️</span>
            <span className="font-semibold text-green-700">Title:</span>
            <span className="text-gray-800">{formValues.title}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏠</span>
            <span className="font-semibold text-green-700">Type:</span>
            <span className="text-gray-800">{
              (() => {
                const found = propertyOptions.find(
                  (opt) => String(opt.value) === String(formValues.propertyType) || opt.label === formValues.propertyType
                );
                return found ? found.label.replace(/([A-Z])/g, ' $1').trim() : formValues.propertyType;
              })()
            }</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏢</span>
            <span className="font-semibold text-green-700">Unit Category:</span>
            <span className="text-gray-800">{
              (() => {
                const found = unitsOptions.find(
                  (opt) => String(opt.value) === String(formValues.unitCategory) || opt.label === formValues.unitCategory
                );
                return found ? found.label : formValues.unitCategory;
              })()
            }</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏙️</span>
            <span className="font-semibold text-green-700">City:</span>
            <span className="text-gray-800">{formValues.city}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">📍</span>
            <span className="font-semibold text-green-700">Location:</span>
            <span className="text-gray-800">{formValues.location}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">📏</span>
            <span className="font-semibold text-green-700">Area Size:</span>
            <span className="text-gray-800">{formValues.areaSize}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">📄</span>
            <span className="font-semibold text-green-700">Status:</span>
            <span className="text-gray-800">{
              (() => {
                const found = propertyStatuses.find(
                  (opt) => String(opt.value) === String(formValues.status) || opt.label === formValues.status
                );
                return found ? found.label : formValues.status;
              })()
            }</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">💼</span>
            <span className="font-semibold text-green-700">Investor Only:</span>
            <span className="text-gray-800">{formValues.isInvestorOnly ? "Yes" : "No"}</span>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Financial & Dates">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-100 to-white rounded-lg shadow-sm border border-orange-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">💰</span>
            <span className="font-semibold text-orange-700">Price:</span>
            <span className="text-gray-800">{formValues.price}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-100 to-white rounded-lg shadow-sm border border-orange-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">📈</span>
            <span className="font-semibold text-orange-700">Projected Resale Value:</span>
            <span className="text-gray-800">{formValues.projectedResaleValue}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-100 to-white rounded-lg shadow-sm border border-orange-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏦</span>
            <span className="font-semibold text-orange-700">Expected Annual Rent:</span>
            <span className="text-gray-800">{formValues.expectedAnnualRent}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-100 to-white rounded-lg shadow-sm border border-orange-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🛡️</span>
            <span className="font-semibold text-orange-700">Warranty Info:</span>
            <span className="text-gray-800">{formValues.warrantyInfo}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-100 to-white rounded-lg shadow-sm border border-orange-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">📅</span>
            <span className="font-semibold text-orange-700">Expected Delivery Date:</span>
            <span className="text-gray-800">{formValues.expectedDeliveryDate}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-100 to-white rounded-lg shadow-sm border border-orange-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">⏳</span>
            <span className="font-semibold text-orange-700">Expiry Date:</span>
            <span className="text-gray-800">{formValues.expiryDate}</span>
          </div>
          {/* <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-100 to-white rounded-lg shadow-sm border border-orange-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🕒</span>
            <span className="font-semibold text-orange-700">Created At:</span>
            <span className="text-gray-800">{formValues.createdAt}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-100 to-white rounded-lg shadow-sm border border-orange-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🕒</span>
            <span className="font-semibold text-orange-700">Updated At:</span>
            <span className="text-gray-800">{formValues.updatedAt}</span>
          </div> */}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Unit Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-100 to-white rounded-lg shadow-sm border border-purple-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏷️</span>
            <span className="font-semibold text-purple-700">Unit Name:</span>
            <span className="text-gray-800">{formValues.unitName}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-100 to-white rounded-lg shadow-sm border border-purple-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🛏️</span>
            <span className="font-semibold text-purple-700">Bedrooms:</span>
            <span className="text-gray-800">{formValues.bedrooms}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-100 to-white rounded-lg shadow-sm border border-purple-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🛁</span>
            <span className="font-semibold text-purple-700">Bathrooms:</span>
            <span className="text-gray-800">{formValues.bathrooms}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-100 to-white rounded-lg shadow-sm border border-purple-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏢</span>
            <span className="font-semibold text-purple-700">Total Floors:</span>
            <span className="text-gray-800">{formValues.totalFloors}</span>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Location & Contact">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-100 to-white rounded-lg shadow-sm border border-cyan-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🌐</span>
            <span className="font-semibold text-cyan-700">Latitude:</span>
            <span className="text-gray-800">{formValues.latitude}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-100 to-white rounded-lg shadow-sm border border-cyan-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🌐</span>
            <span className="font-semibold text-cyan-700">Longitude:</span>
            <span className="text-gray-800">{formValues.longitude}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-100 to-white rounded-lg shadow-sm border border-cyan-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">📱</span>
            <span className="font-semibold text-cyan-700">WhatsApp Number:</span>
            <span className="text-gray-800">{formValues.whatsAppNumber}</span>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Features">
        <div className="flex flex-wrap gap-2">
          {Array.isArray(formValues.features) && formValues.features.length > 0 ? (
            formValues.features.map((feature: string | number, idx: number) => {
              const found = featuresOptions.find(
                (opt) => opt.value === String(feature) || opt.label === feature
              );
              return (
                <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {found ? found.label.replace(/([A-Z])/g, ' $1').trim() : feature}
                </span>
              );
            })
          ) : (
            <span className="text-gray-400">No features listed.</span>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Description">
        <div dangerouslySetInnerHTML={{ __html: formValues.description || '<span class="text-gray-400">No description provided.</span>' }} className="prose max-w-none text-gray-700"></div>
      </CollapsibleSection>

      <CollapsibleSection title="Images & Videos">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Show all valid images from imageBase64Strings, if present */}
          {Array.isArray(formValues.imageBase64Strings) && formValues.imageBase64Strings.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {formValues.imageBase64Strings.map((imgSrc: string, idx: number) =>
                imgSrc ? (
                  <img
                    key={idx}
                    src={imgSrc}
                    alt={`Property Preview ${idx + 1}`}
                    className="rounded-lg shadow-md w-full md:w-64 h-48 object-cover border border-gray-200"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : null
              )}
            </div>
          ) : null}
          {formValues.videos && formValues.videos.length > 0 && (
            <div className="flex-1">
              {formValues.videos.map((video: string, idx: number) => (
                <video
                  key={idx}
                  src={`data:video/mp4;base64,${video}`}
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

export default DetailsProperty;
