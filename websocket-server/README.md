# metrics/websocket-server

## Development Setup

```sh
# Install dependencies
npm install

# Start local server with hot reload
npm run dev

# Smoke test websocket locally
open test/index.html
```

## Deployment

Deployed to Heroku at [metrics-websocket-server-094fe427096d.herokuapp.com](https://metrics-websocket-server-094fe427096d.herokuapp.com) in the EU region (AWS region eu-west-1 / Ireland):

```sh
# Create Heroku app
heroku apps:create --region eu metrics-websocket-server

# Use a remote with a unique name within this repo
heroku git:remote -a metrics-websocket-server -r heroku-websocket-server

# Deploy to Heroku
git subtree push --prefix websocket-server heroku-websocket-server main
```

## Resources

* [ws - Node.js websocket package](https://github.com/websockets/ws)
* [Heroku Node Getting Started Example App](git@github.com:heroku/node-js-getting-started.git)
