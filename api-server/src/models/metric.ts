import { redisClient } from '../redis'

const N_DAYS_RETENTION = 90
export const RETENTION = N_DAYS_RETENTION * 24 * 3600 * 1000  // milliseconds

export async function list() {
    const metrics = await redisClient.sendCommand(['TS.QUERYINDEX', "all=all"]);
    return metrics
}

export async function create(key: string) {
    const result = await redisClient.sendCommand(
        ['TS.CREATE', key, 'RETENTION', String(RETENTION), 'LABELS', "all", "all"]
    );
    return result
}

export async function remove(key: string) {
    const result = await redisClient.sendCommand(['DEL', key]);
    return result
}
