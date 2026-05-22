import { StatusProcesso } from '@prisma/client'
import z, { string } from 'zod/v4'

export const UpdateRequestSchema = z.object({
  acronym: z
    .string()
    .length(3, 'Sigla deve ter exatamente 3 caracteres')
    .transform((val) => val.toLowerCase()),
  name: z.string().optional(),
  version: z.string('versão deve ser uma string').length(10, 'Informe a versão com 10 caracteres incluindo os pontos'),
})

export const UpdateCreateSchema = z.object({
  acronym: z
    .string()
    .length(3, 'Sigla deve ter exatamente 3 caracteres')
    .transform((val) => val.toLowerCase()),
  name: z.string().optional(),
  version: z.string('versão deve ser uma string').length(10, 'Informe a versão com 10 caracteres incluindo os pontos'),
  createdById: z.string(),
})

export const AcronymClientSchema = z.object({
  acronym: z
    .string()
    .length(3, 'Sigla deve ter exatamente 3 caracteres')
    .transform((val) => val.toLowerCase()),
})

export const UpdateStatusSchema = z.object({
  id: string(),
  status: z.nativeEnum(StatusProcesso),
  note: z.string().optional(),
})

export type UpdateRequestDTO = z.infer<typeof UpdateRequestSchema>

export type AcronymClientDTO = z.infer<typeof AcronymClientSchema>

export type UpdateStatusDTO = z.infer<typeof UpdateStatusSchema>

export type UpdateCreateDTO = z.infer<typeof UpdateCreateSchema>
