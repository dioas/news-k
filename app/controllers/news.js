/* global _ */
'use strict'

const async = require('async')
const newsModel = require('../models/news')
const topicModel = require('../models/topic')
const topicRefModel = require('../models/topic_ref')

exports.get = (req, res) => {
  async.waterfall([
    (cb) => {
      newsModel.getNews(req, req.query, (errNews, resultNews) => {
        cb(errNews, resultNews)
      })
    },
    (dataNews, cb) => {
      const listNews = []
      async.eachSeries(dataNews, (news, nextNews) => {
        topicModel.checkTopicByNews(req, news.id, (errTopic, resultTopic) => {
          if (errTopic) console.error(errTopic)
          listNews.push(_.merge(news, { topics: resultTopic }))
          nextNews()
        })
      }, errMergeNews => {
        cb(errMergeNews, listNews)
      })
    }
  ], (errNews, resultNews) => {
    if (!errNews) {
      return MiscHelper.responses(res, resultNews)
    } else {
      return MiscHelper.errorCustomStatus(res, errNews, 400)
    }
  })
}

exports.create = (req, res) => {
  req.checkBody('title', 'Title is required').notEmpty()
  req.checkBody('content', 'Content is required').notEmpty()
  req.checkBody('status', 'Status is required').notEmpty()

  if (req.validationErrors()) {
    return MiscHelper.errorCustomStatus(res, req.validationErrors(true))
  }

  const topics = _.result(req.body, 'topic', [])

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
    (newsData, cb) => {
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
                  news_id: newsData.id
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
                news_id: newsData.id
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
        newsData.topics = topicArr
        cb(err, newsData)
      })
    }
  ], (err, result) => {
    if (!err && result) {
      return MiscHelper.responses(res, result)
    } else {
      return MiscHelper.errorCustomStatus(res, err, 400)
    }
  })
}

exports.update = (req, res) => {
  req.checkBody('id', 'News ID is required').notEmpty()
  req.checkBody('title', 'Title is required').notEmpty()
  req.checkBody('content', 'Content is required').notEmpty()
  req.checkBody('status', 'Status is required').notEmpty()

  if (req.validationErrors()) {
    return MiscHelper.errorCustomStatus(res, req.validationErrors(true))
  }

  const newsId = _.result(req.body, 'id', 0)
  const topics = _.result(req.body, 'topic', [])

  async.waterfall([
    (cb) => {
      const news = {
        title: req.body.title,
        content: req.body.content,
        status: req.body.status,
        updated: new Date()
      }

      newsModel.update(req, newsId, news, (errUpdate, resultUpdate) => {
        if (_.isEmpty(resultUpdate)) {
          return MiscHelper.notFound(res, 'News not found.')
        }
        cb(errUpdate, resultUpdate)
      })
    },
    (newsData, cb) => {
      topicRefModel.delete(req, newsId, errDeleteTopicRef => {
        cb(errDeleteTopicRef, newsData)
      })
    },
    (newsData, cb) => {
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
                  news_id: newsId
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
                news_id: newsId
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
      }, errUpdate => {
        newsData.topics = topicArr
        cb(errUpdate, newsData)
      })
    }
  ], (err, result) => {
    if (!err && result) {
      return MiscHelper.responses(res, result)
    } else {
      return MiscHelper.errorCustomStatus(res, err, 400)
    }
  })
}

exports.delete = (req, res) => {
  req.checkParams('newsId', 'News ID is required and must be integer value').notEmpty().isInt()

  if (req.validationErrors()) {
    return MiscHelper.errorCustomStatus(res, req.validationErrors(true))
  }

  const newsId = _.result(req.params, 'newsId', 0)

  const news = {
    status: 'deleted',
    updated: new Date()
  }

  async.parallel({
    news: cb => {
      newsModel.update(req, newsId, news, (errNewsDeleted, resultNewsDeleted) => {
        if (_.isEmpty(resultNewsDeleted)) {
          return MiscHelper.notFound(res, 'News not found.')
        }
        cb(errNewsDeleted, resultNewsDeleted)
      })
    },
    topic: cb => {
      topicRefModel.delete(req, newsId, (errDeleteTopicRef, resutDeletedTopicRef) => {
        cb(errDeleteTopicRef, { topicDeleted: resutDeletedTopicRef })
      })
    }
  }, (errDeleted, resultDeleted) => {
    if (!errDeleted && resultDeleted) {
      return MiscHelper.responses(res, resultDeleted)
    } else {
      return MiscHelper.errorCustomStatus(res, errDeleted, 400)
    }
  })
}
