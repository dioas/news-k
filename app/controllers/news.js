'use strict'

const async = require('async')
const newsModel = require('../models/news')
const topicModel = require('../models/topic')
const topicRefModel = require('../models/topic_ref')

exports.get = (req, res) => {

}

exports.create = (req, res) => {
  req.checkBody('title', 'Title is required').notEmpty()
  req.checkBody('content', 'Content is required').notEmpty()
  req.checkBody('status', 'Status is required').notEmpty()

  if (req.validationErrors()) {
    return MiscHelper.errorCustomStatus(res, req.validationErrors(true))
  }

  const topics = _.result(req.body, 'topic', [])

  try {
    async.waterfall([
      (cb) => {
        const news = {
          title: req.body.title,
          content: req.body.content,
          status: req.body.status,
          created: new Date(),
          updated: new Date()
        }

        newsModel.insert(req, news, (err, resultNews) => {
          cb(err, resultNews)
        })
      },
      (data, cb) => {
        const topicArr = []
        async.eachSeries(topics, (topic, nextTopic) => {
          topicModel.checkTopic(req, topic, (errCheck, resultCheck) => {
            if (_.isEmpty(resultCheck) && !errCheck) {
              let dataTopic = {
                topic: topic,
                status: 'active',
                created: new Date(),
                updated: new Date()
              }

              topicModel.insert(req, dataTopic, (errInsert, newTopic) => {
                if (!errInsert && newTopic) {
                  let dataTopicRef = {
                    topic_id: newTopic.id,
                    news_id: data.id
                  }

                  topicRefModel.insert(req, dataTopicRef, errInsertTopicRef => {
                    topicArr.push(_.merge(dataTopicRef, { topics: topic }))
                    nextTopic(errInsertTopicRef)
                  })
                } else {
                  nextTopic(errInsert)
                }
              })
            } else {
              if (!errCheck) {
                let dataTopicRef = {
                  topic_id: resultCheck.id,
                  news_id: data.id
                }

                topicRefModel.insert(req, dataTopicRef, errInsertTopicRef => {
                  topicArr.push(_.merge(dataTopicRef, { topics: topic }))
                  nextTopic(errInsertTopicRef)
                })
              } else {
                nextTopic(errCheck)
              }
            }
          })
        }, err => {
          data.topic = topicArr
          cb(err, data)
        })
      }
    ], (err, result) => {
      if (!err && result) {
        return MiscHelper.responses(res, result)
      } else {
        return MiscHelper.errorCustomStatus(res, err, 400)
      }
    })
  } catch (err) {
    return MiscHelper.errorCustomStatus(res, err, 400)
  }
}
