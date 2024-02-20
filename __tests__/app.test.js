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
})