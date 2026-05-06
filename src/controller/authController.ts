import type { FastifyReply, FastifyRequest } from 'fastify'
import { AuthSchema } from '../DTO/authDTO.js'
import { UnauthorizedError } from '../lib/appError.js'

export async function authController(request: FastifyRequest, reply: FastifyReply) {
  const { user, password } = AuthSchema.parse(request.body)

  if (user !== 'lacteus' || password !== 'caseus46') {
    throw new UnauthorizedError('Credenciais inválidas')
  }

  const payload = {
    sub: 1, //id do usuário
    role: 'user',
  }

  const token = await reply.jwtSign(payload)

  return reply.send({ token })
}
