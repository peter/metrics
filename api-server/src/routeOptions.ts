import { RouteShorthandOptions } from 'fastify'

export const createMetric: RouteShorthandOptions = {
    schema: {
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

export const getMetricValue: RouteShorthandOptions = {
    schema: {
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
