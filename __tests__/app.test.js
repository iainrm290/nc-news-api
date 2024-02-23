const app = require('../app.js')
const request = require('supertest')
const db = require('../db/connection.js')
const data = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')
const endpointsFile = require('../endpoints.json')

beforeEach(() => seed(data))
afterAll(() => db.end())

describe('app', () => {
    describe('GET /api/topics', () => {
        test('200: responds with status 200 for successful request', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
        })
        test('responds with an array of objects each containing a slug and description property', () => {
            return request(app)
                .get('/api/topics')
                .then((response) => {
                    const topics = response.body.topics
                    expect(topics).toHaveLength(3)
                    topics.forEach((topic) => {
                        expect(topic).toHaveProperty('slug', expect.any(String))
                        expect(topic).toHaveProperty('description', expect.any(String))
                    })
                })
        })
    })
    describe('GET /api', () => {
        test('responds with an object containing all available endpoints', () => {
            return request(app)
                .get('/api')
                .expect(200)
                .then((response) => {
                    const endPoints = response.body.endpoints
                    expect(endPoints).toEqual(endpointsFile)
                })
        })
        test('each endpoint contains a description, queries, and exampleResponse property', () => {
            return request(app)
                .get('/api')
                .expect(200)
                .then((response) => {
                    const endPoints = response.body.endpoints
                    for (const value in endPoints) {
                        expect(endPoints[value]).toHaveProperty('description', expect.any(String))
                        expect(endPoints[value]).toHaveProperty('queries', expect.any(Array))
                        expect(endPoints[value]).toHaveProperty('exampleResponse', expect.any(Object))
                    }
                })
        })
    })
    describe('GET /api/articles/:article_id', () => {
        test('200: responds with status 200 for successful request', () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
        })
        test('responds with the article object which matches the requested article id', () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then((response) => {
                    const article = response.body.article
                    const articleOne = {
                        article_id: 1,
                        title: "Living in the shadow of a great man",
                        topic: "mitch",
                        author: "butter_bridge",
                        body: "I find this existence challenging",
                        created_at: '2020-07-09T20:11:00.000Z',
                        votes: 100,
                        article_img_url:
                            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    }
                    expect(article).toEqual(articleOne)
                })
        })
        test('400: responds with a 400 error for an invalid request', () => {
            return request(app)
                .get('/api/articles/music')
                .expect(400)
                .then((response) => {
                    const err = response.body
                    expect(err.msg).toBe('bad request')
                })
        })
        test('404: responds with a 404 for a valid id which does not exist', () => {
            return request(app)
                .get('/api/articles/1000')
                .expect(404)
                .then((response) => {
                    const errMsg = response.body.msg
                    expect(errMsg).toBe('no article with that id')
                })
        })
    })
    describe('GET api/articles', () => {
        test('200: responds with status 200 for successful request', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
        })
        test('responds with an array of the correct length representing all articles', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then((response) => {
                    const articles = response.body.articles
                    expect(articles).toHaveLength(13)
                })
        })
        test('responds with an array of article objects without a body property', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then((response) => {
                    const articles = Object.keys(response.body.articles[0])
                    expect(articles).toEqual([
                        'article_id',
                        'author',
                        'title',
                        'topic',
                        'created_at',
                        'votes',
                        'article_img_url',
                        'comment_count'
                    ])
                })

        })
        test('responds with an array of articles sorted by date in descending order', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then((response) => {
                    const articles = response.body.articles
                    expect(articles).toBeSortedBy('created_at', { descending: true })
                })
        })

    })
    describe('GET /api/articles/:article_id/comments', () => {
        test('200: responds with status 200 for successful request', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
        })


        test('responds with an array of comment objects each with the required properties', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then((response) => {
                    const comments = Object.keys(response.body.comments[0])

                    expect(comments).toEqual(['comment_id', 'body', 'article_id', 'author', 'votes', 'created_at'])
                })
        })
        test('responds with an array of comments of the expected length sorted by date in descending order', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then((response) => {
                    const comments = response.body.comments
                    expect(comments).toHaveLength(11)
                    expect(comments).toBeSortedBy('created_at', { descending: true })
                })
        })
        test('404: responds with status 404 for an article id that has no comments', () => {
            return request(app)
                .get('/api/articles/2/comments')
                .expect(404)
                .then((response) => {
                    const err = response.body
                    expect(err.msg).toBe('no comments for that article')
                })
        })
        test('400: responds with status 400 for an invalid request', () => {
            return request(app)
                .get('/api/articles/music/comments')
                .expect(400)
                .then((response) => {
                    const err = response.body
                    expect(err.msg).toBe('bad request')
                })
        })
    })
    describe('POST /api/articles/:article_id/comments', () => {
        test('201: responds with a 201 for a successful request', () => {
            return request(app)
                .post('/api/articles/2/comments')
                .expect(201)
                .send({
                    username: 'lurker',
                    body: '1 2, 1 2, this is just, a, test'
                })
        })
        test('responds with the posted comment', () => {
            return request(app)
                .post('/api/articles/2/comments')
                .expect(201)
                .send({
                    username: 'lurker',
                    body: '1 2, 1 2, this is just, a, test'
                })
                .then((response) => {
                    expect(response.body).toEqual({
                        comment_id: 19,
                        body: '1 2, 1 2, this is just, a, test',
                        article_id: 2,
                        author: 'lurker',
                        votes: 0,
                        created_at: expect.any(String)
                    })
                })
        })
        test('400: responds with status 400 for an invalid request', () => {
            return request(app)
                .post('/api/articles/music/comments')
                .expect(400)
                .then((response) => {
                    const err = response.body
                    expect(err.msg).toBe('bad request')
                })
        })
        test('404: responds with a 404 if username does not exist', () => {
            return request(app)
                .post('/api/articles/2/comments')
                .expect(404)
                .send({
                    username: 'bernard',
                    body: '1 2, 1 2, this is just, a, test'
                })
                .then((response) => {
                    const err = response.body
                    expect(err.msg).toBe('does not exist')
                })
        })
        test('404: responds with a 404 if article does not exist', () => {
            return request(app)
                .post('/api/articles/1000/comments')
                .expect(404)
                .send({
                    username: 'bernard',
                    body: '1 2, 1 2, this is just, a, test'
                })
                .then((response) => {
                    const err = response.body
                    expect(err.msg).toBe('does not exist')
                })
        })
        test('400: responds with a 400 if request body is not as expected', () => {
            return request(app)
                .post('/api/articles/2/comments')
                .expect(400)
                .send({
                    body: '1 2, 1 2, this is just, a, test'
                })
                .then((response) => {
                    const err = response.body
                    expect(err.msg).toBe('bad request')
                })
        })
    })
    describe('PATCH /api/articles/:article_id', () => {
        test('200: responds with 200 for a succesful request', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({inc_votes: 1})
            .expect(200)
        })
        test('responds with the updated article', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({inc_votes: 1})
            .expect(200)
            .then((response) => {
                expect(response.body.updated_article).toEqual({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 101,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                })
            })
            
        })
        test('responds with the updated article with votes decremented if given a minus number', () => {
            return request(app)
            .patch('/api/articles/1')
            .send({inc_votes: -1})
            .expect(200)
            .then((response) => {
                expect(response.body.updated_article.votes).toEqual(99)
            })
            
        })
        test('404: responds with a 404 if article does not exist', () => {
            return request(app)
                .patch('/api/articles/1000')
                .expect(404)
                .send({inc_votes: 1})
                .then((response) => {
                    const err = response.body
                    expect(err.msg).toBe('no article with that id')
                })
        })
        test('400: responds with a 400 for an invalid request', () => {
            return request(app)
                .patch('/api/articles/music')
                .expect(400)
                .send({inc_votes: 1})
                .then((response) => {
                    const err = response.body
                    expect(err.msg).toBe('bad request')
                })
        })
        test('400: responds with a 400 if request body is not as expected', () => {
            return request(app)
                .patch('/api/articles/1')
                .expect(400)
                .send({
                    username: 'bernard',
                    body: '1 2, 1 2, this is just, a, test'
                })
                .then((response) => {
                    const err = response.body
                    expect(err.msg).toBe('bad request')
                })
        })
    })
    describe('DELETE /api/comments/:comment_id', () => {
        test('204: responds with 204 for successful delete request', () => {
            return request(app)
                .delete('/api/comments/1')
                .expect(204)
        })
        test('404: responds with 404 if comment_id does not exist', () => {
            return request(app)
                .delete('/api/comments/1000')
                .expect(404)
        })
        test('400: responds with 400 for an invalid request', () => {
            return request(app)
                .delete('/api/comments/music')
                .expect(400)
                .then((response) => {
                    const err = response.body
                    expect(err.msg).toBe('bad request')
                })
                
        })
    })
    describe('GET /api/users', () => {
        test('200: responds with 200 for a successful request', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
        })
        test('responds with an array of all user objects, each with username, name, and avatar_url properties', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                const users = response.body.users
                expect(users).toHaveLength(4)
                for (const user of users) {
                    expect(user).toHaveProperty('username', expect.any(String))
                    expect(user).toHaveProperty('name', expect.any(String))
                    expect(user).toHaveProperty('avatar_url', expect.any(String))
                }   
            })
        })
    })
    describe('GET /api/articles?topic=', () => {
        test('responds with array of article objects filtered by the query topic', () => {
            return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then((response) => {
                const articles = response.body.articles
                expect(articles).toHaveLength(1)
                expect(articles[0].topic).toEqual('cats')
            })
        })
        test('400: responds with 400 for invalid request', () => {
            return request(app)
            .get('/api/articles?topic=invalidTopic')
            .expect(400)
            .then((response) => {
                const err = response.body
                expect(err.msg).toBe('bad request')
            })
        })
        test('200: responds with empty array for valid topic with no associated articles', () => {
            return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then((response) => {
                const articles = response.body.articles
                expect(articles).toHaveLength(0)
            })
        })
    })

})

