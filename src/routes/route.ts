import type { FastifyInstance } from 'fastify'
import {
  createUpdateController,
  updateStatusByIdController,
  getAllUpdatesController,
  getUpdateByAcronymController,
} from '../controller/updateController.js'
import { downloadFileController, getFileListController, uploadFileController } from '../controller/fileController.js'
import { serviceMiddleware, userMiddleware } from '../middlewares/auth.js'
import {
  changePasswordController,
  loginController,
  logoutController,
  meController,
} from '../controller/authController.js'

export async function routes(fastify: FastifyInstance) {
  fastify.get('/health', () => {
    return { result: 'API em execução' }
  })

  //Rotas para autenticação
  fastify.post('/auth', loginController)
  fastify.post('/logout', logoutController)
  fastify.post('/auth/changepass', { preHandler: [userMiddleware] }, changePasswordController)
  fastify.get('/me', { preHandler: [userMiddleware] }, meController)

  //Rotas para usuários
  fastify.get('/update', { preHandler: [userMiddleware] }, getAllUpdatesController)
  fastify.post('/update', { preHandler: [userMiddleware] }, createUpdateController)
  fastify.post('/upload/file', { preHandler: [userMiddleware] }, uploadFileController)
  fastify.get('/files', { preHandler: [userMiddleware] }, getFileListController)

  //Rotas para serviço
  fastify.put('/update', { preHandler: [serviceMiddleware] }, updateStatusByIdController)
  fastify.get('/update/:acronym', { preHandler: [serviceMiddleware] }, getUpdateByAcronymController)
  fastify.get('/download/file/:version', { preHandler: [serviceMiddleware] }, downloadFileController)
}
