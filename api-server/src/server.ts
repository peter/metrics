import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'

const server: FastifyInstance = Fastify({
  logger: true
})

const pingOptions: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          pong: {
            type: 'string'
          }
        }
      }
    }
  }
}

server.get('/ping', pingOptions, async (request, reply) => {
  return { pong: 'it worked!' }
})

export const start = async (port: number) => {
  try {
    const host = '0.0.0.0'
    await server.listen({ port, host })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
