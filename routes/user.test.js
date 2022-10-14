const request = require("supertest");
const app = require("../app");

const {
    commonAfterAll,
    commonAfterEach,
    commonBeforeAll,
    commonBeforeEach
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('/user/:username', () => {
    test('it should work', async () => {
        const resp = await request(app)
            .get('/user/u1')

        expect(resp.body).toEqual(expect.objectContaining({
            user: {
                username: 'u1',
                join_at: expect.any(String),
                last_login_at: null
            }
        }))

    })
    test('should throw error if user does not exist', async () => {
        const resp = await request(app)
            .get('/user/0')

        expect(resp.statusCode).toBe(404)
    })
    // END OF user/:username
})

describe('/user/submission/:username', () => {

    test('should get submissions from a particular user', async () => {
        const resp = await request(app)
            .get('/user/submission/u1')

        expect(resp.body).toEqual(expect.objectContaining({
            washrooms: [
                {
                    id: expect.any(Number),
                    x_coordinate: '45.01',
                    y_coordinate: '55.12',
                    opens_at: '1200',
                    closes_at: '1500',
                    washroom_type: 'porta-potty'
                },
                {
                    id: expect.any(Number),
                    x_coordinate: '45.06',
                    y_coordinate: '-45.15',
                    opens_at: '',
                    closes_at: '',
                    washroom_type: 'porta-potty'
                }
            ]
        }))
    })
    // END OF user/:username
})