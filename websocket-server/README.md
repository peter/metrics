# metrics/websocket-server

## Development Setup

```sh
# Install dependencies
npm install

# Start local server with hot reload
npm run dev

# Smoke test websocket connection
open test/index.html
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

# Smoke test websocket on Heroku by opening test/index.html?heroku=true in your browser

# Various useful Heroku commands
heroku logs --tail -a metrics-websocket-server
heroku ps -a metrics-websocket-server
heroku info -a metrics-websocket-server
heroku config -a metrics-websocket-server
heroku run printenv -a metrics-websocket-server
```

## Resources

* [ws - Node.js websocket package](https://github.com/websockets/ws)
* [Heroku Node Getting Started Example App](git@github.com:heroku/node-js-getting-started.git)
