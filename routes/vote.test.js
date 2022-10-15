const request = require("supertest");
const app = require("../app");

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

describe('/vote/:washroomId', () => {
    test('it should retrieve the upvote of a user on a post', async () => {

        const tokenResp = await request(app)
            .post('/auth/login')
            .send({
                username: 'u1',
                password: 'pwd1'
            });

        const resp = await request(app)
            .get(`/vote/${testWashroomIds[0]}`)
            .send({
                _token: tokenResp.body.token
            })

        expect(resp.body).toEqual(expect.objectContaining({
            vote: {
                id: expect.any(Number),
                post_id: expect.any(Number),
                upvote: 1,
                user_id: "u1",
            }

        })
        )
    })

    test('it should retrieve the downvote of a user on a post', async () => {

        const tokenResp = await request(app)
            .post('/auth/login')
            .send({
                username: 'u1',
                password: 'pwd1'
            });

        const resp = await request(app)
            .get(`/vote/${testWashroomIds[1]}`)
            .send({
                _token: tokenResp.body.token
            })

        expect(resp.body).toEqual(expect.objectContaining({
            vote: {
                id: expect.any(Number),
                post_id: expect.any(Number),
                upvote: 0,
                user_id: "u1",
            }
        }))
    })
    test('it should throw an error if there are no votes yet', async () => {
        const tokenResp = await request(app)
            .post('/auth/login')
            .send({
                username: 'u3',
                password: 'pwd3'
            });

        try {
            const resp = await request(app)
                .get(`/vote/${testWashroomIds[0]}`)
                .send({
                    _token: tokenResp.body.token
                })
        } catch (e) {
            expect(e.message).toBe('No votes yet')
        }

    })
    test('it should throw error if not logged in', async () => {
        try {
            const resp = await request(app)
                .get(`/vote/${testWashroomIds[0]}`)

        } catch (e) {
            expect(e.statusCode).toBe(401)
        }
    })
    // END OF /vote/:washroomId
})


describe('DELETE /:voteId', () => {
    test('should delete selected washroom', async () => {
        try {
            const tokenResp = await request(app)
                .post('/auth/login')
                .send({
                    username: 'u1',
                    password: 'pwd1'
                });

            const respPreDeletion = await request(app)
                .get(`/vote/${testWashroomIds[0]}`)
                .send({
                    _token: tokenResp.body.token
                })

            await request(app)
                .delete(`/vote/${testWashroomIds[0]}`)
                .send({ _token: tokenResp.body.token })

            const respPostDeletion = await request(app)
                .get(`/vote/${testWashroomIds[0]}`)
                .send({
                    _token: tokenResp.body.token
                })

        } catch (e) {
            expect(e.message).toBe('No votes yet')
        }
    })

    test('should throw error if no vote exists', async () => {
            try{
                const tokenResp = await request(app)
                .post('/auth/login')
                .send({
                    username: 'u3',
                    password: 'pwd3'
                });

                await request(app)
                .delete(`/vote/${testWashroomIds[0]}`)
                .send({ _token: tokenResp.body.token })
            }catch(e){
                expect(e.messaget).toBe('No votes yet')
            }
    })
})


