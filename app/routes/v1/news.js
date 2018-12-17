'use strict'

var Route = express.Router()

Route
  .get('/get', NewsControllers.get)
  .post('/create', NewsControllers.create)
  .post('/update', NewsControllers.update)
  .get('/delete/:newsId', NewsControllers.delete)

module.exports = Route
