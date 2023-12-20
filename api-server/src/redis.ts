import { RedisClientType } from '@redis/client';
import { RedisFunctions, RedisModules, RedisScripts, createClient } from 'redis'

const REDIS_URL = process.env.REDISCLOUD_URL || "redis://localhost:6379"

const redisOptions = {
    url: REDIS_URL
};

export let redisClient: any;

export async function start() {
    console.log('connecting to redis...', redisOptions)
    redisClient = await createClient(redisOptions)
        .on('error', err => console.log('Redis Client Error', err.stack || err))
        .connect();
    return redisClient
}
