const
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  port = process && process.ENV && process.ENV.PORT ? process.ENV.PORT : 5000

const app = express()
const path = require('path')

app.use(history())
app.use(serveStatic(path.join(__dirname, '/dist/spa')))
app.listen(port)
