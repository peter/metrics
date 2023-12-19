import * as server from './server'

async function start() {
    const port = parseInt(process.env.PORT || '8080')
    server.start(port)
}

start()
