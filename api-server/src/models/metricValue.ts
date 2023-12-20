import { redisClient } from '../redis'
import { RETENTION } from './metric'

export async function getAggregatedValues(key: string, aggregation: string, timeBucket: number) {
    const fromTimestamp = Date.now() - RETENTION
    const toTimestamp = Date.now()
    const rangeOptions = {
        AGGREGATION: {
          type: aggregation,
          timeBucket,
        }
      }
    const rangeResponse = await redisClient.ts.range(key, fromTimestamp, toTimestamp, rangeOptions);
    return rangeResponse
}

export async function addValue(key: string, value: number, timestamp: number = Date.now()) {
    await redisClient.ts.add(key, timestamp, value);
    const metric = { key: key, value }
    // publish pub/sub notification that metric value has changed - to be picked up by websocket-server
    const result = await redisClient.publish('metrics:notifications', JSON.stringify({ metric }));
    return result
}
