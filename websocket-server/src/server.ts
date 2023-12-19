import WebSocket, { WebSocketServer } from 'ws';

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
      
      wss.on('connection', function connection(ws) {
          ws.on('error', console.error);
        
          ws.on('message', function message(data) {
            console.log('received: %s', data);
          });
        
          const message = { ping: true }
          ws.send(JSON.stringify(message));
      });      
}
