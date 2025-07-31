import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string({ required_error: "Title is required." }).min(1, "Title is required."),
  content: z.string({ required_error: "Content is required." }).min(1, "Content is required."),
  coverImage: z.any().optional(),
  isPublished: z.boolean({ required_error: "Publish status is required." }),
});

export type BlogForm = z.infer<typeof blogSchema>