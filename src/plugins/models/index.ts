import fastifyPlugin from 'fastify-plugin'
import { UserModel } from './user'

declare module 'fastify' {
    // eslint-disable-next-line no-unused-vars
    interface FastifyInstance {
        model: {
            user: UserModel
        }
    }
}

export default fastifyPlugin(async (fastify) => {
  fastify.decorate('model', {
    user: new UserModel(fastify.mongo.db.collection('user'))
  })
})
