"use client"

import { useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import { CreatePropertyFormData } from "@/validators/createProperty"
import { Label } from "@/components/shadCn/ui/label"
import { Input, MultiSelect, Select, Textarea } from "rizzui"
import RichTextEditor from "@/components/textEditor/rich-text-editor"
import { useStaticDataStore } from "@/store/static-data.store"

interface PropertyDetailsStepProps {
  form: UseFormReturn<CreatePropertyFormData>
}

export function PropertyDetailsStep({ form }: PropertyDetailsStepProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form

  const { features, fetchStaticData } = useStaticDataStore();

  // Fetch static data on component mount
  useEffect(() => {
    fetchStaticData();
  }, [fetchStaticData]);

  // Convert static data to MultiSelect options format
  const featuresOptions = features.map(feature => ({
    label: feature.displayName,
    value: feature.value.toString()
  }));

  return (
    <div>
      <div className="mb-4">
        <h3>Property Details</h3>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="description">Description <span className="text-red-600">*</span></Label>
          <RichTextEditor
            value={watch("description") || ""}
            onChange={val => setValue("description", val)}
          // error={errors.description?.message}
          />
          {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <MultiSelect
            label="Features"
            options={featuresOptions}
            value={watch("features")?.map(String)}
            onChange={(value) => setValue("features", value as string[])}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="projectedResaleValue">Projected Resale</Label>
            <Input
              id="projectedResaleValue"
              type="number"
              min="0"
              {...register("projectedResaleValue", {
                setValueAs: (value: string) => (value === "" ? undefined : Number(value)),
                required: "Projected resale value is required",
                min: { value: 0, message: "Value must be positive" }
              })}
              placeholder="Enter projected resale value"
            />
            {errors.projectedResaleValue && <p className="text-sm text-red-600">{errors.projectedResaleValue.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedAnnualRent">Expected Annual Rent</Label>
            <Input
              id="expectedAnnualRent"
              type="number"
              min="0"
              {...register("expectedAnnualRent", {
                setValueAs: (value: string) => (value === "" ? undefined : Number(value)),
                required: "Expected annual rent is required",
                min: { value: 0, message: "Value must be positive" }
              })}
              placeholder="Enter expected annual rent"
            />
            {errors.expectedAnnualRent && <p className="text-sm text-red-600">{errors.expectedAnnualRent.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="warrantyInfo">Warranty Information</Label>
          <Textarea id="warrantyInfo" {...register("warrantyInfo")} placeholder="Enter warranty details" rows={3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
            <Input id="expectedDeliveryDate" type="date" {...register("expectedDeliveryDate")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Listing Expiry Date</Label>
            <Input id="expiryDate" type="date" {...register("expiryDate")} />
          </div>
        </div>

        {/* <div className="space-y-2">
           <Select
            label="Select"
            options={options}
            value={watch("status")}
            onChange={(value) => setValue("status", value as number)}
          />
        </div> */}
      </div>
    </div>
  )
}
