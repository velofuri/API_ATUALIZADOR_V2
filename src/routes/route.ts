import type { FastifyInstance } from 'fastify'
import {
  createUpdateController,
  updateStatusByIdController,
  getAllUpdatesController,
  getUpdateByAcronymController,
  getAllRegisterByAcronymController as getAllRecordsByAcronymController,
} from '../controller/updateController.js'
import { downloadFileController, uploadFileController } from '../controller/fileController.js'
import { serviceMiddleware, userMiddleware } from '../middlewares/auth.js'
import { authController } from '../controller/authController.js'

export async function routes(fastify: FastifyInstance) {
  fastify.get('/health', () => {
    return { result: 'API em execução' }
  })

  //Rotas para usuários
  fastify.post('/auth', authController)

  fastify.get('/web/records/:acronym', { preHandler: [userMiddleware] }, getAllRecordsByAcronymController)
  fastify.get('/web/update', { preHandler: [userMiddleware] }, getAllUpdatesController)
  fastify.post('/web/update', { preHandler: [userMiddleware] }, createUpdateController)
  fastify.post('/web/upload/file', { preHandler: [userMiddleware] }, uploadFileController)

  //Rotas para serviço
  fastify.put('/update', { preHandler: [serviceMiddleware] }, updateStatusByIdController)
  fastify.get('/update/:acronym', { preHandler: [serviceMiddleware] }, getUpdateByAcronymController)
  fastify.get('/download/file/:version', { preHandler: [serviceMiddleware] }, downloadFileController)
}
