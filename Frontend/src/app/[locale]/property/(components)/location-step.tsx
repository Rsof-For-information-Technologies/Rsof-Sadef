"use client"

import type { UseFormReturn } from "react-hook-form"
import { MapPin } from "lucide-react"
import { CreatePropertyFormData } from "@/validators/createProperty"
import { Label } from "@/components/shadCn/ui/label"
import { Button, Input } from "rizzui"
import InteractiveMap from "@/components/ui/InteractiveMap"
import { useTranslations } from "next-intl"
interface LocationStepProps {
  form: UseFormReturn<CreatePropertyFormData>
}

export function LocationStep({ form }: LocationStepProps) {
  const t = useTranslations('PropertyPages.createPropertyPage.createProperty.form.stepLocation')
  const {
    register,
    getValues,
    formState: { errors },
    setValue,
    watch,
  } = form

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("latitude", position.coords.latitude)
          setValue("longitude", position.coords.longitude)
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h3>{t('title')}</h3>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">{t('latitude')}</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              {...register("latitude", { valueAsNumber: true })}
              placeholder={t('latitudePlaceholder')}
            />
            {errors.latitude && <p className="text-sm text-red-600">{errors.latitude.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">{t('longitude')}</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              {...register("longitude", { valueAsNumber: true })}
              placeholder={t('longitudePlaceholder')}
            />
            {errors.longitude && <p className="text-sm text-red-600">{errors.longitude.message}</p>}
          </div>
        </div>

        <div className="flex justify-center">
          <Button type="button" variant="outline" onClick={getCurrentLocation} className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {t('getLocation')}
          </Button>
        </div>

        {watch("latitude") && watch("longitude") && (
          <div className="space-y-2">
            <Label>{t('mapPreview')}</Label>
            <p className="text-sm">
              {t('coordinates')}: {watch("latitude")?.toFixed(6)}, {watch("longitude")?.toFixed(6)}
            </p>
            <InteractiveMap longitude={getValues("longitude") as number}  latitute={getValues("latitude") as number} />
          </div>
        )}
      </div>
    </div>
  )
}
