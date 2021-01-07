import Fastify from 'fastify'
import EnvSchema from 'env-schema'
import fastifyHelmet from 'fastify-helmet'
import FastifyOAS from 'fastify-oas'
import fastifySensible from 'fastify-sensible'
import fastifyAutoload from 'fastify-autoload'
import fastifyMongodb from 'fastify-mongodb'
import fastifyAuth from 'fastify-auth'
import fastifyCors from 'fastify-cors'
import pinoColada from 'pino-colada'
import { join } from 'path'

const fastify = Fastify({
  logger: {
    prettyPrint: true,
    prettifier: pinoColada
  } as any
})

const config: {
  HOST?: string;
  PORT?: string;
  JWT_SECRET?: string;
  MONGO_URL?: string;
  MONGO_DB?: string;
} = (() => {
  try {
    const schema = {
      type: 'object',
      properties: {
        PORT: { type: 'number', default: 8080 },
        HOST: { type: 'string', default: '127.0.0.1' },
        JWT_SECRET: { type: 'string' },
        MONGO_URL: { type: 'string' },
        MONGO_DB: { type: 'string' }
      },
      required: ['PORT', 'HOST', 'JWT_SECRET', 'MONGO_URL', 'MONGO_DB']

    }
    return EnvSchema({
      schema: schema,
      dotenv: true
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})()

fastify.register(FastifyOAS, {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Fast-Api-V2',
      description: 'Documentação da api',
      version: '0.1.0'
    },
    consumes: ['application/json'],
    produces: ['application/json']
  },
  exposeRoute: true
})
fastify.register(fastifyCors)
fastify.register(fastifyHelmet)
fastify.register(fastifyAuth)
fastify.register(fastifySensible)
fastify.register(fastifyMongodb, {
  url: config.MONGO_URL,
  database: config.MONGO_DB
})
fastify.register(fastifyAutoload, {
  dir: join(__dirname, 'plugins')
})
fastify.register(fastifyAutoload, {
  dir: join(__dirname, 'services')
})

const start = async () => {
  try {
    await fastify.listen(config.PORT, config.HOST)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
