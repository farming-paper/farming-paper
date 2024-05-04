import { z } from "zod";

export const searchParamsSchema = z.object({
  page: z.coerce.number().gte(1).default(1),
  tags: z
    .string()
    .optional()
    .transform((v) => v?.split(",")),
});
