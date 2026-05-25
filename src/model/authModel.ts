import bcrypt from 'bcryptjs'
import { UnauthorizedError } from '../lib/appError.js'
import { prisma } from '../lib/prisma.js'

type AuthRequest = {
  email: string
  password: string
}
export async function auth({ email, password }: AuthRequest) {
  const user = await prisma.user.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
  })

  if (!user) {
    throw new UnauthorizedError('Credenciais inválidas')
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    throw new UnauthorizedError('Credenciais inválidas')
  }

  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }

  return payload
}

export async function changePassword({ email, password }: AuthRequest) {
  const userExists = await prisma.user.findUnique({
    where: {
      email: email.trim().toLowerCase(),
    },
  })

  if (!userExists) {
    throw new UnauthorizedError('Usuário inválido')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      password: passwordHash,
    },
    omit: {
      password: true,
    },
  })

  return user
}
