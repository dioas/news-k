'use strict'

module.exports = {
    insert: (conn, data, callback) => {
        return new Promise((resolve, reject) => {
            conn.getConnection((err, connection) => {
                if (err) console.error(err)
                connection.query("INSERT INTO topic_ref_tab SET ? ", data, (err, rows) => {
                    callback(err, rows)
                })
            })
        })
    }
}