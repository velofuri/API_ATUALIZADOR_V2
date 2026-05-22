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
      email,
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
    role: user.role,
  }

  return payload
}
