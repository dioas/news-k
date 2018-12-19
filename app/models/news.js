'use strict'

module.exports = {
  getNews: (conn, data, callback) => {
    conn.getConnection((err, connection) => {
      if (err) console.error(err)

      let sql = ''

      if (_.result(data, 'status') && !_.isEmpty(data.status)) {
        sql += `WHERE a.status IN ('${data.status.join(`','`)}')`
      }

      if (_.result(data, 'topics') && !_.isEmpty(data.topics)) {
        if (!_.isEmpty(sql)) {
          sql += ' AND '
        }

        sql += `c.topic IN ("${data.topics.join(`","`)}")`
      }

      connection.query(`SELECT a.*,c.topic FROM news_tab a LEFT JOIN topic_ref_tab b ON a.id=b.news_id JOIN topic_tab c ON b.topic_id=c.id ${sql}`, (err, rows, fields) => {
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

      connection.query('UPDATE news_tab SET ? WHERE id = ? ', [data, id], (errUpdate, resultUpdate) => {
        callback(errUpdate, resultUpdate.affectedRows > 0 ? _.merge(data, { id: id }) : [])
      })
    })
  }
}
