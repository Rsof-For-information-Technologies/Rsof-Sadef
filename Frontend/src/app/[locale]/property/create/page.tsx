"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { StepIndicator } from "../(components)/step-indicator"
import { BasicInfoStep } from "../(components)/basic-info-step"
import { PropertyDetailsStep } from "../(components)/property-details-step"
import { PropertyMediaStep } from "../(components)/property-media-step"
import { LocationStep } from "../(components)/location-step"
import { ContactPublishingStep } from "../(components)/contact-publishing-step"
import { createProperty } from "@/utils/api"
import { Button } from "rizzui"
import { basicInfoSchema, contactPublishingSchema, CreatePropertyFormData, createPropertySchema, locationSchema, propertyDetailsSchema, propertyMediaSchema } from "@/validators/createProperty"
import Authenticate from "@/components/auth/authenticate"
import Authorize from "@/components/auth/authorize"
import { UserRole } from "@/types/userRoles"
import { convertNumberToLocalFormat } from "@/utils/convertNumberToLocalFormat"
import { useTranslations } from "next-intl"
import { Params } from "@/types/params";
import cn from "@/utils/class-names";

export default function CreatePropertyPage() {
  const t = useTranslations('PropertyPages.createPropertyPage')
  const params = useParams<Params>()

  const STEPS = [
    { title: t('createProperty.steps.basicInfo'), component: BasicInfoStep, schema: basicInfoSchema },
    { title: t('createProperty.steps.propertyDetails'), component: PropertyDetailsStep, schema: propertyDetailsSchema },
    { title: t('createProperty.steps.propertyMedia'), component: PropertyMediaStep, schema: propertyMediaSchema },
    { title: t('createProperty.steps.location'), component: LocationStep, schema: locationSchema },
    { title: t('createProperty.steps.contactPublishing'), component: ContactPublishingStep, schema: contactPublishingSchema },
  ]

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<CreatePropertyFormData>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      city: undefined,
      location: "",
      areaSize: 0,
      propertyType: undefined,
      unitCategory: undefined,
      bedrooms: 0,
      bathrooms: 0,
      totalFloors: undefined,
      unitName: "",
      status: undefined,
      features: [],
      projectedResaleValue: 0,
      expectedAnnualRent: 0,
      warrantyInfo: "",
      expectedDeliveryDate: undefined,
      expiryDate: undefined,
      images: [],
      videos: [],
      latitude: undefined,
      longitude: undefined,
      whatsAppNumber: "",
      isInvestorOnly: false,
    },
  })

  const {
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = form


  console.log("Property Values", watch());

  const validateCurrentStep = async () => {
    const currentStepSchema = STEPS[currentStep - 1].schema
    const isValid = await trigger(Object.keys(currentStepSchema.shape) as any)
    return isValid
  }

  const nextStep = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: CreatePropertyFormData) => {
    const features = Array.isArray(data.features)
      ? data.features.map((f) => String(Number(f)))
      : [];

    const formattedData = {
      ...data,
      whatsAppNumber: convertNumberToLocalFormat(data.whatsAppNumber as string) || "",
      features,
    };
    setIsSubmitting(true)
    try {
      const response = await createProperty(formattedData)
      if (response.succeeded) {
        toast.success("Property created successfully!")
        router.push("/property")
      } else {
        toast.error(response.message || "Failed to create property")
      }
    } catch (error) {
      console.error("Error creating property:", error)
      toast.error("Failed to create property. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component

  return (
    <Authenticate>
      <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="flex flex-col py-6">
          <div>
            <h1 className="mb-4 text-2xl font-semibold">{t('title')}</h1>
            <p className="mb-6 text-gray-600">{t('description')}</p>
          </div>

          <StepIndicator currentStep={currentStep} totalSteps={STEPS.length} stepTitles={STEPS.map((step) => step.title)} />

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
                <ChevronLeft className={cn("h-4 w-4", params.locale === 'ar' ? "rotate-180" : "rotate-0")} />
                {t('createProperty.btn.previous')}
              </Button>

              {currentStep < STEPS.length ? (
                <Button type="button" onClick={nextStep} className="flex items-center gap-2">
                  {t('createProperty.btn.next')}
                  <ChevronRight className={cn("h-4 w-4", params.locale === 'ar' ? "rotate-180" : "rotate-0")} />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t('createProperty.btn.createProperty')}
                </Button>
              )}
            </div>
          </form>

          {/* Debug: Show validation errors */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-red-800 font-medium mb-2">{t('createProperty.validationErrors.title')}</h4>
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
  )
}
