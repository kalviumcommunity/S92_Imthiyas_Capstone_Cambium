import { z } from "zod";

export const opportunitySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  type: z.enum(["Grant", "CFP", "Journal", "Paper"], {
    errorMap: () => ({ message: "Select a valid opportunity type" }),
  }),
  organization: z.string().min(2, "Organization name is required"),
  deadline: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tags: z.string().optional(),
});

export type OpportunityFormValues = z.infer<typeof opportunitySchema>;
