import type { FastifyReply, FastifyRequest } from 'fastify'
import { AuthSchema } from '../DTO/authDTO.js'
import { env } from '../lib/env.js'
import { auth, changePassword } from '../model/authModel.js'
import { UnauthorizedError } from '../lib/appError.js'

export async function loginController(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = AuthSchema.parse(request.body)

  const payload = await auth({ email, password })

  const token = await reply.jwtSign(payload)

  reply.setCookie('access_token', token, {
    path: '/',
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'strict',
    maxAge: 60 * 60 * 1, // 1 hora (em segundos)
  })

  return reply.send({
    user: payload.name,
    mensagem: 'Login realizado com sucesso!',
  })
}

export async function logoutController(request: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie('access_token', { path: '/' })
  return reply.send({ message: 'Logout realizado com sucesso' })
}

export async function meController(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user
  if (!user) {
    throw new UnauthorizedError('Acesso negado')
  }
  return reply.send(user)
}

export async function changePasswordController(request: FastifyRequest, reply: FastifyReply) {
  const { password } = request.body as { password: string }
  const user = request.user as { email?: string }
  if (!user || !user.email) {
    throw new UnauthorizedError('Acesso negado')
  }
  const email = user.email
  const result = await changePassword({ email, password })

  return reply.send({
    data: result,
    mensagem: 'Senha alterada com sucesso.',
  })
}
