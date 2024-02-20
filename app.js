const express = require('express')
const { getAllTopics, getAllEndpoints } = require('./controllers/app.controller')
const app = express()

app.use(express.json())

app.get('/api/topics', getAllTopics)

app.get('/api', getAllEndpoints)

app.use((err, request, response, next) => {
    if (err.status && err.msg) {
        response.status(err.status).send({msg: err.msg})
    }
})

app.use((err, request, response, next) => {
    response.status(500).send({ msg: 'Internal server error' })
})

module.exports = app