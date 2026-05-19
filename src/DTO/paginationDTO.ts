import z from 'zod/v4'

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  acronym: z
    .string()
    .length(3, 'Sigla deve ter exatamente 3 caracteres')
    .transform((val) => val.toLowerCase())
    .optional(),
})

export type PaginationQueryDTO = z.infer<typeof paginationSchema>
