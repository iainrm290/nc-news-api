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

function readArticleById(articleID) {
    let sqlString = `SELECT * FROM articles WHERE article_id = $1`
    return db.query(sqlString, [articleID])
    .then((result) => {
        return (result.rows.length === 0) ? Promise.reject({status: 404, msg: 'no article with that id'}) : result.rows[0]
    })
}

module.exports = {readAllTopics, readEndpoints, readArticleById}