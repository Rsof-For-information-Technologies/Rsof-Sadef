
import { BasicInfoStep } from "@/app/(pages)/property/(components)/basic-info-step";
import { ContactPublishingStep } from "@/app/(pages)/property/(components)/contact-publishing-step";
import { LocationStep } from "@/app/(pages)/property/(components)/location-step";
import { PropertyDetailsStep } from "@/app/(pages)/property/(components)/property-details-step";
import { PropertyMediaStep } from "@/app/(pages)/property/(components)/property-media-step";
import { propertyDetailsSchema, propertyMediaSchema, locationSchema, contactPublishingSchema, basicInfoSchema, } from "@/validators/createProperty";

export const STEPS = [
  { title: "Basic Info", component: BasicInfoStep, schema: basicInfoSchema },
  { title: "Property Details", component: PropertyDetailsStep, schema: propertyDetailsSchema },
  { title: "Property Media", component: PropertyMediaStep, schema: propertyMediaSchema },
  { title: "Location / Map", component: LocationStep, schema: locationSchema },
  { title: "Contact & Publishing", component: ContactPublishingStep, schema: contactPublishingSchema },
] as const;

export const propertyStatuses = [
  { label: "Pending", value: 0 },
  { label: "Approved", value: 1 },
  { label: "Sold", value: 2 },
  { label: "Rejected", value: 3 },
  { label: "Archived", value: 4 },
];

export const propertyStatusesFilters = [
  { label: 'All', value: '' },
  { label: 'Pending', value: '0' },
  { label: 'Approved', value: '1' },
  { label: 'Sold', value: '2' },
  { label: 'Rejected', value: '3' },
  { label: 'Archived', value: '4' },
];

export const propertyTypesFilters  = [
  { label: 'All', value: '' },
  { label: 'Apartment', value: '0' },
  { label: 'Villa', value: '1' },
  { label: 'House', value: '2' },
  { label: 'Office', value: '3' },
  { label: 'Shop', value: '4' },
  { label: 'Plot', value: '5' },
  { label: 'Warehouse', value: '6' },
  { label: 'Building', value: '7' },
  { label: 'Farmhouse', value: '8' },
  { label: 'Penthouse', value: '9' },
  { label: 'Studio', value: '10' },
  { label: 'Commercial', value: '11' },
  { label: 'Industrial', value: '12' },
  { label: 'MixedUse', value: '13' },
  { label: 'Hotel', value: '14' },
  { label: 'Mall', value: '15' },
];
