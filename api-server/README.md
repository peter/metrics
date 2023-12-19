# metrics/api-server

## Development Setup

```sh
# Install dependencies
npm install

# Start local server with hot reload
npm run dev

# Ping server
curl http://localhost:8080/ping
```

## Redis

Running with Docker:

```sh
# Start server
docker run -it --rm --name redis-server -p 6379:6379 redis

# Run redis cli
docker exec -it redis-server redis-cli
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
curl https://metrics-api-server-63ea51367e93.herokuapp.com/ping

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
* [Heroku Node Getting Started Example App](https://github.com/heroku/node-js-getting-started)
* [Heroku Redis Cloud Addon](https://elements.heroku.com/addons/rediscloud)
* [How to Create Notification Services with Redis, Websockets, and Vue.js](https://redis.com/blog/how-to-create-notification-services-with-redis-websockets-and-vue-js/)
