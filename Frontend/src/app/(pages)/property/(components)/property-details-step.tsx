"use client"

import type { UseFormReturn } from "react-hook-form"
import { CreatePropertyFormData } from "@/validators/createProperty"
import { Label } from "@/components/shadCn/ui/label"
import { Button, Input, MultiSelect, Select, Textarea } from "rizzui"
import RichTextEditor from "@/components/textEditor/rich-text-editor"

interface PropertyDetailsStepProps {
  form: UseFormReturn<CreatePropertyFormData>
}

// const options = [
//   { label: 'Available', value: 1 },
//   { label: 'Sold', value: 2 },
// ];

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

export function PropertyDetailsStep({ form }: PropertyDetailsStepProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form

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
            <Label htmlFor="projectedResaleValue">Projected Resale <span className="text-red-600">*</span></Label>
            <Input
              id="projectedResaleValue"
              type="number"
              {...register("projectedResaleValue", { valueAsNumber: true })}
              placeholder="Enter projected resale value"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedAnnualRent">Expected Annual Rent <span className="text-red-600">*</span></Label>
            <Input
              id="expectedAnnualRent"
              type="number"
              {...register("expectedAnnualRent", { valueAsNumber: true })}
              placeholder="Enter expected annual rent"
            />
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
