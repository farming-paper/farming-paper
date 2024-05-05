import { z } from "zod";

export const searchParamsSchema = z.object({
  tags: z.string(),
  question_public_id: z.string(),
});
