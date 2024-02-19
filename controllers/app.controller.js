const {readAllTopics} = require('../models/app.model.js')


function getAllTopics(request, response) {
    readAllTopics()
        .then((topics) => {
            response.status(200).send({topics})
        })
        .catch((err) => {
            next(err)
        })
}

module.exports = {getAllTopics}