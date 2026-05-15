import type { FastifyReply, FastifyRequest } from 'fastify'
import { AuthSchema } from '../DTO/authDTO.js'
import { UnauthorizedError } from '../lib/appError.js'
import { env } from '../lib/env.js'

export async function loginController(request: FastifyRequest, reply: FastifyReply) {
  const { user, password } = AuthSchema.parse(request.body)

  if (user !== 'lacteus' || password !== 'caseus46') {
    throw new UnauthorizedError('Credenciais inválidas')
  }

  const payload = {
    sub: 1, //id do usuário
    role: 'user',
  }

  const token = await reply.jwtSign(payload)

  reply.setCookie('access_token', token, {
    path: '/',
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1, // 1 hora (em segundos)
  })

  return reply.send({
    mensagem: 'Login realizado com sucesso!',
  })
}

export async function logoutController(request: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie('access_token', { path: '/' })
  return reply.send({ message: 'Logout realizado com sucesso' })
}
