import { z } from "zod"

export const basicInfoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  propertyType: z.number().optional(),
  unitCategory: z.number().optional(),
  price: z.number({ required_error: "Price must be greater then 0" }).min(1, "Price must be a positive number"),
  city: z.string().min(2, "City is required").max(100, "City must be less than 100 characters"),
  location: z.string().min(1, "Location is required"),
  areaSize: z.number({ required_error: "Area size must be a positive number" }).min(1, "Area size must be a positive number"),
  bedrooms: z.number().nullable().optional(),
  bathrooms: z.number().nullable().optional(),
  totalFloors: z.number().nullable().optional(),
  unitName: z.string().optional(),
  isInvestorOnly: z.boolean().default(false)
})

export const propertyDetailsSchema = z.object({
  description: z.string().min(10, "Description is required").max(2000, "Description must be less than 2000 characters"),
  features: z.array(z.string()).optional(),
  projectedResaleValue: z.number().min(1, "Projected resale value must be at least 1").optional(),
  expectedAnnualRent: z.number().min(1, "Expected annual rent must be at least 1").optional(),
  warrantyInfo: z.string().optional(),
  expectedDeliveryDate: z.string().optional(),
  status: z.number().optional(),
  expiryDate: z.string().optional(),
})

export const propertyMediaSchema = z.object({
  images: z.array(
    z.instanceof(File).refine(
      (file) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
        const maxSize = 1 * 1024 * 1024;
        return validTypes.includes(file.type) && file.size <= maxSize;
      },
      {
        message: 'Image must be JPG, JPEG, PNG, or HEIC format and less than 1MB',
      }
    )
  ).max(10, "Maximum 10 images allowed").optional(),
  videos: z.array(
    z.instanceof(File).refine(
      (file) => {
        const validTypes = ['video/mp4', 'video/quicktime', 'video/mov'];
        const maxSize = 50 * 1024 * 1024;
        return validTypes.includes(file.type) && file.size <= maxSize;
      },
      {
        message: 'Video must be MP4, MOV, or QuickTime format and less than 50MB',
      }
    )
  ).max(3, "Maximum 3 videos allowed").optional(),
});

export const locationSchema = z.object({
  latitude: z.number()
    .min(-90, "Latitude must be between -90 and 90 degrees")
    .max(90, "Latitude must be between -90 and 90 degrees")
    .optional(),
  longitude: z.number()
    .min(-180, "Longitude must be between -180 and 180 degrees")
    .max(180, "Longitude must be between -180 and 180 degrees")
    .optional(),
})

export const contactPublishingSchema = z.object({
  whatsAppNumber: z
    .string({ required_error: "Mobile number is required." })
    .length(10, "Mobile number must be exactly 10 digits long.")
    .refine((num) => num.startsWith("05"), {
      message: "Mobile number must start with '05'.",
    })
    .refine((num) => /^\d+$/.test(num), {
      message: "Mobile number must contain only digits.",
    })
    .optional(),
})

export const createPropertySchema = basicInfoSchema
  .merge(propertyDetailsSchema)
  .merge(propertyMediaSchema)
  .merge(locationSchema)
  .merge(contactPublishingSchema)

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>
export type PropertyDetailsFormData = z.infer<typeof propertyDetailsSchema>
export type PropertyMediaFormData = z.infer<typeof propertyMediaSchema>
export type LocationFormData = z.infer<typeof locationSchema>
export type ContactPublishingFormData = z.infer<typeof contactPublishingSchema>
export type CreatePropertyFormData = z.infer<typeof createPropertySchema>
