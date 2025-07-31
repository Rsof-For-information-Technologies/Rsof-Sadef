"use client"

import type { UseFormReturn } from "react-hook-form"
import { CreatePropertyFormData } from "@/validators/createProperty"
import { Label } from "@/components/shadCn/ui/label"
import { Checkbox, Input, Select } from "rizzui"
import { ShadCnNumberInput } from "@/components/shadCn/ui/numberInput"

interface BasicInfoStepProps {
  form: UseFormReturn<CreatePropertyFormData>
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

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form

  const propertyTypeValue = watch("propertyType");
  const unitCategoryValue = watch("unitCategory");

  return (
    <div>
      <div className="mb-4">
        <h3>Basic Information</h3>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Property Title <span className="text-red-600">*</span></Label>
            <Input id="title" {...register("title")} placeholder="Enter property title" />
            {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Prices <span className="text-red-600">*</span></Label>
            <Input id="price" type="number" {...register("price", { valueAsNumber: true })} placeholder="Enter price" />
            {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Select
              label="Property Type"
              options={propertyOptions}
              value={propertyTypeValue ?? undefined}
              onChange={(value) => setValue("propertyType", value ? Number(value) : undefined)}
              getOptionValue={(option) => option.value.toString()}
              displayValue={(selected: number | undefined) =>
                selected !== undefined
                  ? propertyOptions.find(opt => opt.value === selected)?.label || ""
                  : ""
              }
              placeholder="Select property type"
            />
            {errors.propertyType && (
              <p className="text-sm text-red-600">{errors.propertyType.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Select
              label="Unit Category"
              options={unitsOptions}
              value={unitCategoryValue ?? undefined}
              onChange={(value) => setValue("unitCategory", value ? Number(value) : undefined)}
              getOptionValue={(option) => option.value.toString()}
              displayValue={(selected: number | undefined) =>
                selected !== undefined
                  ? unitsOptions.find(opt => opt.value === selected)?.label || ""
                  : ""
              }
              placeholder="Select unit category"
            />
            {errors.unitCategory && (
              <p className="text-sm text-red-600">{errors.unitCategory.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City <span className="text-red-600">*</span></Label>
            <Input id="city" {...register("city")} placeholder="Enter city" />
            {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location <span className="text-red-600">*</span></Label>
            <Input id="location" {...register("location")} placeholder="Enter location/address" />
            {errors.location && <p className="text-sm text-red-600">{errors.location.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="areaSize">Area Size (sq ft) <span className="text-red-600">*</span></Label>
            <Input id="areaSize" min={0} type="number" {...register("areaSize", { valueAsNumber: true })} placeholder="Enter area size" />
            {errors.areaSize && <p className="text-sm text-red-600">{errors.areaSize.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <ShadCnNumberInput
              className="px-[14px] py-[8px] border-0"
              id="bedrooms"
              placeholder="Number of bedrooms"
              min={0}
              max={10}
              decimalScale={0}
              value={watch("bedrooms")}
              onValueChange={(value) => {
                setValue("bedrooms", value || 0, { shouldValidate: true });
              }}
              stepper={1}
            />
            {errors.bedrooms && (
              <p className="text-sm text-red-600">{errors.bedrooms.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <ShadCnNumberInput
              className="px-[14px] py-[8px] border-0"
              id="bathrooms"
              placeholder="Number of bathrooms"
              min={0}
              max={10}
              decimalScale={1}
              value={watch("bathrooms")}
              onValueChange={(value) => {
                setValue("bathrooms", value || 0, { shouldValidate: true });
              }}
              stepper={0.5}
              thousandSeparator=""
            />
            {errors.bathrooms && (
              <p className="text-sm text-red-600">{errors.bathrooms.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="unitName">Unit Name</Label>
            <Input id="unitName" {...register("unitName")} placeholder="Enter unit name (optional)" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalFloors">Total Floors</Label>
            <Input id="totalFloors" type="number" {...register("totalFloors", { valueAsNumber: true })} placeholder="Total Floors" />
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Checkbox
              checked={watch("isInvestorOnly")}
              label="Investor Only Property"
              onChange={(checked) => setValue("isInvestorOnly", checked as unknown as boolean)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
