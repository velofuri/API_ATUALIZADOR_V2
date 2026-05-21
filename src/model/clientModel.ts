import path from 'node:path'
import type { UpdateRequestDTO, UpdateStatusDTO } from '../DTO/updateRequestDTO.js'
import { prisma } from '../lib/prisma.js'
import fs from 'node:fs'
import { AppError, BadRequestError, ConflictError, NotFoundError } from '../lib/appError.js'
import type { PaginationQueryDTO } from '../DTO/paginationDTO.js'

export async function getAllUpdates({ page, limit, acronym }: PaginationQueryDTO) {
  const where = acronym
    ? {
        sigla: {
          contains: acronym,
        },
      }
    : {}
  const [data, totalRecords] = await Promise.all([
    prisma.empresaVersaoSistema.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),

    prisma.empresaVersaoSistema.count({
      where,
    }),
  ])

  const totalPages = Math.ceil(totalRecords / limit)

  return {
    data,
    meta: {
      total: totalRecords,
      page,
      limit,
      totalPages,
    },
  }
}

export async function getAllRegisterByAcronym(acronym: string) {
  const response = await prisma.empresaVersaoSistema.findMany({
    where: {
      sigla: acronym,
    },
  })

  return response
}

export async function getUpdateByAcronym(sigla: string) {
  return await prisma.empresaVersaoSistema.findFirst({
    where: {
      sigla,
      status: 'PENDENTE',
    },
  })
}

export async function createUpdate(clienteRequest: UpdateRequestDTO) {
  const fileDir = path.join(process.cwd(), 'files')

  const files = fs.readdirSync(fileDir)

  const versionExistsInFiles = files.some((file) => file.includes(`atualiza_${clienteRequest.versao}.zip`))
  if (!versionExistsInFiles) {
    throw new BadRequestError(
      `Cadastro não efetuado. Versão ${clienteRequest.versao} não consta em nossa base de dados`,
    )
  }

  const existUpdate = await prisma.empresaVersaoSistema.findFirst({
    where: {
      sigla: clienteRequest.sigla,
      status: { in: ['PENDENTE', 'PROCESSANDO'] },
    },
  })

  if (!existUpdate) {
    const response = await prisma.empresaVersaoSistema.create({
      data: {
        sigla: clienteRequest.sigla,
        nome: clienteRequest.nome ?? null,
        versao: clienteRequest.versao,
      },
    })
    return response
  }
  if (existUpdate.status === 'PENDENTE') {
    const response = await prisma.empresaVersaoSistema.update({
      data: {
        sigla: clienteRequest.sigla,
        nome: clienteRequest.nome ?? null,
        versao: clienteRequest.versao,
      },
      where: {
        id: existUpdate.id,
      },
    })
    return response
  }
  if (existUpdate.status === 'PROCESSANDO') {
    throw new ConflictError(`Cadastro não efetuado. Existe uma atualização em andamento`)
  }
}

export async function updateStatusById(request: UpdateStatusDTO) {
  try {
    const response = await prisma.empresaVersaoSistema.update({
      data: {
        status: request.status,
        observacao: request.observacao ?? null,
      },
      where: {
        id: request.id,
      },
    })
    return response
  } catch (error) {
    throw new NotFoundError('Registro não encontrado ERROR: ' + error)
  }
}
