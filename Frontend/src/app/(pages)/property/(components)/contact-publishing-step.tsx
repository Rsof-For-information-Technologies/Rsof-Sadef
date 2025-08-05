import type { UseFormReturn } from "react-hook-form"
import { Phone } from "lucide-react"
import { CreatePropertyFormData } from "@/validators/createProperty"
import { Label } from "@/components/shadCn/ui/label"
import { Input } from "rizzui"

interface ContactPublishingStepProps {
  form: UseFormReturn<CreatePropertyFormData>
}

export function ContactPublishingStep({ form }: ContactPublishingStepProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = form

  return (
    <div>
      <div className="mb-4">
        <h3>Contact & Publishing</h3>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="whatsAppNumber">WhatsApp Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input id="whatsAppNumber" {...register("whatsAppNumber")} placeholder="0511223344" className="pl-10" />
          </div>
          {errors.whatsAppNumber && <p className="text-sm text-red-600">{errors.whatsAppNumber.message}</p>}
          <p className="text-sm text-gray-500">Include country code (e.g., 05 for SA)</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-3">Property Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Title:</span>
              <span>{watch("title") || "Not specified"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span>{watch("price") ? `$${watch("price")?.toLocaleString()}` : "Not specified"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span>
                {watch("city") && watch("location") ? `${watch("location")}, ${watch("city")}` : "Not specified"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Area Size:</span>
              <span>{watch("areaSize") ? `${watch("areaSize")} sq ft` : "Not specified"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bedrooms:</span>
              <span>{watch("bedrooms") || "Not specified"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bathrooms:</span>
              <span>{watch("bathrooms") || "Not specified"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Images:</span>
              <span>{watch("images")?.length || 0} uploaded</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Videos:</span>
              <span>{watch("videos")?.length || 0} uploaded</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
