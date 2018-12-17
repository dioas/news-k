'use strict'

module.exports = {
  checkTopic: (conn, data, callback) => {
    conn.getConnection((err, connection) => {
      if (err) console.error(err)

      connection.query('SELECT * FROM topic_tab WHERE LOWER(topic) = ? AND status = "active"', data, (err, rows) => {
        callback(err, _.result(rows, '[0]'))
      })
    })
  },
  insert: (conn, data, callback) => {
    conn.getConnection((err, connection) => {
      if (err) console.error(err)

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
    conn.getConnection((err, connection) => {
      if (err) console.error(err)

      connection.query('UPDATE topic_tab SET ? WHERE id = ? ', [data, id], (err, rows) => {
        callback(err, rows)
      })
    })
  }
}
