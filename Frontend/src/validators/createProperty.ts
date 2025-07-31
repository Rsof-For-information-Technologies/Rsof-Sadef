import { z } from "zod"

// Basic Info Schema
export const basicInfoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  propertyType: z.number().optional(),
  unitCategory: z.number().optional(),
  price: z.number({required_error: "Price must be greater then 0"}).min(1, "Price must be a positive number"),
  city: z.string().min(1, "City is required"),
  location: z.string().min(1, "Location is required"),
  areaSize: z.number({required_error: "Area size must be a positive number"}).min(0, "Area size must be a positive number"),
  bedrooms: z.number().min(0, "Number must be a positive number").optional(),
  bathrooms: z.number().min(0, "Number must be a positive number").optional(),
  totalFloors: z.number().min(0).optional(),
  unitName: z.string().optional(),
  isInvestorOnly: z.boolean().optional(),
})

// Property Details Schema
export const propertyDetailsSchema = z.object({
  description: z.string().min(1, "Description is required").max(2000, "Description must be less than 2000 characters"),
  features: z.array(z.string()).optional(),
  projectedResaleValue: z.number().min(0).optional(),
  expectedAnnualRent: z.number().min(0).optional(),
  warrantyInfo: z.string().optional(),
  expectedDeliveryDate: z.string().optional(),
  status: z.number().optional(),
  expiryDate: z.string().optional(),
})

// Property Media Schema
export const propertyMediaSchema = z.object({
  images: z.array(z.any()).optional(), 
  videos: z.array(z.any()).optional(),
});

// Location Schema
export const locationSchema = z.object({
  latitude: z.number().min(-90).max(900000000).optional(),
  longitude: z.number().min(-180).max(180000000).optional(),
})

// Contact & Publishing Schema
export const contactPublishingSchema = z.object({
  whatsAppNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid WhatsApp number format")
    .optional(),
})

// Complete Property Schema
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
