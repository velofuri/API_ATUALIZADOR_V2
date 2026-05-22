import bcrypt from 'bcryptjs'
import prompts from 'prompts'
import { prisma } from '../lib/prisma.js'

async function createUser() {
  console.log('=================================')
  console.log(' Cadastro usuário')
  console.log(' Senha Padrão: lacteus')
  console.log('=================================')
  const response = await prompts([
    {
      type: 'text',
      name: 'name',
      message: 'Nome do usuário',
    },
    {
      type: 'text',
      name: 'email',
      message: 'E-mail:',
    },
    {
      type: 'select',
      name: 'role',
      message: 'Perfil:',
      choices: [
        { title: 'ADMIN', value: 'ADMIN' },
        { title: 'USER', value: 'USER' },
      ],
    },
  ])

  const existUser = await prisma.user.findUnique({
    where: {
      email: response.email,
    },
  })

  if (existUser) {
    throw new Error('❌ Já existe um usuário com este e-mail.')
  }

  const passwordHash = await bcrypt.hash('lacteus', 10)

  const user = await prisma.user.create({
    data: {
      name: response.name,
      email: response.email,
      role: response.role,
      password: passwordHash,
    },
    omit: {
      password: true,
    },
  })

  console.log('Usuário criado:')
  console.log(user)
}

createUser().catch((error) => {
  console.error('❌', error.message)
  process.exit(1)
})
