const express = require('express')
const {getAllTopics} = require('./controllers/app.controller')
const app = express()

app.use(express.json())

app.get('/api/topics', getAllTopics)

app.use((err, request, response, next) => {
        response.status(500).send({msg: 'Internal server error'})
   
    
})

module.exports = app