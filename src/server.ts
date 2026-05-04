import Fastify from 'fastify'
import { routes } from './routes/route.js'
import { env } from './lib/env.js'
import { fastifyMultipart } from '@fastify/multipart'
import { fastifyJwt } from '@fastify/jwt'
import { setupErrorHandler } from './middlewares/errorHandler.js'

const app = Fastify({ logger: true })

app.register(fastifyJwt, { secret: env.SECRET_KEY, sign: { expiresIn: '1h' } })

app.register(fastifyMultipart, { limits: { fileSize: 100 * 1024 * 1024 } })

setupErrorHandler(app)

app.register(routes)

app.listen({ port: env.PORT, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
