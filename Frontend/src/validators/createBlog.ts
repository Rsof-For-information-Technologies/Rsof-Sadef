import { z } from 'zod';

const translationFields = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string({ required_error: "Content is required." })
    .min(1, "Content is required."),
});

export const blogSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  TranslationsJson: z.record(translationFields),
  coverImage: z.any().optional(),
  isPublished: z.boolean({ required_error: "Publish status is required." }),
});

export type BlogForm = z.infer<typeof blogSchema>;
