module.exports = (app) ->
  # Add routes here
  app.get('/health', (req, res) ->
    res.send(200)
  )
