import type { FastifyReply, FastifyRequest } from 'fastify'
import { UnauthorizedError } from '../lib/appError.js'

export async function userMiddleware(request: FastifyRequest, reply: FastifyReply) {
  if (!request.cookies.access_token) {
    throw new UnauthorizedError('Acesso negado. Cookie não encontrado.')
  }
  await request.jwtVerify()
  const user = request.user as { role?: string }
  if (!user || user.role === 'Service') {
    throw new UnauthorizedError('Acesso negado para serviços')
  }
}

export async function serviceMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token de serviço ausente ou mal formatado no Header.')
  }
  await request.jwtVerify()
  const user = request.user as { role?: string }
  if (!user || user.role !== 'Service') {
    throw new UnauthorizedError('Acesso negado para usuários')
  }
}
