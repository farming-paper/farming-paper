import { z } from "zod";

export const searchParamsSchema = z.object({
  tags: z.string().transform((v) => v.split(",")),
  question_public_id: z.string(),
});
