const express = require('express')
const cors = require('cors');
const { getAllTopics, getAllEndpoints, getArticleById, getAllArticles, getCommentsByArticleId, getAllUsers, postCommentOnArticleId, patchArticleByArticleId, deleteCommentByCommentId} = require('./controllers/app.controller')
const app = express()
app.use(cors());
app.use(express.json())

app.get('/api/topics', getAllTopics)

app.get('/api', getAllEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.get('/api/users', getAllUsers)

app.post('/api/articles/:article_id/comments', postCommentOnArticleId)

app.patch('/api/articles/:article_id', patchArticleByArticleId)

app.delete('/api/comments/:comment_id', deleteCommentByCommentId)

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
        response.status(404).send({msg: 'does not exist'})
    }

    else {next(err)}
})

app.use((err, request, response, next) => {
    response.status(err.code || 500).send({msg: err.message})
}) 
    


module.exports = app