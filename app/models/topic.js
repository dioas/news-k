'use strict'

module.exports = {
  getTopic: (conn, callback) => {
    conn.getConnection((errConnection, connection) => {
      if (errConnection) console.error(errConnection)

      connection.query('SELECT * FROM topic_tab WHERE status = "active" ORDER BY id DESC', (err, rows) => {
        callback(err, rows)
      })
    })
  },
  checkTopicByNews: (conn, newsId, callback) => {
    conn.getConnection((errConnection, connection) => {
      if (errConnection) console.error(errConnection)

      connection.query('SELECT b.id,b.topic FROM topic_ref_tab a JOIN topic_tab b ON a.topic_id=b.id AND a.news_id = ? WHERE status = "active"', newsId, (err, rows) => {
        callback(err, rows)
      })
    })
  },
  checkTopic: (conn, data, callback) => {
    conn.getConnection((err, connection) => {
      if (err) console.error(err)

      connection.query('SELECT * FROM topic_tab WHERE LOWER(topic) = ? AND status = "active"', data, (err, rows) => {
        callback(err, _.result(rows, '[0]'))
      })
    })
  },
  insert: (conn, data, callback) => {
    conn.getConnection((errConnection, connection) => {
      if (errConnection) console.error(errConnection)

      connection.query('INSERT INTO topic_tab SET ? ', data, (err, rows) => {
        if (err) {
          callback(err)
        } else {
          callback(null, _.merge(data, { id: rows.insertId }))
        }
      })
    })
  },
  update: (conn, id, data, callback) => {
    conn.getConnection((errConnection, connection) => {
      if (errConnection) console.error(errConnection)

      connection.query('UPDATE topic_tab SET ? WHERE id = ? ', [data, id], (errUpdate, resultUpdate) => {
        callback(errUpdate, resultUpdate.affectedRows > 0 ? _.merge(data, { id: id }) : [])
      })
    })
  }
}
