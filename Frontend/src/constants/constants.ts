
import { ContactPublishingStep } from "@/app/[locale]/property/(components)/contact-publishing-step";
import { LocationStep } from "@/app/[locale]/property/(components)/location-step";
import { PropertyDetailsStep } from "@/app/[locale]/property/(components)/property-details-step";
import { PropertyMediaStep } from "@/app/[locale]/property/(components)/property-media-step";
import { BasicInfoStep } from "@/app/[locale]/property/(components)/basic-info-step";
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
  { label: "New", value: "New" },
  { label: "In Progress", value: "InProgress" },
  { label: "Contacted", value: "Contacted" },
  { label: "Responded", value: "Responded" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Spam", value: "Spam" },
];

export const leadStatuses = [
  { label: "New", value: "New" },
  { label: "Contacted", value: "Contacted" },
  { label: "In Discussion", value: "InDiscussion" },
  { label: "Visit Scheduled", value: "VisitScheduled" },
  { label: "Converted", value: "Converted" },
  { label: "Rejected", value: "Rejected" },
];

export const maintenanceRequestStatuses = [
  { label: 'Pending', value: 'Pending' },
  { label: 'In Progress', value: 'InProgress' },
  { label: 'Resolved', value: 'Resolved' },
  { label: 'Rejected', value: 'Rejected' },
];