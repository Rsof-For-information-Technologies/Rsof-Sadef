"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { StepIndicator } from "../../(components)/step-indicator";
import { Button } from "rizzui";
import { CreatePropertyFormData, createPropertySchema, } from "@/validators/createProperty";
import { updateProperty } from "@/utils/api";
import { CreatePropertyData } from "@/types/property";
import { STEPS } from "@/constants/constants";
import { convertNumberToLocalFormat } from "@/utils/convertNumberToLocalFormat";
import { UserRole } from "@/types/userRoles";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { useTranslations } from "next-intl"

interface UpdatePropertyFormProps {
  propertyId: string;
  initialData: CreatePropertyData;
}

export default function UpdatePropertyForm({
  propertyId,
  initialData,
}: UpdatePropertyFormProps) {
  const t = useTranslations('PropertyPages.updatePropertyPage.updateProperty')
  console.log({ propertyId, initialData });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<CreatePropertyFormData>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      title: initialData.title,
      description: initialData.description,
      price: initialData.price,
      city: initialData.city,
      location: initialData.location,
      areaSize: initialData.areaSize,
      features: initialData.features?.map((f) => f.toString()),
      images: initialData.imageUrls || [],
      videos: initialData.videoUrls || [],
      isInvestorOnly: initialData.isInvestorOnly ?? false,
      propertyType: initialData.propertyType,
      unitCategory: initialData.unitCategory,
      bedrooms: initialData.bedrooms,
      bathrooms: initialData.bathrooms,
      totalFloors: initialData.totalFloors,
      unitName: initialData.unitName,
      projectedResaleValue: initialData.projectedResaleValue,
      expectedAnnualRent: initialData.expectedAnnualRent,
      warrantyInfo: initialData.warrantyInfo,
      expectedDeliveryDate: initialData.expectedDeliveryDate,
      status: initialData.status,
      expiryDate: initialData.expiryDate,
      latitude: initialData.latitude,
      longitude: initialData.longitude,
      whatsAppNumber: initialData.whatsAppNumber,
    },
  });

  const {
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = form;

  console.log("Update Property Values", watch());

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
      whatsAppNumber: convertNumberToLocalFormat(data.whatsAppNumber as string) || "",
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

  return (
    <Authenticate>
      <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="flex flex-col">
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
                {t('btn.previous')}
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2"
                >
                  {t('btn.next')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t('btn.updateProperty')}
                </Button>
              )}
            </div>
          </form>

          {Object.keys(errors).length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-medium mb-2">{t('validationErrors.title')}</h3>
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
      </Authorize>
    </Authenticate>
  );
}
