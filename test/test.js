/* global describe it before */

const App = require('../app.js')
const supertest = require('supertest')
const CONFIG = require('../app/config/index')
const should = require('should')
const expect = require('chai').expect
const assert = require('assert')
const _ = require('lodash')

const server = supertest(App.server)


before((done) => {
  done()
})

describe('Index Page', () => {
  it('GET /v1/ should return 404 page', (done) => {
    server
      .post('/')
      .expect('Content-type', /json/)
      .expect(404)
      .end((err, res) => {
        res.status.should.equal(404)
        done()
      })
  })
})

describe('News Scenario', () => {
  const dataNews = {
    id: 22,
    title: 'Pilpres 2019',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    topic: ['Pilpres 2019', 'Jokowi-Amin', 'Prabowo-Sandi'],
    status: 'publish'
  }

  it('POST /v1/news/create - Should 200 : Success Create News', (done) => {
    server
      .post('/v1/news/create')
      .set('Authorization', 'X-KUMPARAN-NEWS')
      .set('x-token-client', '123')
      .set('userid', '1')
      .send(dataNews)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        res.body.status.should.equal(200)
        res.body.data.should.have.property('id')
        res.body.data.should.have.property('content')
        res.body.data.should.have.property('status')
        res.body.data.should.have.property('topics')

        global.newsId = res.body.data.id
        dataNews.id = newsId
        done()
      })
  })

  it('POST /v1/news/update - Should 200 : Success Update News', (done) => {
    dataNews.id = newsId
    server
      .post('/v1/news/update')
      .set('Authorization', 'X-KUMPARAN-NEWS')
      .set('x-token-client', '123')
      .set('userid', '1')
      .send(_.merge(dataNews, { id: newsId }))
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        res.body.status.should.equal(200)
        res.body.data.should.have.property('id')
        res.body.data.should.have.property('content')
        res.body.data.should.have.property('status')
        res.body.data.should.have.property('topics')
        done()
      })
  })

  it('GET /v1/news/get - Should 200 : Success Get and Filter News', (done) => {
    server
      .get('/v1/news/get')
      .set('Authorization', 'X-KUMPARAN-NEWS')
      .set('x-token-client', '123')
      .set('userid', '1')
      .query({ status: ['publish', 'draft'], topics: dataNews.topic })
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        res.body.status.should.equal(200)
        expect(res.body.data).is.an('array')
        done()
      })
  })

  it('GET /v1/news/delete - Should 200 : Success Delete News', (done) => {
    server
      .get('/v1/news/delete/' + newsId)
      .set('Authorization', 'X-KUMPARAN-NEWS')
      .set('x-token-client', '123')
      .set('userid', '1')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        res.body.status.should.equal(200)
        res.body.data.should.have.property('news')
        res.body.data.should.have.property('topic')
        done()
      })
  })
})

describe('Topic Scenario', () => {
  const dataTopic = {
    topic: 'Pemilu Serentak' + new Date().getTime()
  }

  it('POST /v1/topic/create - Should 200 : Success Create Topic', (done) => {
    server
      .post('/v1/topic/create')
      .set('Authorization', 'X-KUMPARAN-NEWS')
      .set('x-token-client', '123')
      .set('userid', '1')
      .send(dataTopic)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        res.body.status.should.equal(200)
        res.body.data.should.have.property('id')
        res.body.data.should.have.property('topic')
        global.topicId = res.body.data.id
        done()
      })
  })

  it('POST /v1/topic/update - Should 200 : Success Update Topic', (done) => {
    server
      .post('/v1/topic/update')
      .set('Authorization', 'X-KUMPARAN-NEWS')
      .set('x-token-client', '123')
      .set('userid', '1')
      .send(_.merge(dataTopic, { id: topicId, updated: new Date() }))
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        res.body.status.should.equal(200)
        res.body.data.should.have.property('id')
        res.body.data.should.have.property('topic')

        done()
      })
  })

  it('GET /v1/topic/get - Should 200 : Success Get Topic', (done) => {
    server
      .get('/v1/topic/get')
      .set('Authorization', 'X-KUMPARAN-NEWS')
      .set('x-token-client', '123')
      .set('userid', '1')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        res.body.status.should.equal(200)
        expect(res.body.data).is.an('array')
        done()
      })
  })

  it('GET /v1/topic/delete - Should 200 : Success Delete Topic', (done) => {
    server
      .get('/v1/topic/delete/' + topicId)
      .set('Authorization', 'X-KUMPARAN-NEWS')
      .set('x-token-client', '123')
      .set('userid', '1')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        res.body.status.should.equal(200)
        res.body.data.should.have.property('status')
        res.body.data.should.have.property('id')
        done()
      })
  })
})

after((done) => {
  App.server.close()
  done()
})
