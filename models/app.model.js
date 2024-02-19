const db = require('../db/connection.js')

function readAllTopics() {
    let sqlString = `SELECT * FROM topics`
    return db.query(sqlString)
    .then((result) => {
        const rows = result.rows
        return rows
    })
}

module.exports = {readAllTopics}