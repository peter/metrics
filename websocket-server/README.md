# metrics/websocket-server

## Development Setup

```sh
# Install dependencies
npm install

# Install Redis (see below) and start it on the default port - 6379

# Start local server with hot reload
npm run dev

# Smoke test websocket connection
open test/index.html

# Smoke test the Redis pub/sub notification
redis-cli
PUBLISH metrics:notifications  "{\"myMetric\":123}"
```

## Redis Installation

You can [install Redis](https://redis.io/docs/install/install-redis/install-redis-on-mac-os/) on Mac with `brew install redis` or use Docker:

```sh
# Start server
docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest

# Run redis cli
docker exec -it redis-stack-server redis-cli
```

## Deployment

Deployed to Heroku at [metrics-websocket-server-094fe427096d.herokuapp.com](https://metrics-websocket-server-094fe427096d.herokuapp.com) in the EU region (AWS region eu-west-1 / Ireland):

```sh
# Create Heroku app
heroku apps:create --region eu metrics-websocket-server

# Use a remote with a unique name within this repo
heroku git:remote -a metrics-websocket-server -r heroku-websocket-server

# Deploy only the websocket-server sub directory to Heroku
git subtree push --prefix websocket-server heroku-websocket-server main

# Set the Redis URL (shared with api-server)
heroku config:set REDISCLOUD_URL=$(heroku config:get REDISCLOUD_URL -a metrics-api-server) -a metrics-websocket-server

# Smoke test websocket on Heroku by opening test/index.html?heroku=true in your browser

# Smoke test the Redis connection
redis-cli -u $(heroku config:get REDISCLOUD_URL -a metrics-api-server)
PUBLISH metrics:notifications  "{\"myMetric\":123}"

# Various useful Heroku commands
heroku logs --tail -a metrics-websocket-server
heroku ps -a metrics-websocket-server
heroku info -a metrics-websocket-server
heroku config -a metrics-websocket-server
heroku run printenv -a metrics-websocket-server
```

## Resources

* [ws - Node.js websocket package](https://github.com/websockets/ws)
* [redis - Node.js redis package](https://github.com/redis/node-redis)
* [Heroku Node Getting Started Example App](https://github.com/heroku/node-js-getting-started)
