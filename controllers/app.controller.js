const {readAllTopics, readEndpoints} = require('../models/app.model.js')


function getAllTopics(request, response, next) {
    readAllTopics()
        .then((topics) => {
            response.status(200).send({topics})
        })
        .catch((err) => {
            next(err)
        })
}

function getAllEndpoints(request, response, next) {
    readEndpoints()
        .then((endpointsData) => {
            response.status(200).send({'endpoints': endpointsData})
        })
        .catch((err) => {
            next(err)
        })
    
}

module.exports = {getAllTopics, getAllEndpoints}