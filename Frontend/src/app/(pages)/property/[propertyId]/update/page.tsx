"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { StepIndicator } from "../../(components)/step-indicator";
import { BasicInfoStep } from "../../(components)/basic-info-step";
import { PropertyDetailsStep } from "../../(components)/property-details-step";
import { PropertyMediaStep } from "../../(components)/property-media-step";
import { LocationStep } from "../../(components)/location-step";
import { ContactPublishingStep } from "../../(components)/contact-publishing-step";
import { getPropertyById, updateProperty } from "@/utils/api";
import { Button } from "rizzui";
import {
  basicInfoSchema,
  contactPublishingSchema,
  CreatePropertyFormData,
  createPropertySchema,
  locationSchema,
  propertyDetailsSchema,
  propertyMediaSchema,
} from "@/validators/createProperty";

const STEPS = [
  { title: "Basic Info", component: BasicInfoStep, schema: basicInfoSchema },
  { title: "Property Details", component: PropertyDetailsStep, schema: propertyDetailsSchema, },
  { title: "Property Media", component: PropertyMediaStep, schema: propertyMediaSchema, },
  { title: "Location / Map", component: LocationStep, schema: locationSchema },
  { title: "Contact & Publishing", component: ContactPublishingStep, schema: contactPublishingSchema, },
];

export default function UpdatePropertyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatedImages, setUpdatedImages] = useState<string[]>([]);
  const router = useRouter();
  const params = useParams();

  const propertyIdRaw = params?.propertyId;
  const propertyId = Array.isArray(propertyIdRaw) ? propertyIdRaw[0] : propertyIdRaw;

  const form = useForm<CreatePropertyFormData>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      city: "",
      location: "",
      areaSize: 0,
      features: [],
      images: [],
      videos: [],
      isInvestorOnly: false,
    },
  });

  const {
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true);
      try {
        const response = await getPropertyById(propertyId);
        if (response?.data) {
          if ((response.data.imageBase64Strings?.length ?? 0) > 0) {
            setUpdatedImages(response.data.imageBase64Strings || []);
          }
          const {
            title,
            description,
            price,
            city,
            location,
            areaSize,
            features,
            images,
            videos,
            isInvestorOnly,
            propertyType,
            unitCategory,
            bedrooms,
            bathrooms,
            totalFloors,
            unitName,
            projectedResaleValue,
            expectedAnnualRent,
            warrantyInfo,
            expectedDeliveryDate,
            status,
            expiryDate,
            latitude,
            longitude,
            whatsAppNumber,
          } = response.data;
          reset({
            title,
            description,
            price,
            city,
            location,
            areaSize,
            features: features?.map( f => f.toString()),
            images: response.data.imageBase64Strings || [],
            videos: response.data.videoBase64Strings || [],
            isInvestorOnly: isInvestorOnly || false,
            propertyType,
            unitCategory,
            bedrooms: bedrooms ?? undefined,
            bathrooms: bathrooms ?? undefined,
            totalFloors: totalFloors ?? undefined,
            unitName: unitName ?? undefined,
            projectedResaleValue: projectedResaleValue ?? undefined,
            expectedAnnualRent: expectedAnnualRent ?? undefined,
            warrantyInfo: warrantyInfo ?? undefined,
            expectedDeliveryDate: expectedDeliveryDate ?? undefined,
            status: status ?? undefined,
            expiryDate: expiryDate ?? undefined,
            latitude: latitude ?? undefined,
            longitude: longitude ?? undefined,
            whatsAppNumber: whatsAppNumber ?? undefined,
          });
        }
      } catch (error) {
        toast.error("Failed to fetch property data.");
      } finally {
        setLoading(false);
      }
    }
    if (propertyId) fetchProperty();
  }, [propertyId, reset]);

  const validateCurrentStep = async () => {
    const currentStepSchema = STEPS[currentStep - 1].schema;
    const isValid = await trigger(Object.keys(currentStepSchema.shape) as any);
    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: CreatePropertyFormData) => {
    const features = Array.isArray(data.features)
      ? data.features.map((f) => String(Number(f)))
      : [];
    const formattedData = {
      ...data,
      features,
    };
    setIsSubmitting(true);
    try {
      const response = await updateProperty(propertyId, formattedData);
      if (response.succeeded) {
        toast.success("Property updated successfully!");
        router.push("/property");
      } else {
        toast.error(response.message || "Failed to update property");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading property data...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Update Property
        </h1>
        <p className="text-gray-600">
          Edit the details and update your property
        </p>
      </div>

      <StepIndicator
        currentStep={currentStep}
        totalSteps={STEPS.length}
        stepTitles={STEPS.map((step) => step.title)}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <CurrentStepComponent form={form} />

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Update Property
            </Button>
          )}
        </div>
      </form>

      {/* Debug: Show validation errors */}
      {Object.keys(errors).length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium mb-2">Validation Errors:</h3>
          <ul className="text-red-700 text-sm space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                <strong>{field}:</strong> {error?.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
