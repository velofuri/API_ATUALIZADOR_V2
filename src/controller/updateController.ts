import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  createUpdate,
  updateStatusById,
  getAllUpdates,
  getUpdateByAcronym,
  getAllRegisterByAcronym,
} from '../model/clientModel.js'
import { UpdateRequestSchema, AcronymClientSchema, UpdateStatusSchema } from '../DTO/updateRequestDTO.js'
import { NotFoundError, UnauthorizedError } from '../lib/appError.js'
import { paginationSchema } from '../DTO/paginationDTO.js'

export async function getAllUpdatesController(request: FastifyRequest, reply: FastifyReply) {
  const { page, limit, acronym } = paginationSchema.parse(request.query)
  const response = await getAllUpdates({ page, limit, acronym })
  return reply.code(200).send(response)
}

export async function getUpdateByAcronymController(request: FastifyRequest, reply: FastifyReply) {
  const { acronym } = AcronymClientSchema.parse(request.params)
  const response = await getUpdateByAcronym(acronym)

  if (response === null) {
    throw new NotFoundError('Registro de atualização não encontrado.')
  }

  await updateStatusById({ id: response.id, status: 'PROCESSANDO' })

  return reply.code(200).send(response)
}

export async function createUpdateController(request: FastifyRequest, reply: FastifyReply) {
  const body = UpdateRequestSchema.parse(request.body)

  const user = request.user as { sub?: string }
  if (!user.sub) {
    throw new UnauthorizedError('Usuário não informado')
  }

  const createData = { ...body, createdById: user.sub }
  const response = await createUpdate(createData)
  return reply.code(201).send(response)
}

export async function updateStatusByIdController(request: FastifyRequest, reply: FastifyReply) {
  const body = UpdateStatusSchema.parse(request.body)
  const response = await updateStatusById(body)

  return reply.code(200).send({ message: 'Status Atualizado com sucesso' })
}
