import WebSocket, { WebSocketServer } from 'ws';
import * as redis from './redis'

type WebsocketServerOptions = {
    port: number;
    path: string;
}

export async function start(options: WebsocketServerOptions) {  
  const wss = new WebSocketServer({
      port: options.port,
      path: options.path,
      perMessageDeflate: {
        zlibDeflateOptions: {
          // See zlib defaults.
          chunkSize: 1024,
          memLevel: 7,
          level: 3
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed if context takeover is disabled.
      }
    });

    const redisClient = await redis.connect()

    redisClient.subscribe('metrics:notifications', (message, channel) => {
      const messageData = JSON.parse(message)
      console.log(`redisClient received message on channel ${channel}`, messageData)
      for (const client of wss.clients) {
        client.send(message)
      }
    });                  

    wss.on('connection', (ws) => {
      console.log(`New websocket connection wss.clients.length=${wss.clients?.size}`)
      ws.on('error', console.error);      
      ws.on('message', function message(data) {
        console.log('received: %s', data);
      });
      ws.on('close', () => {
        console.log(`Websocket closed wss.clients.length=${wss.clients?.size}`)
      })
    });      
}
