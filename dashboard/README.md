# metrics/dashboard

A minimal React/TypeScript app with Tailwindcss created with Vite.

## Development Setup

```sh
npm install

npm run dev

# NOTE: you need to have api-server and websocket-server (and Redis) running
# for the dashboard to work

open http://localhost:3000
```

## Deployment

You can locally build to dist folder and preview:

```sh
npm run build
npm run preview
```

Heroku deployment:

```sh
heroku apps:create --region eu metrics-web-dashboard

heroku buildpacks:set -a metrics-web-dashboard https://github.com/heroku/heroku-buildpack-static.git

heroku git:remote -a metrics-web-dashboard -r heroku-dashboard

git subtree push --prefix dashboard heroku-dashboard main
```

## Resources

* [How to add Tailwindcss to Vite React App](https://tailwindcss.com/docs/guides/vite)
* [Heroku deploy](https://v2.vitejs.dev/guide/static-deploy.html#heroku)
