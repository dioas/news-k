'use strict'

module.exports = {
  getNews: (conn, data, callback) => {
    conn.getConnection((err, connection) => {
      if (err) console.error(err)

      connection.query('SELECT * FROM news_tab WHERE status IN (?)', data, (err, rows, fields) => {
        callback(err, rows)
      })
    })
  },
  insert: (conn, data, callback) => {
    conn.getConnection((err, connection) => {
      if (err) console.error(err)

      connection.query('INSERT INTO news_tab SET ? ', data, (err, rows) => {
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

      connection.query('UPDATE news_tab SET ? WHERE id = ? ', [data, id], err => {
        callback(err, _.merge(data, { id: id }))
      })
    })
  }
}
