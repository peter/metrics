import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { addRoutes } from './routes'
import * as redis from './redis'
import cors from '@fastify/cors'

export const start = async (port: number) => {
  try {
    await redis.start()
    const server: FastifyInstance = Fastify({
      logger: true
    })
    await server.register(cors, {})    
    addRoutes(server)
    const host = '0.0.0.0'
    await server.listen({ port, host })
  } catch (err: any) {
    console.error(err.stack || err)
    process.exit(1)
  }
}
