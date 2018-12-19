'use strict'

module.exports = {
  checkTopicRef: (conn, data, callback) => {
    conn.getConnection((errConnection, connection) => {
      if (errConnection) console.error(errConnection)

      connection.query('SELECT * FROM topic_ref_tab WHERE topic_id = ? AND news_id = ?', data, (err, rows) => {
        callback(err, _.result(rows, '[0]'))
      })
    })
  },
  insert: (conn, data, callback) => {
    conn.getConnection((errConnection, connection) => {
      if (errConnection) console.error(errConnection)

      connection.query('INSERT INTO topic_ref_tab SET ? ', data, (err, rows) => {
        if (err) {
          callback(err)
        } else {
          callback(null, _.merge(data, { id: rows.insertId }))
        }
      })
    })
  },
  delete: (conn, newsId, callback) => {
    conn.getConnection((errConnection, connection) => {
      if (errConnection) console.error(errConnection)

      connection.query('DELETE FROM topic_ref_tab WHERE news_id = ? ', newsId, (err, rows) => {
        callback(err, _.result(rows, 'affectedRows', 0))
      })
    })
  }
}
