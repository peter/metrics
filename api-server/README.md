# metrics/api-server

## Development Setup

```sh
# Install dependencies
npm install

# Install Redis (see below) and start it on the default port - 6379

# Start local server with hot reload
npm run dev

# Ping server
curl http://localhost:8080/ping
```

## API Docs

Basic (but incomplete) OpenAPI docs is available under `/docs`

## Invoking the API with Curl

```sh
export LOCAL_BASE_URL=http://localhost:8080
export PRODUCTION_BASE_URL=https://metrics-api-server-63ea51367e93.herokuapp.com
export BASE_URL=$LOCAL_BASE_URL

# Get OpenAPI Docs
open $BASE_URL/docs

# Create metric
curl -X POST -H 'Content-Type:application/json' -d '{"metric":{"key":"temperature"}}' $BASE_URL/metrics

# List metrics
curl -s $BASE_URL/metrics | jq

# Add metric values
curl -X PUT $BASE_URL/metric-values/temperature/4
curl -X PUT $BASE_URL/metric-values/temperature/-5
# Add metric value for a past timestamp (milliseconds since epoch)
curl -X PUT "$BASE_URL/metric-values/temperature/23?timestamp=1703059808739" | jq

# Get metric value (gets last value by default and for the full 90 day retention period)
curl -s $BASE_URL/metric-values/temperature | jq
# Get average values in buckets of one hour
curl -s "$BASE_URL/metric-values/temperature?aggregation=AVG&timeBucket=3600000" | jq
# Get min/max/average metric value in the full 90 day range
curl -s $BASE_URL/metric-values/temperature?aggregation=MIN | jq
curl -s $BASE_URL/metric-values/temperature?aggregation=MAX | jq
curl -s $BASE_URL/metric-values/temperature?aggregation=AVG | jq

# Get aggregated metric values (min/max/avg/count) for all metrics for dashboard
curl -s $BASE_URL/metrics-dashboard | jq 
```

## Redis Installation

You can [install Redis](https://redis.io/docs/install/install-redis/install-redis-on-mac-os/) on Mac with `brew install redis` or use Docker:

```sh
# Start server in the terminal interactively
docker run -it --rm --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest

# Start server in the backround
docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest

# Run redis cli
docker exec -it redis-stack-server redis-cli
```

## Deployment

Deployed to Heroku at [metrics-api-server-63ea51367e93.herokuapp.com](https://metrics-api-server-63ea51367e93.herokuapp.com) in the EU region (AWS region eu-west-1 / Ireland):

```sh
# Create Heroku app
heroku apps:create --region eu metrics-api-server

# Add Redis Cloud addon
heroku addons:create rediscloud:30 -a metrics-api-server

# Use a remote with a unique name within this repo
heroku git:remote -a metrics-api-server -r heroku-api-server

# Deploy only the api-server sub directory to Heroku
git subtree push --prefix api-server heroku-api-server main

# Check API is up on Heroku
curl -s https://metrics-api-server-63ea51367e93.herokuapp.com/ping | jq

# Smoke test the Redis connection
redis-cli -u $(heroku config:get REDISCLOUD_URL -a metrics-api-server)

# Various useful Heroku commands
heroku logs --tail -a metrics-api-server
heroku ps -a metrics-api-server
heroku info -a metrics-api-server
heroku config -a metrics-api-server
heroku labs:enable runtime-dyno-metadata -a metrics-api-server
heroku run printenv -a metrics-api-server
heroku restart -a metrics-api-server
```

## Resources

* [fastify - Node.js web framework](https://fastify.dev)
* [@fastify/swagger - OpenAPI for Fastify](https://github.com/fastify/fastify-swagger)
* [@redis/time-series package](https://www.npmjs.com/package/@redis/time-series)
* [Heroku Node Getting Started Example App](https://github.com/heroku/node-js-getting-started)
* [Redis Time Series Commands](https://docs.redis.com/latest/stack/timeseries/commands/)
* [Redis Stack on Docker](https://redis.io/docs/install/install-stack/docker/)
* [Heroku Redis Cloud Addon](https://elements.heroku.com/addons/rediscloud)
* [How to Create Notification Services with Redis, Websockets, and Vue.js](https://redis.com/blog/how-to-create-notification-services-with-redis-websockets-and-vue-js/)

Alternative technologies and services not used in this project:

* [TinyBird - hosted analytics/metrics service based on Clickhouse](https://www.tinybird.co)
* [Postgres/TimescaleDB - alternative to Redis Time Series](https://github.com/timescale/timescaledb)
