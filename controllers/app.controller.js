const {readAllTopics, readEndpoints, readArticleById, readAllArticles, readCommentsByArticleId, addCommentOnArticle, updateArticleByArticleId} = require('../models/app.model.js')


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

function getArticleById(request, response, next) {
    const articleID = request.params.article_id
    readArticleById(articleID)
    .then((article) => {
        response.status(200).send({article: article})
    })
    .catch((err) => {
        next(err)
    })
}

function getAllArticles(request, response, next) {
    readAllArticles()
    .then((articles) => {
        response.status(200).send({articles: articles})
    })
    .catch((err) => {
        next(err)
    })
}

function getCommentsByArticleId(request, response, next) {
    const articleID = request.params.article_id
    readCommentsByArticleId(articleID)
    .then((comments) => {
        response.status(200).send({comments: comments})
    })
    .catch((err) => {
        next(err)
    })
}

function postCommentOnArticleId(request, response, next) {
    const articleID = request.params.article_id
    const commentToPost = request.body
    const keysToCheck = Object.keys(commentToPost)
    if (keysToCheck.length !==  2) {
        return response.status(400).send({msg: 'bad request'})
    }

    addCommentOnArticle(articleID, commentToPost)
    .then((postedComment) => {
        response.status(201).send(postedComment)
    })
    .catch((err) => {
        next(err)
    })
}

function patchArticleByArticleId(request, response, next){
    const articleID = request.params.article_id
    const incVotes = request.body.inc_votes
    
    if (Object.keys(request.body).length !== 1){
        return response.status(400).send({msg: 'bad request'})
    }
    updateArticleByArticleId(articleID, incVotes)
    .then((updatedArticle) => {
        response.status(200).send({updated_article: updatedArticle})
    })
    .catch((err) => {
        next(err)
    })
    
}

module.exports = {getAllTopics, getAllEndpoints, getArticleById, getAllArticles, getCommentsByArticleId, postCommentOnArticleId, patchArticleByArticleId}