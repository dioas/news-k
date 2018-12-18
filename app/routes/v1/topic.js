/* global TopicControllers */

'use strict'

var Route = express.Router()

Route
  .get('/get', TopicControllers.get)
  .post('/create', TopicControllers.create)
  .post('/update', TopicControllers.update)
  .get('/delete/:topicId', TopicControllers.delete)

module.exports = Route
