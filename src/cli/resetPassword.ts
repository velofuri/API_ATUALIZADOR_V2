import bcrypt from 'bcryptjs'
import prompts from 'prompts'
import { prisma } from '../lib/prisma.js'

async function resetPassword() {
  console.log('=================================')
  console.log(' Reset de senha de usuário')
  console.log(' A nova senha será: lacteus')
  console.log('=================================')
  const response = await prompts([
    {
      type: 'text',
      name: 'email',
      message: 'E-mail:',
    },
  ])

  const existUser = await prisma.usuario.findUnique({
    where: {
      email: response.email,
    },
  })

  if (!existUser) {
    throw new Error('❌ Usuário não encontrado.')
  }

  const passwordHash = await bcrypt.hash('lacteus', 10)

  const user = await prisma.usuario.update({
    where: {
      email: response.email,
    },
    data: {
      senha: passwordHash,
    },
    omit: {
      senha: true,
    },
  })

  console.log('Senha redefinida.')
  console.log(user)
}

resetPassword().catch((error) => {
  console.error('❌', error.message)
  process.exit(1)
})
