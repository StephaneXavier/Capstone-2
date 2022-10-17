const request = require("supertest");
const app = require("../app");
const Washroom = require('../models/washroom')

const {
    commonAfterAll,
    commonAfterEach,
    commonBeforeAll,
    commonBeforeEach,
    testWashroomIds,
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('GET /washroom', () => {
    test('it gets all washroom', async () => {
        const resp = await request(app)
            .get('/washroom')

        expect(resp.body).toEqual(expect.objectContaining({

            washrooms: [
                {
                    id: expect.any(Number),
                    washroom_type: 'porta-potty',
                    user_id: 'u1',
                    x_coordinate: '45.01',
                    y_coordinate: '55.12',
                    opens_at: '1200',
                    closes_at: '1500'
                },
                {
                    id: expect.any(Number),
                    washroom_type: 'gas-station',
                    user_id: 'u2',
                    x_coordinate: '46.03',
                    y_coordinate: '-54.14',
                    opens_at: '0600',
                    closes_at: '2100'
                },
                {
                    id: expect.any(Number),
                    washroom_type: 'porta-potty',
                    user_id: 'u1',
                    x_coordinate: '45.06',
                    y_coordinate: '-45.15',
                    opens_at: '',
                    closes_at: ''
                }
            ]
        }))
    })
})

describe('POST /washroom', () => {
    test('cannot post washroom if not logged in ', async () => {

        const resp = await request(app)
            .post('/washroom')
            .send({
                washroomType: 'test-washroom',
                xCoordinate: '55',
                yCoordinate: '66',
                opensAt: '1500',
                closesAt: '2000',
            })
        expect(resp.body.status).toBe(401)
    })
    test('posts new washroom when logged in', async () => {
        const tokenResp = await request(app)
            .post('/auth/login')
            .send({
                username: 'u1',
                password: 'pwd1'
            });

        const resp = await request(app)
            .post('/washroom')
            .send({
                washroomType: 'test-washroom',
                xCoordinate: '55',
                yCoordinate: '66',
                opensAt: '1500',
                closesAt: '2000',
                _token: tokenResp.body.token
            })

        expect(resp.body).toEqual(expect.objectContaining({
            message: 'washroom succesfully added',
            washroomId: expect.any(Number)
        }))

        const newWashroom = await Washroom.getSpecificWashroom(resp.body.washroomId)

        expect(newWashroom).toEqual(expect.objectContaining({
            user_id: 'u1',
            washroom_type: 'test-washroom',
            x_coordinate: '55',
            y_coordinate: '66',
            opens_at: '1500',
            closes_at: '2000',
            total_votes: '1'
        }))

    })
})

describe(`GET /washroom/search/:washroomId`, () => {
    test('gets washroom by id', async () => {
        const resp = await request(app)
            .get(`/washroom/search/${testWashroomIds[0]}`)
        expect(resp.body).toEqual(expect.objectContaining({
            washroom: {
                user_id: 'u1',
                washroom_type: 'porta-potty',
                x_coordinate: '45.01',
                y_coordinate: '55.12',
                opens_at: '1200',
                closes_at: '1500',
                total_votes: '2'
            }
        }))
    })
    test('it throws error if washroom does not exist', async () => {
        const resp = await request(app)
            .get(`/washroom/search/0`)

        expect(resp.body.message).toBe('No washroom matching id')
    })
})

describe('GET /washroom/search', () => {
    test('should be able to filter db based on only coordinates', async () => {
        const resp = await request(app)
            .get(`/washroom/search`)
            .query({
                minX: 45.05,
                maxX: 47,
                minY: -55,
                maxY: 1,
            })

        const resp2 = await request(app)
            .get(`/washroom/search`)
            .query({
                minX: 45,
                maxX: 46,
                minY: -50,
                maxY: 56,
            })

        const resp3 = await request(app)
            .get(`/washroom/search`)
            .query({
                minX: 45,
                maxX: 46,
                minY: 10,
                maxY: 56,
            })


        expect(resp.body).toEqual(expect.objectContaining({
            washrooms: [
                {
                    id: expect.any(Number),
                    washroom_type: 'gas-station',
                    x_coordinate: '46.03',
                    y_coordinate: '-54.14',
                    opens_at: '0600',
                    closes_at: '2100'
                },
                {
                    id: expect.any(Number),
                    washroom_type: 'porta-potty',
                    x_coordinate: '45.06',
                    y_coordinate: '-45.15',
                    opens_at: '',
                    closes_at: ''
                }
            ]
        }))

        expect(resp2.body).toEqual(expect.objectContaining({
            washrooms: [
                {
                    id: expect.any(Number),
                    washroom_type: 'porta-potty',
                    x_coordinate: '45.01',
                    y_coordinate: '55.12',
                    opens_at: '1200',
                    closes_at: '1500'
                },
                {
                    id: expect.any(Number),
                    washroom_type: 'porta-potty',
                    x_coordinate: '45.06',
                    y_coordinate: '-45.15',
                    opens_at: '',
                    closes_at: ''
                }
            ]
        }))

        expect(resp3.body).toEqual(expect.objectContaining({
            washrooms: [
                {
                    id: expect.any(Number),
                    washroom_type: 'porta-potty',
                    x_coordinate: '45.01',
                    y_coordinate: '55.12',
                    opens_at: '1200',
                    closes_at: '1500'
                }
            ]
        }))

    })

    test('should work not using coordinates', async () => {
        const resp = await request(app)
            .get(`/washroom/search`)
            .query({
                washroomType: 'porta-potty'
            })
        expect(resp.body).toEqual(expect.objectContaining({
            washrooms: [
                {
                    id: expect.any(Number),
                    washroom_type: 'porta-potty',
                    x_coordinate: '45.01',
                    y_coordinate: '55.12',
                    opens_at: '1200',
                    closes_at: '1500'
                },
                {
                    id: expect.any(Number),
                    washroom_type: 'porta-potty',
                    x_coordinate: '45.06',
                    y_coordinate: '-45.15',
                    opens_at: '',
                    closes_at: ''
                }
            ]
        }))
    })

    test('throw error if no params provided', async () => {
        const resp = await request(app)
            .get(`/washroom/search`)
        expect(resp.body.message).toBe('must provide search params')
        expect(resp.statusCode).toBe(500)
    })

    test('throws error if no matches found with params provided', async () => {
        const resp = await request(app)
            .get(`/washroom/search`)
            .query({
                minX: 47.05,
                maxX: 47,
                minY: -55,
                maxY: 1,
            })
        expect(resp.body.message).toBe('No washrooms found with your search criterias')
        expect(resp.statusCode).toBe(500)
    })

    test('throws error if partial coordinates provided', async () => {
        const resp = await request(app)
            .get(`/washroom/search`)
            .query({
                minX: 45.05,
                maxX: 47,
                minY: -55,
            })
        expect(resp.body.message).toBe('Either put min / max for x and y axis, or omit coordinates')
        expect(resp.statusCode).toBe(500)
    })
})

describe('DELETE /washroom/:washroomId', () => {
    test('should delete washroom if it exists', async () => {
        const tokenResp = await request(app)
            .post('/auth/login')
            .send({
                username: 'u1',
                password: 'pwd1'
            });

        const resp = await request(app)
            .delete(`/washroom/${testWashroomIds[0]}`)
            .send({ _token: tokenResp.body.token })

        const isDeleted = await request(app)
            .get(`/washroom/search/${testWashroomIds[0]}`)

        expect(isDeleted.body.message).toBe('No washroom matching id')
        expect(resp.statusCode).toBe(200)
    })

    test('throws error if washroom does not exist', async () => {
        const tokenResp = await request(app)
            .post('/auth/login')
            .send({
                username: 'u1',
                password: 'pwd1'
            });

        const resp = await request(app)
            .delete(`/washroom/0`)
            .send({ _token: tokenResp.body.token })

        expect(resp.body.message).toBe("No washroom matching id")
    })
})

describe('PATCH /washroom/:washroomId', () => {
    test('should patch existing washroom', async () => {
        const tokenResp = await request(app)
            .post('/auth/login')
            .send({
                username: 'u1',
                password: 'pwd1'
            });

        const resp = await request(app)
            .patch(`/washroom/${testWashroomIds[0]}`)
            .send({
                washroomType: 'test-washroom',
                opensAt: '0000',
                closesAt: '0000',
                _token: tokenResp.body.token
            })

        expect(resp.statusCode).toBe(200)

        const resp2 = await request(app)
            .get(`/washroom/search/${testWashroomIds[0]}`)
        expect(resp2.body).toEqual(expect.objectContaining({
            washroom: {
                user_id: 'u1',
                washroom_type: 'test-washroom',
                x_coordinate: '45.01',
                y_coordinate: '55.12',
                opens_at: '0000',
                closes_at: '0000',
                total_votes: '2'
            }
        }))
    })

    test("it should throw error if you try to modify someone else's post", async () => {
        const tokenResp = await request(app)
            .post('/auth/login')
            .send({
                username: 'u1',
                password: 'pwd1'
            });

        const resp = await request(app)
            .patch(`/washroom/${testWashroomIds[1]}`)
            .send({
                washroomType: 'test-washroom',
                _token: tokenResp.body.token
            })
        expect(resp.statusCode).toBe(500)
        expect(resp.body.message).toBe('Only poster can modify post')
    })

})