import { RouteShorthandOptions, RouteShorthandOptionsWithHandler } from 'fastify'

export const listMetrics: RouteShorthandOptions = {
  schema: {
    description: 'list metrics',
    tags: ["metrics"],
  }
}

export const createMetric: RouteShorthandOptions = {
    schema: {
      tags: ["metrics"],
      description: 'create metric',
      body: {
        type: 'object',
        properties: {
          metric: {
            type: 'object',
            properties: {
              key: { type: 'string' },
            },
            required: ['key'],
            additionalProperties: false
          },
        },
        required: ['metric'],
        additionalProperties: false
      },
    },
}

export const deleteMetric: RouteShorthandOptions = {
  schema: {
    description: 'delete metric',
    tags: ["metrics"],
  }
}

export const getMetricValue: RouteShorthandOptions = {
    schema: {
      tags: ["metric-values"],
      description: "get metric value",
      querystring: {
        type: 'object',
        properties: {
          aggregation: {
            type: 'string',
            enum: ["COUNT", "MIN", "MAX", "AVG", "SUM", "FIRST", "LAST"],
          },
          timeBucket: {
            minimum: 1000,
            type: 'number',
          }
        },
        additionalProperties: false
      },
      response: {
        200: {
          type: 'object',
          properties: {
            rangeResponse: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                    timestamp: { type: 'number' },
                    value: { type: 'number' },
                },
                required: ['timestamp', 'value'],
                additionalProperties: true,
              }
            }
          },
          required: ['rangeResponse'],
          additionalProperties: false
        }
      }      
    },
}

export const addMetricValue: RouteShorthandOptions = {
  schema: {
    tags: ["metric-values"],
    description: "add metric value",
    params: {
      type: 'object',
      properties: {
        key: { type: 'string' },
        value: { type: 'number' },
      },
      required: ['key', 'value'],
      additionalProperties: false
    },
    querystring: {
      type: 'object',
      properties: {
        timestamp: { type: 'number', },
      },
      additionalProperties: false
    }
  },
}

export const metricsDashboard: RouteShorthandOptions = {
  schema: {
    description: 'get all metric values needed for dashboard',
    tags: ["metric-values"],
  }
}
