import { z } from "zod";

export const searchParamsSchema = z.object({
  incorrects: z
    .string()
    .transform((v) => JSON.parse(v) as unknown[])
    .pipe(
      z.array(
        z.object({
          pathStr: z.string(),
          expect: z.string(),
          actual: z.string(),
        })
      )
    ),
  tags: z.string(),
  question_id: z.coerce.bigint(),
  log_id: z.coerce.bigint(),
});
