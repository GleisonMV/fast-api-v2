import { compare, hash } from 'bcrypt'
import { FastifyInstance } from 'fastify'
import { v4 as uuidv4 } from 'uuid'

const messages = [
  'Falha no login; ID de usuário ou senha inválida.',
  'Erro ao registrar',
  'Um link para ativar sua conta foi enviado para o endereço fornecido.'
]

export default async function (fastify: FastifyInstance) {
  fastify.post<{
    Body: {
      email: string;
      password: string;
    }
  }>('/login', {
    schema: {
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8, maxLength: 64 }
        },
        required: ['email', 'password'],
        additionalProperties: false
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            token: { type: 'string' }
          },
          required: ['token', 'success'],
          additionalProperties: false
        },
        '4xx': { $ref: 'error#' }
      }
    }
  }, async function (this: FastifyInstance, request, reply) {
    const { email, password } = request.body
    try {
      const user = await this.model.user.findUser(email)
      if (user == null) {
        return reply.unauthorized(messages[0])
      }
      const isValidPassword = await compare(password, user.password)
      if (isValidPassword) {
        const payload = {
          jit: uuidv4(),
          sub: user._id,
          role: user.role
        }
        const token = await reply.jwtSign(payload, {
          expiresIn: '1h'
        })
        return reply.send({ success: true, token })
      }
      return reply.unauthorized(messages[0])
    } catch (e) {
      return reply.unauthorized(messages[0])
    }
  })

  fastify.post<{
    Body: {
      name: string;
      email: string;
      password: string;
    }
  }>('/register', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 3, maxLength: 120 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8, maxLength: 64 }
        },
        required: ['name', 'email', 'password'],
        additionalProperties: false
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          },
          required: ['success', 'message'],
          additionalProperties: false
        },
        '4xx': { $ref: 'error#' }
      }
    }
  }, async function (request, reply) {
    const { name, email, password } = request.body
    try {
      const hashPassword = await hash(password, 11)
      const isInsert = await this.model.user.insertOne(
        name,
        email,
        hashPassword,
        'default'
      )
      if (isInsert === true) {
        return reply.send({
          success: true,
          message: messages[2]
        })
      }
      return reply.badRequest(messages[1])
    } catch (e) {
      return reply.badRequest(messages[1])
    }
  })
}
