express = require 'express'
configAll = require './config/env/all'

app = express()
app.listen(configAll.port)

<% if (includeClient) { %>
app.use(express.static(__dirname + '/../_public'))
<% } %>

