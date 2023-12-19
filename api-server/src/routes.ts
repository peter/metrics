import { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { TimeSeriesDuplicatePolicies, TimeSeriesEncoding, TimeSeriesAggregationType } from '@redis/time-series';

const N_DAYS_RETENTION = 90
const RETENTION = N_DAYS_RETENTION * 24 * 3600 * 1000  // milliseconds

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
        status: 'OK',
        HEROKU_RELEASE_CREATED_AT: process.env.HEROKU_RELEASE_CREATED_AT,
        HEROKU_RELEASE_COMMIT: process.env.HEROKU_RELEASE_COMMIT
    }
  })
  
  server.post('/metrics', {}, async (req, reply) => {
    const { metric } = req.body as any

    await redisClient.ts.create(metric.key, {
      RETENTION,
      ENCODING: TimeSeriesEncoding.UNCOMPRESSED, // No compression - When not specified, the option is set to COMPRESSED
      DUPLICATE_POLICY: TimeSeriesDuplicatePolicies.BLOCK, // No duplicates - When not specified: set to the global DUPLICATE_POLICY configuration of the database (which by default, is BLOCK).
    });

    reply.send({ metric })
  })

  server.get('/metric-values/:key', {}, async (req, reply) => {
    const { key } = req.params as any
    // TODO: Supported aggregations: ["COUNT", "MIN", "MAX", "AVG", "SUM", "FIRST", "LAST"]
    const { aggregation = "LAST" } = req.query as any

    const fromTimestamp = Date.now() - RETENTION
    const toTimestamp = Date.now()

    const rangeOptions = {
      AGGREGATION: {
        type: aggregation,
        timeBucket: RETENTION
      }
    }
    const rangeResponse = await redisClient.ts.range(key, fromTimestamp, toTimestamp, rangeOptions);
    const result = {
      fromTimestamp,
      toTimestamp,
      rangeOptions,
      rangeResponse,
    }
    reply.send(result)
  })

  server.put('/metric-values/:key/:value', {}, async (req, reply) => {
    const { key, value } = req.params as any
    const currentTime = Date.now()
    await redisClient.ts.add(key, currentTime, value);
    const metric = { key: key, value }
    // publish pub/sub notification that metric value has changed - to be picked up by websocket-server
    await redisClient.publish('metrics:notifications', JSON.stringify({ metric }));
    reply.send({ metric })
  })
}
