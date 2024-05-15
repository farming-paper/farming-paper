import { z } from "zod";

export const searchParamsSchema = z.object({
  code: z.union([
    z.literal("uJpMC1njtBiiDYw52o0RKehbxLmgT4th"), // ping
    z.literal("zrkBmmfYHRac1YGGcgi4OndKugXOxLAz"), // insert all to mongo
  ]),
});
