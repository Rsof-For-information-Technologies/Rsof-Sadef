"use client"

import { useEffect } from "react"
import { Label } from "@/components/shadCn/ui/label"
import { ShadCnNumberInput } from "@/components/shadCn/ui/numberInput"
import { CreatePropertyFormData } from "@/validators/createProperty"
import type { UseFormReturn } from "react-hook-form"
import { Checkbox, Input, Select } from "rizzui"
import { useStaticDataStore } from "@/store/static-data.store"
import { useTranslations } from "next-intl"
interface BasicInfoStepProps {
  form: UseFormReturn<CreatePropertyFormData>
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  const t = useTranslations('PropertyPages.createPropertyPage.createProperty.form')
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form

  const { cities, propertyTypes, unitCategories, fetchStaticData } = useStaticDataStore();

  // Fetch static data on component mount
  useEffect(() => {
    fetchStaticData();
  }, [fetchStaticData]);

  const propertyTypeValue = watch("propertyType");
  const unitCategoryValue = watch("unitCategory");
  const cityValue = watch("city");

  // Convert static data to Select options format
  const propertyTypeOptions = propertyTypes.map(type => ({
    label: type.displayName,
    value: type.value
  }));

  const unitCategoryOptions = unitCategories.map(cat => ({
    label: cat.displayName,
    value: cat.value
  }));

  const cityOptions = cities.map(city => ({
    label: city.displayName,
    value: city.value
  }));

  console.log(watch())

  return (
    <div>
      <div className="mb-4">
        <h3>{t('stepBasicInformation.title')}</h3>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('stepBasicInformation.propertyTitle')} <span className="text-red-600">*</span></Label>
            <Input id="title" {...register("title")} placeholder={t('stepBasicInformation.propertyTitlePlaceholder')} />
            {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">{t('stepBasicInformation.price')} <span className="text-red-600">*</span></Label>
            <Input id="price" type="number" {...register("price", { valueAsNumber: true })} placeholder={t('stepBasicInformation.pricePlaceholder')} />
            {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Select
              label={t('stepBasicInformation.propertyType')}
              options={propertyTypeOptions}
              value={propertyTypeValue ?? undefined}
              onChange={(value) => setValue("propertyType", value ? Number(value) : undefined)}
              getOptionValue={(option) => option.value.toString()}
              displayValue={(selected: number | undefined) =>
                selected !== undefined
                  ? propertyTypeOptions.find(opt => opt.value === selected)?.label || ""
                  : ""
              }
              placeholder={t('stepBasicInformation.propertyTypePlaceholder')}
              searchable={true}
            />
            {errors.propertyType && (
              <p className="text-sm text-red-600">{errors.propertyType.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Select
              label={t('stepBasicInformation.unitCategory')}
              options={unitCategoryOptions}
              value={unitCategoryValue ?? undefined}
              onChange={(value) => setValue("unitCategory", value ? Number(value) : undefined)}
              getOptionValue={(option) => option.value.toString()}
              displayValue={(selected: number | undefined) =>
                selected !== undefined
                  ? unitCategoryOptions.find(opt => opt.value === selected)?.label || ""
                  : ""
              }
              placeholder={t('stepBasicInformation.unitCategoryPlaceholder')}
              searchable={true}
            />
            {errors.unitCategory && (
              <p className="text-sm text-red-600">{errors.unitCategory.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Select
              label={t('stepBasicInformation.city')}
              options={cityOptions}
              value={cityValue ?? undefined}
              onChange={(value) => setValue("city", value ? Number(value) : 0)}
              getOptionValue={(option) => option.value.toString()}
              displayValue={(selected: number | undefined) =>
                selected !== undefined
                  ? cityOptions.find(opt => opt.value === selected)?.label || ""
                  : ""
              }
              placeholder={t('stepBasicInformation.cityPlaceholder')}
              searchable={true}
            />
            {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t('stepBasicInformation.location')} <span className="text-red-600">*</span></Label>
            <Input id="location" {...register("location")} placeholder={t('stepBasicInformation.locationPlaceholder')} />
            {errors.location && <p className="text-sm text-red-600">{errors.location.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="areaSize">{t('stepBasicInformation.areaSize')} <span className="text-red-600">*</span></Label>
            <Input
              id="areaSize"
              min={1}
              type="number"
              {...register("areaSize", {
                valueAsNumber: true,
                setValueAs: v => v === "" ? undefined : parseFloat(v)
              })}
              placeholder={t('stepBasicInformation.areaSizePlaceholder')}
            />
            {errors.areaSize && <p className="text-sm text-red-600">{errors.areaSize.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bedrooms">{t('stepBasicInformation.bedrooms')}</Label>
            <ShadCnNumberInput
              className="px-[14px] py-[8px] border-0"
              id="bedrooms"
              placeholder={t('stepBasicInformation.bedroomsPlaceholder')}
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
            <Label htmlFor="bathrooms">{t('stepBasicInformation.bathrooms')}</Label>
            <ShadCnNumberInput
              className="px-[14px] py-[8px] border-0"
              id="bathrooms"
              placeholder={t('stepBasicInformation.bathroomsPlaceholder')}
              min={0}
              max={10}
              decimalScale={0}
              value={watch("bathrooms") ?? undefined}
              onValueChange={(value) => {
                setValue("bathrooms", value ?? 0, { shouldValidate: true });
              }}
              stepper={1}
              thousandSeparator=""
            />
            {errors.bathrooms && (
              <p className="text-sm text-red-600">{errors.bathrooms.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="unitName">{t('stepBasicInformation.unitName')}</Label>
            <Input id="unitName" {...register("unitName")} placeholder={t('stepBasicInformation.unitNamePlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalFloors">{t('stepBasicInformation.totalFloors')}</Label>
            <ShadCnNumberInput
              className="px-[14px] py-[8px] border-0"
              id="totalFloors"
              placeholder={t('stepBasicInformation.totalFloorsPlaceholder')}
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
              checked={watch("isInvestorOnly") ?? false}
              onChange={(e) => setValue("isInvestorOnly", e.target.checked)}
              label={t('stepBasicInformation.investorOnly')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
