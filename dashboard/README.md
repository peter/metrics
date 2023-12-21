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

## Preview Build Locally

You can locally build to dist folder and preview:

```sh
npm run build
npm run preview
```

## Vercel Deployment

```sh
npm i -g vercel
vercel
# Inspect: https://vercel.com/peter1/metrics-dashboard/4qqBnXQyYn3naGH9nPk2G9RZsJof
# Preview: https://metrics-dashboard-izcr4f767-peter1.vercel.app
```

## Heroku Deployment (Abandoned)

```sh
heroku apps:create --region eu metrics-web-dashboard

heroku buildpacks:set -a metrics-web-dashboard heroku-community/nginx

heroku git:remote -a metrics-web-dashboard -r heroku-dashboard

git subtree push --prefix dashboard heroku-dashboard main

heroku info -a metrics-web-dashboard

open https://metrics-web-dashboard-b872acac8046.herokuapp.com

heroku logs --tail -a metrics-web-dashboard

# Problem: not support on Heroku 22 stack. Next.js recommended.
```

## Resources

* [How to add Tailwindcss to Vite React App](https://tailwindcss.com/docs/guides/vite)
* [Vercel deploy](https://v2.vitejs.dev/guide/static-deploy.html#vercel-cli)
* [Heroku deploy](https://v2.vitejs.dev/guide/static-deploy.html#heroku)
* [Heroku Buildpacks](https://github.com/mars/create-react-app-buildpack?tab=readme-ov-file)
