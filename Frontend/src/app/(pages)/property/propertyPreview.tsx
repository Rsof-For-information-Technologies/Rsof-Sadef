import React from "react";
import Image from "next/image";

interface PropertyPreviewProps {
  title: string;
  description: string;
  price: string;
  propertyType?: string;
  unitCategory?: string;
  city: string;
  location: string;
  areaSize: string;
  bedrooms?: string;
  bathrooms?: string;
  totalFloors?: string;
  imageBase64Strings: FileList | null | string;
  previewImage?: string | null;
  status?: string;
  videos?: string[];
  unitName?: string;
  projectedResaleValue?: string;
  expectedAnnualRent?: string;
  warrantyInfo?: string;
  latitude?: string;
  longitude?: string;
  whatsAppNumber?: string;
  expectedDeliveryDate?: string;
  expiryDate?: string;
  isInvestorOnly: boolean;
  features?: string[];
  createdAt?: string;
  updatedAt?: string;
  videoBase64Strings?: string[];
}

function PropertyPreview({
  title,
  description,
  price,
  propertyType,
  unitCategory,
  city,
  location,
  areaSize,
  bedrooms,
  bathrooms,
  totalFloors,
  imageBase64Strings,
  previewImage,
  status,
  videos,
  unitName,
  projectedResaleValue,
  expectedAnnualRent,
  warrantyInfo,
  latitude,
  longitude,
  whatsAppNumber,
  expectedDeliveryDate,
  expiryDate,
  isInvestorOnly,
  features,
  createdAt,
  updatedAt,
  videoBase64Strings
}: PropertyPreviewProps) {
  return (
    <div className="block w-full">
      <p className="text-[14px] mb-[6px]">Preview</p>
      <div className="rounded-lg border-2 overflow-hidden">
        <div className="bg-white p-2">
          {previewImage ||
            (imageBase64Strings &&
              imageBase64Strings instanceof FileList &&
              imageBase64Strings.length > 0) ? (
            <div className="mb-4 h-60 relative border-2 rounded-lg overflow-hidden">
              <Image
                src={
                  previewImage ||
                  (imageBase64Strings instanceof FileList &&
                    imageBase64Strings.length > 0 &&
                    imageBase64Strings[0] instanceof File
                    ? URL.createObjectURL(imageBase64Strings[0])
                    : "")
                }
                alt="property cover"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="mb-4 h-60 bg-gray-100 border-1 rounded-lg flex items-center justify-center text-gray-400">
              Cover Image Preview
            </div>
          )}
          <h2 className="text-xl font-bold mb-2">
            {title || "Your property Title"}
          </h2>
          <h5 className="text-xl font-bold mb-2">
            {description || "Your property Title"}
          </h5>
          <p className="text-sm text-gray-500 mb-2">
            {price || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {propertyType || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {unitCategory || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {city || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {location || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {areaSize || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {bedrooms || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {bathrooms || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {totalFloors || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {unitName || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {projectedResaleValue || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {expectedAnnualRent || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {warrantyInfo || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {latitude || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {longitude || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {whatsAppNumber || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {expectedDeliveryDate || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {expiryDate || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {isInvestorOnly ? "Yes" : "No"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {(features?.length ?? 0) > 0 ? features!.join(", ") : "No features"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {createdAt || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {updatedAt || "Your property Title"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {(imageBase64Strings?.length ?? 0) > 0
              ? "imageBase64Strings are uploaded"
              : "No imageBase64Strings uploaded"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {(videoBase64Strings?.length ?? 0) > 0
              ? "Videos are uploaded"
              : "No videos uploaded"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PropertyPreview;
