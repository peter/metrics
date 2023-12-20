# Metrics Dashboard

A simple example of a metrics dashboard implemented in Node.js and consisting of three parts:

* TODO: Dashboard web app
* [REST API server](api-server/README.md)
* [Websocket server](websocket-server/README.md)

The REST API server stores metric values in Redis as time series data. These metric values can the be fetched in aggregated form as averages, min, and max values over a 90 day retention period or over different time windows (buckets) of this period.

When a metric value is added a Redis notification is broadcasted that is picked up by the Websocket server and broadcasted to all websocket connections. There is a simple [HTML page](websocket-server/test/index.html) that can be used to smoke test the websocket connection.

The API and Websocket servers are deployed to Heroku with the Redis Cloud addon.
