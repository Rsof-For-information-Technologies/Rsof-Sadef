
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

export const contactStatuses = [
  { label: "New", value: 0 },
  { label: "InProgress", value: 1 },
  { label: "Contacted", value: 2 },
  { label: "Responded", value: 3 },
  { label: "Scheduled", value: 4 },
  { label: "Completed", value: 5 },
  { label: "Cancelled", value: 6 },
  { label: "Spam", value: 7 },
];

export const leadStatuses = [
  { label: "Pending", value: 0 },
  { label: "Approved", value: 1 },
  { label: "Sold", value: 2 },
  { label: "Rejected", value: 3 },
  { label: "Archived", value: 4 },
];
