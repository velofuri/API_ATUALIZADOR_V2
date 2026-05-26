import type { FastifyReply, FastifyRequest } from 'fastify'
import { uploadFileModel, downloadFileModel, getFileList } from '../model/fileModel.js'
import { AppError, BadRequestError, NotFoundError } from '../lib/appError.js'

export async function uploadFileController(request: FastifyRequest, reply: FastifyReply) {
  const file = await request.file()

  if (!file) {
    throw new BadRequestError('Nenhum arquivo válido foi enviado')
  }
  console.log('FiledName................. ', file.fieldname)
  console.log('MimeType................. ', file.mimetype)
  // if (file.fieldname !== 'arquivo') {
  //   throw new BadRequestError('Campo inválido')
  // }

  try {
    await uploadFileModel(file)
    reply.code(200).send({ message: 'Arquivo enviado com sucesso!' })
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    request.log.error({ err: error }, 'Erro inesperado no upload')
    throw new BadRequestError('Falha no envio do arquivo')
  }
}

export async function downloadFileController(request: FastifyRequest, reply: FastifyReply) {
  const { version } = request.params as { version: string }

  try {
    const stream = await downloadFileModel(version)

    const fileName = `atualiza_${version.toLowerCase()}.zip`

    reply.header('Content-Disposition', `attachment; filename="${fileName}"`)
    reply.header('content-type', 'application/zip')

    return reply.send(stream)
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    request.log.error({ err: error }, 'Erro inesperado no download')
    throw new BadRequestError('Erro ao baixar arquivo')
  }
}

export async function getFileListController(request: FastifyRequest, reply: FastifyReply) {
  const response = await getFileList()
  return reply.code(200).send(response)
}
