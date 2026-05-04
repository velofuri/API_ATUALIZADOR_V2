import type { FastifyInstance } from 'fastify'
import {
  createUpdateController,
  updateStatusByIdController,
  getAllUpdatesController,
  getUpdateByAcronymController,
  getAllRegisterByAcronymController as getAllRecordsByAcronymController,
} from '../controller/updateController.js'
import { downloadFileController, uploadFileController } from '../controller/fileController.js'
import { authMiddleware } from '../middlewares/auth.js'
import { authController } from '../controller/authController.js'

export async function routes(fastify: FastifyInstance) {
  fastify.get('/health', () => {
    return { result: 'API em execução' }
  })

  fastify.post('/auth', authController)

  fastify.get('/records/:acronym', { preHandler: [authMiddleware] }, getAllRecordsByAcronymController)

  fastify.get('/update', { preHandler: [authMiddleware] }, getAllUpdatesController)
  fastify.get('/update/:acronym', { preHandler: [authMiddleware] }, getUpdateByAcronymController)
  fastify.post('/update', { preHandler: [authMiddleware] }, createUpdateController)
  fastify.put('/update', { preHandler: [authMiddleware] }, updateStatusByIdController)

  fastify.post('/upload/file', { preHandler: [authMiddleware] }, uploadFileController)
  fastify.get('/download/file/:version', { preHandler: [authMiddleware] }, downloadFileController)
}
