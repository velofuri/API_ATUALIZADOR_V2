import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  createUpdate,
  updateStatusById,
  getAllUpdates,
  getUpdateByAcronym,
  getAllRegisterByAcronym,
} from '../model/clientModel.js'
import { UpdateRequestSchema, AcronymClientSchema, UpdateStatusSchema } from '../DTO/updateRequestDTO.js'
import { NotFoundError } from '../lib/appError.js'

export async function getAllUpdatesController(request: FastifyRequest, reply: FastifyReply) {
  const response = await getAllUpdates()
  return reply.code(200).send(response)
}

export async function getAllRegisterByAcronymController(request: FastifyRequest, reply: FastifyReply) {
  const { acronym } = AcronymClientSchema.parse(request.params)
  const response = await getAllRegisterByAcronym(acronym)
  if (response.length === 0) {
    throw new NotFoundError('Nenhum registro encontrado.')
  }
  return reply.code(200).send(response)
}

export async function getServiceUpdateByAcronymController(request: FastifyRequest, reply: FastifyReply) {
  const { acronym } = AcronymClientSchema.parse(request.params)
  const response = await getUpdateByAcronym(acronym)

  if (response === null) {
    throw new NotFoundError('Registro de atualização não encontrado.')
  }

  await updateStatusById({ id: response.id, status: 'PROCESSANDO' })

  return reply.code(200).send(response)
}

export async function getWebUpdateByAcronymController(request: FastifyRequest, reply: FastifyReply) {
  const { acronym } = AcronymClientSchema.parse(request.params)
  const response = await getUpdateByAcronym(acronym)

  if (response === null) {
    throw new NotFoundError('Registro de atualização não encontrado.')
  }

  return reply.code(200).send(response)
}

export async function createUpdateController(request: FastifyRequest, reply: FastifyReply) {
  const body = UpdateRequestSchema.parse(request.body)
  const response = await createUpdate(body)
  return reply.code(201).send(response)
}

export async function updateStatusByIdController(request: FastifyRequest, reply: FastifyReply) {
  const body = UpdateStatusSchema.parse(request.body)
  const response = await updateStatusById(body)

  return reply.code(200).send({ message: 'Status Atualizado com sucesso' })
}
