import z from 'zod/v4'

export const AuthSchema = z.object({
  email: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatório'),
})

export type AuthDTO = z.infer<typeof AuthSchema>
