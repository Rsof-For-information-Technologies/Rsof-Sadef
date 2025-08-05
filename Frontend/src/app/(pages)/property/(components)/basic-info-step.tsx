"use client"

import { Label } from "@/components/shadCn/ui/label"
import { ShadCnNumberInput } from "@/components/shadCn/ui/numberInput"
import { propertyOptions, unitsOptions } from "@/constants/constants"
import { CreatePropertyFormData } from "@/validators/createProperty"
import type { UseFormReturn } from "react-hook-form"
import { Checkbox, Input, Select } from "rizzui"

interface BasicInfoStepProps {
  form: UseFormReturn<CreatePropertyFormData>
}

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
            <Input
              id="areaSize"
              min={1}
              type="number"
              {...register("areaSize", {
                valueAsNumber: true,
                setValueAs: v => v === "" ? undefined : parseFloat(v)
              })}
              placeholder="Enter area size"
            />
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
              value={watch("bedrooms") ?? undefined}
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
              value={watch("bathrooms") ?? undefined}
              onValueChange={(value) => {
                setValue("bathrooms", value ?? 0, { shouldValidate: true });
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
            <ShadCnNumberInput
              className="px-[14px] py-[8px] border-0"
              id="totalFloors"
              placeholder="Total Floors"
              min={1}
              decimalScale={0}
              value={watch("totalFloors") ?? undefined}
              onValueChange={(value) => {
                setValue("totalFloors", value ?? undefined, { shouldValidate: true });
              }}
              stepper={1}
            />
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Checkbox
              id="isInvestorOnly"
              {...register("isInvestorOnly")}
              checked={watch("isInvestorOnly") || false}
              label="Investor Only Property"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
