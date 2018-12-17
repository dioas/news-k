'use strict'

var Route = express.Router()

Route
  .get('/get', NewsControllers.get)
  .post('/create', NewsControllers.create)

module.exports = Route
