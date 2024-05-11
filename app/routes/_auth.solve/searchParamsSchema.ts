import { z } from "zod";

export const searchParamsSchema = z.object({
  tags: z.string().transform((v) => v.split(",")),
});
