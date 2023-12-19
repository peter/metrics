import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { addRoutes } from './routes'

export const start = async (port: number) => {
    try {
    const server: FastifyInstance = Fastify({
      logger: true
    })
    addRoutes(server)
    const host = '0.0.0.0'
    await server.listen({ port, host })
  } catch (err: any) {
    console.error(err.stack || err)
    process.exit(1)
  }
}
