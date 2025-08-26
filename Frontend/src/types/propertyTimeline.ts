export interface PropertyTimelineItem {
  id: number;
  propertyId: number;
  status: string;
  actionTaken: string;
  actionTakenBy: string;
  timestamp: string;
}

export interface PropertyTimelineResponse {
  succeeded: boolean;
  message: string;
  validationResultModel: null;
  data: PropertyTimelineItem[];
} 