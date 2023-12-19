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

## Invoking the API with Curl

```sh
# Create metric
curl -X POST -H 'Content-Type:application/json' -d '{"metric":{"key":"temperature"}}' http://localhost:8080/metrics

# Set metric value
curl -X PUT http://localhost:8080/metric-values/temperature/4

# Get metric values
curl -s http://localhost:8080/metric-values/temperature | jq
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

# Use a remote with a unique name within this repo
heroku git:remote -a metrics-api-server -r heroku-api-server

# Deploy only the api-server sub directory to Heroku
git subtree push --prefix api-server heroku-api-server main

# Smoke test API on Heroku
curl https://metrics-api-server-63ea51367e93.herokuapp.com/ping | jq

# Add Redis Cloud addon
heroku addons:create rediscloud:30 -a metrics-api-server

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
* [@redis/time-series package](https://www.npmjs.com/package/@redis/time-series)
* [Heroku Node Getting Started Example App](https://github.com/heroku/node-js-getting-started)
* [Redis Stack on Docker](https://redis.io/docs/install/install-stack/docker/)
* [Heroku Redis Cloud Addon](https://elements.heroku.com/addons/rediscloud)
* [How to Create Notification Services with Redis, Websockets, and Vue.js](https://redis.com/blog/how-to-create-notification-services-with-redis-websockets-and-vue-js/)
