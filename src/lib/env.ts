import z from 'zod/v4'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3000),
  SECRET_KEY: z.string(),
  NODE_ENV: z.string(),
})

export const env = envSchema.parse(process.env)
