import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    GITHUB_ID: z.string(),
    GITHUB_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string().url(),
    GOODLE_CLIENT_SECRET: z.string(),
    EMAIL_SERVER: z.string(),
    EMAIL_FROM: z.string().url(),
  },
  client: {},
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {},
});
