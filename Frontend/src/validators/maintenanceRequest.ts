import { z } from 'zod';

export const maintenanceRequestSchema = z.object({
  id: z.string({ required_error: "ID is required for updates" }),
  leadId: z.string({ required_error: "lead Id is required." }).min(1, "lead Id is required."),
  description: z.string({ required_error: "description is required." }).min(1, "description is required."),
  images: z.array(z.instanceof(File)).optional(), // <-- Accept array of File
  video: z.array(z.instanceof(File)).optional(), // <-- Accept array of File
});

export type MaintenanceRequestForm = z.infer<typeof maintenanceRequestSchema>;
