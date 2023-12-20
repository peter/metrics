import { createClient } from 'redis'

const REDIS_URL = process.env.REDISCLOUD_URL || "redis://localhost:6379"

const redisOptions = {
    url: REDIS_URL
};

export async function connect() {
    console.log('connecting to redis...', redisOptions)
    const redisClient = await createClient(redisOptions)
        .on('error', err => console.log('Redis Client Error', err.stack || err))
        .connect();
    return redisClient
}