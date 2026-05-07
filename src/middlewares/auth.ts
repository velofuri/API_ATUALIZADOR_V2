import type { FastifyReply, FastifyRequest } from 'fastify'
import { UnauthorizedError } from '../lib/appError.js'

export async function userMiddleware(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify()
  const user = request.user as { role?: string }
  if (!user || user.role !== 'user') {
    throw new UnauthorizedError('Acesso negado para serviços')
  }
}

export async function serviceMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as { role?: string }
  if (!user || user.role !== 'service') {
    throw new UnauthorizedError('Acesso negado para usuários')
  }
}
