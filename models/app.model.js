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

function readAllArticles() {
    let sqlString = `
    SELECT 
    articles.article_id, articles.author,
    articles.title, articles.topic,
    articles.created_at, articles.votes,
    articles.article_img_url,
    COUNT(comments.body) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
    `
    return db.query(sqlString)
    .then((result) => {
        const rows = result.rows
        return rows
    })
}

function readCommentsByArticleId(articleID) {
    let sqlString = `SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC`
    return db.query(sqlString, [articleID])
    .then((result) => {
        return (result.rows.length === 0) ? Promise.reject({status: 404, msg: 'no comments for that article'}) : result.rows
    })
}

function readAllUsers() {
    let sqlString = `SELECT * FROM users`
    return db.query(sqlString)
    .then((result) => {
        const users = result.rows
        return users
    })
}

function addCommentOnArticle(articleID, {username, body}) {
    let sqlString = `INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *`
    return db.query(sqlString, [articleID, username, body])
    .then((result) => {
        return (result.rows[0])
    })
}

function updateArticleByArticleId(articleID, incVotes) {
    let sqlString = `
    UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *;`
    return db.query(sqlString, [articleID, incVotes])
    .then((result) => {
        return (result.rows.length === 0) ? Promise.reject({status: 404, msg: 'no article with that id'}) : result.rows[0]
    })
}

function deleteFromComments(commentID) {
    let sqlString = `DELETE FROM comments WHERE comment_id = $1 RETURNING *`
    return db.query(sqlString, [commentID])
    .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({status: 404, msg: 'no comment with that id'})
        }
    })
}

module.exports = {readAllTopics, readEndpoints, readArticleById, readAllArticles, readCommentsByArticleId, readAllUsers, addCommentOnArticle, updateArticleByArticleId, deleteFromComments}