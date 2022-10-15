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
        debugger
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