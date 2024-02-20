const db = require('../db/connection.js')
const fs = require('fs/promises')

function readAllTopics() {
    let sqlString = `SELECT * FROM topics`
    return db.query(sqlString)
    .then((result) => {
        const rows = result.rows
        return rows
    })
}

function readEndpoints() {
    return fs.readFile(`${__dirname}/../endpoints.json`, 'utf8')
    .then((data) => {
        return JSON.parse(data)
    })
}

module.exports = {readAllTopics, readEndpoints}