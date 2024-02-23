const express = require('express')
const { getAllTopics, getAllEndpoints, getArticleById, getAllArticles, getCommentsByArticleId, postCommentOnArticleId, patchArticleByArticleId} = require('./controllers/app.controller')
const app = express()

app.use(express.json())

app.get('/api/topics', getAllTopics)

app.get('/api', getAllEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentOnArticleId)

app.patch('/api/articles/:article_id', patchArticleByArticleId)

app.use((err, request, response, next) => {
    if (err.status && err.msg) {
        response.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
})

app.use((err, request, response, next) => {
    if (err.code === '22P02') {
        response.status(400).send({msg: 'bad request'})
    }

    if (err.code === '23503') {
        response.status(404).send({msg: 'bad request - does not exist'})
    }

    else {next(err)}
})

app.use((err, request, response, next) => {
    response.status(err.code || 500).send({msg: err.message})
}) 
    


module.exports = app