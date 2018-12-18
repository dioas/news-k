/* global _ */
'use strict'

const async = require('async')

const topicModel = require('../models/topic')

exports.get = (req, res) => {
  topicModel.getTopic(req, (errTopic, resultTopic) => {
    if (!errTopic) {
      return MiscHelper.responses(res, resultTopic)
    } else {
      return MiscHelper.errorCustomStatus(res, errTopic, 400)
    }
  })
}

exports.create = (req, res) => {
  req.checkBody('topic', 'Topic is required').notEmpty()

  if (req.validationErrors()) {
    return MiscHelper.errorCustomStatus(res, req.validationErrors(true))
  }

  const topic = req.body.topic

  async.waterfall([
    (cb) => {
      topicModel.checkTopic(req, topic, (errCheck, resultCheck) => {
        if (!_.isEmpty(resultCheck)) {
          cb(new Error('Topic already exists'))
        } else {
          cb(errCheck)
        }
      })
    },
    (cb) => {
      const dataTopic = {
        topic: req.body.topic,
        status: 'active',
        created: new Date(),
        updated: new Date()
      }

      topicModel.insert(req, dataTopic, (errTopicUpdated, resultTopicUpdated) => {
        cb(errTopicUpdated, resultTopicUpdated)
      })
    }
  ], (errUpdated, resultUpdated) => {
    if (errUpdated) {
      return MiscHelper.errorCustomStatus(res, errUpdated, 400)
    } else {
      return MiscHelper.responses(res, resultUpdated)
    }
  })
}

exports.update = (req, res) => {
  req.checkBody('id', 'Topic ID is required and must be integer value').notEmpty().isInt()
  req.checkBody('topic', 'Topic is required').notEmpty()

  if (req.validationErrors()) {
    return MiscHelper.errorCustomStatus(res, req.validationErrors(true))
  }

  const topicId = req.body.id
  const topic = req.body.topic

  async.waterfall([
    (cb) => {
      topicModel.checkTopic(req, topic, (errCheck, resultCheck) => {
        if (!_.isEmpty(resultCheck)) {
          console.log(resultCheck)
          if (resultCheck.topic === topic) {
            cb(null)
          } else {
            cb(new Error('Topic already exists'))
          }
        } else {
          cb(errCheck)
        }
      })
    },
    (cb) => {
      const dataTopic = {
        topic: topic,
        updated: new Date()
      }

      topicModel.update(req, topicId, dataTopic, (errTopicUpdated, resultTopicUpdated) => {
        cb(errTopicUpdated, resultTopicUpdated)
      })
    }
  ], (errUpdated, resultUpdated) => {
    if (errUpdated) {
      return MiscHelper.errorCustomStatus(res, errUpdated, 400)
    }

    if (_.isEmpty(resultUpdated)) {
      return MiscHelper.notFound(res, 'Topic not found.')
    } else {
      return MiscHelper.responses(res, resultUpdated)
    }
  })
}

exports.delete = (req, res) => {
  req.checkParams('topicId', 'Topic ID is required and must be integer value').notEmpty().isInt()

  if (req.validationErrors()) {
    return MiscHelper.errorCustomStatus(res, req.validationErrors(true))
  }

  const topicId = req.params.topicId
  const dataTopic = {
    status: 'inactive',
    updated: new Date()
  }

  topicModel.update(req, topicId, dataTopic, (errTopicDeleted, resultTopicDeleted) => {
    if (errTopicDeleted) {
      return MiscHelper.errorCustomStatus(res, errTopicDeleted, 400)
    }

    if (_.isEmpty(resultTopicDeleted)) {
      return MiscHelper.notFound(res, 'Topic not found.')
    } else {
      return MiscHelper.responses(res, resultTopicDeleted)
    }
  })
}
