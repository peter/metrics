import { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { TimeSeriesDuplicatePolicies, TimeSeriesEncoding, TimeSeriesAggregationType } from '@redis/time-series';
import * as routeOptions from './routeOptions'

const N_DAYS_RETENTION = 90
const RETENTION = N_DAYS_RETENTION * 24 * 3600 * 1000  // milliseconds

export async function addRoutes(server: FastifyInstance, redisClient: any) {
  // Server ping
  server.get('/ping', {}, async () => {
    return {
        status: 'OK',
        HEROKU_RELEASE_CREATED_AT: process.env.HEROKU_RELEASE_CREATED_AT,
        HEROKU_RELEASE_COMMIT: process.env.HEROKU_RELEASE_COMMIT
    }
  })

  // List metrics
  server.get('/metrics', {}, async (req, reply) => {
    const metrics = await redisClient.sendCommand(['TS.QUERYINDEX', "all=all"]);
    reply.send({ metrics })
  })

  // Create metric
  server.post('/metrics', routeOptions.createMetric, async (req, reply) => {
    const { metric } = req.body as any
    await redisClient.sendCommand(['TS.CREATE', metric.key, 'RETENTION', String(RETENTION), 'LABELS', "all", "all"]);
    reply.send({ metric })
  })

  // Delete metric
  server.delete('/metrics/:key', {}, async (req, reply) => {
    const { key } = req.params as any
    const result = await redisClient.sendCommand(['DEL', key]);
    reply.send({ result })
  })

  // Get aggregated metric values. By default only returns one value but you can set timeBucket to return multiple values
  server.get('/metric-values/:key', routeOptions.getMetricValue, async (req, reply) => {
    const { key } = req.params as any
    // TODO: Supported aggregations: ["COUNT", "MIN", "MAX", "AVG", "SUM", "FIRST", "LAST"]
    const { aggregation = "LAST", timeBucket = RETENTION } = req.query as any

    const fromTimestamp = Date.now() - RETENTION
    const toTimestamp = Date.now()

    const rangeOptions = {
      AGGREGATION: {
        type: aggregation,
        timeBucket,
      }
    }
    const rangeResponse = await redisClient.ts.range(key, fromTimestamp, toTimestamp, rangeOptions);
    const result = {
      rangeResponse,
    }
    reply.send(result)
  })

  // Add metric value
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
