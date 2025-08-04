
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

export const propertyOptions = [
  { label: "Apartment", value: 0 },
  { label: "Villa", value: 1 },
  { label: "House", value: 2 },
  { label: "Office", value: 3 },
  { label: "Shop", value: 4 },
  { label: "Plot", value: 5 },
  { label: "Warehouse", value: 6 },
  { label: "Building", value: 7 },
  { label: "Farmhouse", value: 8 },
  { label: "Penthouse", value: 9 },
  { label: "Studio", value: 10 },
  { label: "Commercial", value: 11 },
  { label: "Industrial", value: 12 },
  { label: "MixedUse", value: 13 },
  { label: "Hotel", value: 14 },
  { label: "Mall", value: 15 },
];

export const propertyStatuses = [
  { label: "Pending", value: 0 },
  { label: "Approved", value: 1 },
  { label: "Sold", value: 2 },
  { label: "Rejected", value: 3 },
  { label: "Archived", value: 4 },
];

export const unitsOptions = [
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

export const featuresOptions = [
  { label: "AirConditioning", value: "0" },
  { label: "Balcony", value: "1" },
  { label: "BuiltInWardrobes", value: "2" },
  { label: "CentralHeating", value: "3" },
  { label: "CoveredParking", value: "4" },
  { label: "Elevator", value: "5" },
  { label: "Garden", value: "6" },
  { label: "FitnessCenter", value: "7" },
  { label: "MaidsRoom", value: "8" },
  { label: "PetsAllowed", value: "9" },
  { label: "PrivateGarage", value: "10" },
  { label: "PrivatePool", value: "11" },
  { label: "SecuritySystem", value: "12" },
  { label: "SharedPool", value: "13" },
  { label: "SmartHomeSystem", value: "14" },
  { label: "StorageRoom", value: "15" },
  { label: "StudyOrOffice", value: "16" },
  { label: "ViewofLandmark", value: "17" },
  { label: "ViewofWater", value: "18" },
  { label: "WalkinCloset", value: "19" },
  { label: "WheelchairAccess", value: "20" },
  { label: "ChildrenPlayArea", value: "21" },
  { label: "BarbecueArea", value: "22" },
  { label: "LaundryRoom", value: "23" },
  { label: "HighFloor", value: "24" },
  { label: "LowFloor", value: "25" },
  { label: "NearPublicTransport", value: "26" },
  { label: "NearSchool", value: "27" },
  { label: "NearSupermarket", value: "28" },
  { label: "ConciergeService", value: "29" },
  { label: "InternetOrWiFiReady", value: "30" },
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
