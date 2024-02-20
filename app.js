const express = require('express')
const { getAllTopics, getAllEndpoints, getArticleById } = require('./controllers/app.controller')
const app = express()

app.use(express.json())

app.get('/api/topics', getAllTopics)

app.get('/api', getAllEndpoints)

app.get('/api/articles/:article_id', getArticleById)

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
    } else {
        response.status(500).send({ msg: 'Internal server error' })
    }
    
})

module.exports = app