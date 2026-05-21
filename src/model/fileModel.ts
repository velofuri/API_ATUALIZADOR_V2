import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import type { MultipartFile } from '@fastify/multipart'
import { BadRequestError, NotFoundError } from '../lib/appError.js'
import { readdir } from 'node:fs/promises'

export async function uploadFileModel(file: MultipartFile): Promise<void> {
  const { filename, mimetype } = file

  const mimetypesValidos = ['application/zip', 'application/x-zip-compressed', 'application/octet-stream']

  const extensaoValida = path.extname(filename).toLowerCase() === '.zip'
  const mimetypeValido = mimetypesValidos.includes(mimetype)

  if (!extensaoValida || !mimetypeValido) {
    throw new BadRequestError('O arquivo precisa ser .zip')
  }

  const uploadDir = path.join(process.cwd(), 'files')

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
  }

  const destPath = path.join(uploadDir, filename)

  try {
    await pipeline(file.file, fs.createWriteStream(destPath))
    return
  } catch {
    throw new BadRequestError('Falha no envio do arquivo')
  }
}

export async function downloadFileModel(version: string) {
  const filePath = path.join(process.cwd(), 'files', `atualiza_${version}.zip`)

  if (!fs.existsSync(filePath)) {
    throw new NotFoundError('Arquivo não encontrado')
  }
  const stream = fs.createReadStream(filePath)

  return stream
}

export async function getFileList() {
  const pathDir = path.join(process.cwd(), 'files')
  const itens = await readdir(pathDir)
  const filteredFiles = itens
    .filter((file) => file.startsWith('atualiza_'))
    .map((file) => file.replace(/^atualiza_/, '').replace(/\.zip$/i, ''))
  return filteredFiles
}
