const request = require("supertest");
const app = require("../app");

const {
    commonAfterAll,
    commonAfterEach,
    commonBeforeAll,
    commonBeforeEach
} = require('./_testCommon');

describe('Register', () => {
    test('it should work', async () => {
        const resp = await request(app)
            .post('/auth/register')
            .send({
                username: 'u4',
                password: 'pwd4'
            })
        expect(resp.body).toEqual({
            "token": expect.any(String)
        })
    })
    test('it should throw error if username already taken', async () => {
        const resp = await request(app)
            .post('/auth/register')
            .send({
                username: 'u3',
                password: 'pwd4'
            })
        expect(resp.statusCode).toEqual(401)
    })
    //END OF REGISTER 
})

describe('Login', () => {
    test('it should work', async() => {
        const resp = await request(app)
            .post('/auth/login')
            .send({
                username: 'u3',
                password: 'pwd3'
            })
        expect(resp.body).toEqual({
            "token": expect.any(String)
        })
    })
    test('it throw error if password/username combo is incorrect', async() => {
        const resp = await request(app)
            .post('/auth/login')
            .send({
                username: 'u2',
                password: 'pwd3'
            })
        expect(resp.statusCode).toEqual(401)
    })
    test('it prevents user that is not logged in from adding to req.user', async() => {
        const resp = await request(app)
            .post('/auth/login')
            .send({
                username: 'u2',
                password: 'pwd2'
            })
    })
    
})

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);