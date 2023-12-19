import * as server from './server'

async function start() {
    const port = parseInt(process.env.PORT || '3000')
    const path = '/ws'
    server.start({ port, path })
}

start()
