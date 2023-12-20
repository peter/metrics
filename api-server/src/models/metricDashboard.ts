import * as metricModel from './metric'
import * as metricValueModel from './metricValue'

async function getAggregation(key: string, aggregation: string) {
    const timeBucket = metricModel.RETENTION
    const rangeResponse = await metricValueModel.getAggregatedValues(key, aggregation, timeBucket)
    return rangeResponse?.[0]?.value
}

async function getMetricData(key: string) {
    const aggregations = ['MIN', 'MAX', 'AVG', 'COUNT']
    const [min, max, avg, count] = await Promise.all(aggregations.map((aggregation => {
        return getAggregation(key, aggregation)
    })))
    return {
        key,
        min,
        max,
        avg,
        count,
    }
}

export async function getAll() {
    const metrics = await metricModel.list()
    return Promise.all(metrics.map(getMetricData))    
}
