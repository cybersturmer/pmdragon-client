const
	express = require('express'),
	serveStatic = require('serve-static'),
	history = require('connect-history-api-fallback'),
	port = process && process.env && process.env.PORT ? process.env.PORT : 80

const app = express()
const path = require('path')

app.use(history())
app.use(serveStatic(path.join(__dirname, 'dist/spa')))
app.listen(port)
