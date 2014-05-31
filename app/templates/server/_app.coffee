express = require 'express'
config = require './config/config'
routes = require './config/routes'

app = express()

<% if (includeClient) { %>
app.use(express.static(__dirname + '/../_public'))
<% } %>

routes(app)
app.listen(config.port)
