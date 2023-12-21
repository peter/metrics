import { FastifyInstance } from 'fastify'
import * as routeOptions from './routeOptions'
import * as metricModel from './models/metric'
import * as metricValueModel from './models/metricValue'
import * as metricDashboardModel from './models/metricDashboard'

export async function addRoutes(server: FastifyInstance) {
  // Server ping
  server.get('/ping', {}, async () => {
    return {
        status: 'OK',
        HEROKU_RELEASE_CREATED_AT: process.env.HEROKU_RELEASE_CREATED_AT,
        HEROKU_RELEASE_COMMIT: process.env.HEROKU_RELEASE_COMMIT
    }
  })

  // Get all metric / metric value needed for basic dashboard
  server.get('/metrics-dashboard', routeOptions.metricsDashboard, async (req, reply) => {
    const metrics = await metricDashboardModel.getAll()
    reply.send({ metrics })
  })
  
  // List metrics
  server.get('/metrics', routeOptions.listMetrics, async (req, reply) => {
    const metrics = await metricModel.list()
    reply.send({ metrics })
  })

  // Create metric
  server.post('/metrics', routeOptions.createMetric, async (req, reply) => {
    const { metric } = req.body as any
    await metricModel.create(metric.key)
    reply.send({ metric })
  })

  // Delete metric
  server.delete('/metrics/:key', routeOptions.deleteMetric, async (req, reply) => {
    const { key } = req.params as any
    const result = await metricModel.remove(key)
    reply.send({ result })
  })

  // Get aggregated metric values. By default only returns last value but you can set timeBucket to return multiple values
  server.get('/metric-values/:key', routeOptions.getMetricValue, async (req, reply) => {
    const { key } = req.params as any
    const { aggregation = "LAST", timeBucket = metricModel.RETENTION } = req.query as any
    const rangeResponse = await metricValueModel.getAggregatedValues(key, aggregation, timeBucket)
    reply.send({
      rangeResponse,
    })
  })

  // Add metric value
  server.put('/metric-values/:key/:value', routeOptions.addMetricValue, async (req, reply) => {
    const { key, value } = req.params as any
    const { timestamp = Date.now() } = req.query as any
    const result = await metricValueModel.addValue(key, value, timestamp)
    const metric = { key, value }
    reply.send({ metric, result })
  })
}
