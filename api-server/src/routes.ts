import { FastifyInstance, RouteShorthandOptions } from 'fastify'

export async function addRoutes(server: FastifyInstance, redisClient: any) {
  const pingOptions: RouteShorthandOptions = {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              pong: {
                type: 'string'
              },
              HEROKU_RELEASE_CREATED_AT: {
                  type: 'string'
              },
              HEROKU_RELEASE_COMMIT: {
                  type: 'string'
              }
            }
          }
        }
      }
  }
  server.get('/ping', pingOptions, async () => {
    return {
        pong: 'it worked!',
        HEROKU_RELEASE_CREATED_AT: process.env.HEROKU_RELEASE_CREATED_AT,
        HEROKU_RELEASE_COMMIT: process.env.HEROKU_RELEASE_COMMIT
    }
  })
  
  const getMetricOptions: RouteShorthandOptions = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            metric: {
              type: 'object',
              properties: {
                key: { type: 'string', },
                value: { type: 'string', },
              },
              required: ['key', 'value'],
              additionalProperties: false
            },
          }
        }
      }
    }
  }

  server.get('/metrics/:key', getMetricOptions, async (req, reply) => {
    const { key } = req.params as any
    const value = await redisClient.get(key)
    const metric = { key: key, value }
    reply.send({ metric })
  })

  server.put('/metrics/:key/:value', getMetricOptions, async (req, reply) => {
    const { key, value } = req.params as any
    await redisClient.set(key, value)
    const metric = { key: key, value }
    reply.send({ metric })
  })
}
