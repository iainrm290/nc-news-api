const app = require('../app.js')
const request = require('supertest')
const db = require('../db/connection.js')
const data = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')

beforeEach(() => seed(data))
afterAll(() => db.end())

describe ('app', () => {
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
})