import { FastifyInstance, RouteShorthandOptions } from 'fastify'

export async function addRoutes(server: FastifyInstance) {
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
}
