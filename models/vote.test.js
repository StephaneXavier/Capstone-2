const db = require('../db');
const ExpressError = require('../helpers/expressErrors')
const Vote = require('./vote');
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

describe('getVote', () => {
    test('should work if vote for post exists', async () => {
        const vote = await Vote.getVote({washroomId:testWashroomIds[0], username:'u1'})
        
        expect(vote.upvote).toBe(1)
        expect(vote.id).toEqual(expect.any(Number))
        expect(vote.post_id).toEqual(expect.any(Number))
        expect(vote.user_id).toEqual('u1')
    })
})

describe('upvote - downvote - updatevote', () => {
    test('upvote function works', async() => {
        await Vote.upvote({washroomId:testWashroomIds[0], username:'u3'})
        const vote = await Vote.getVote({washroomId:testWashroomIds[0], username:'u3'})
        
        expect(vote.upvote).toBe(1)
    })
    test('downvote function works', async() => {
        await Vote.downvote({washroomId:testWashroomIds[1], username:'u3'})
        const vote = await Vote.getVote({washroomId:testWashroomIds[1], username:'u3'})
        
        expect(vote.upvote).toBe(0)
    })
    test('update function works', async() => {
        console.log('*************')
        console.log()
        await Vote.updateVote({washroomId:testWashroomIds[0], username:'u1', currentVote:1})
        const vote = await Vote.getVote({washroomId:testWashroomIds[0], username:'u1'})
        
        expect(vote.upvote).toBe(0)
    })

})