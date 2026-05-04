import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod/v4'
import { AppError } from '../lib/appError.js'

export function setupErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: Error, request: FastifyRequest, reply: FastifyReply) => {
    // Verifica se o erro veio de uma validação do Zod
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: 'Erro de validação.',
        errors: error.issues.map((issue) => ({ path: issue.path, message: issue.message })),
      })
    }

    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message })
    }

    request.log.error({ err: error }, 'Log de Erro')
    return reply.status(500).send({ message: 'Internal server error.' })
  })
}
