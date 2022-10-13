const db = require('../db');
const ExpressError = require('../helpers/expressErrors');
const { submittVote } = require('./vote');
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
        const vote = await Vote.getVote({ washroomId: testWashroomIds[0], username: 'u1' })

        expect(vote.upvote).toBe(1)
        expect(vote.id).toEqual(expect.any(Number))
        expect(vote.post_id).toEqual(expect.any(Number))
        expect(vote.user_id).toEqual('u1')
    })
})

describe('upvote - downvote - updatevote', () => {
    test('upvote function works', async () => {
        await Vote.upvote({ washroomId: testWashroomIds[0], username: 'u3' })
        const vote = await Vote.getVote({ washroomId: testWashroomIds[0], username: 'u3' })

        expect(vote.upvote).toBe(1)
    })
    test('downvote function works', async () => {
        await Vote.downvote({ washroomId: testWashroomIds[1], username: 'u3' })
        const vote = await Vote.getVote({ washroomId: testWashroomIds[1], username: 'u3' })

        expect(vote.upvote).toBe(0)
    })
    test('update function works', async () => {
        const votePreUpdate = await Vote.getVote({ washroomId: testWashroomIds[0], username: 'u1' })
        await Vote.updateVote({ washroomId: testWashroomIds[0], username: 'u1', currentVote: 1 })
        const votePostUpdate = await Vote.getVote({ washroomId: testWashroomIds[0], username: 'u1' })

        expect(votePreUpdate.upvote).toBe(1)
        expect(votePostUpdate.upvote).toBe(0)
    })
})

describe('SubmittVote', () => {
    test('it adds upvote to post without any current upvote from user', async () => {

        await submittVote({ washroomId: testWashroomIds[0], username: 'u3', voteType: 'upvote' })
        const vote = await Vote.getVote({ washroomId: testWashroomIds[0], username: 'u3' })

        expect(vote.upvote).toBe(1)
        expect(vote.user_id).toBe('u3')
        expect(vote.post_id).toBe(testWashroomIds[0])
    })
    test('it adds downvote to post without current downvote from user', async () => {
        await submittVote({ washroomId: testWashroomIds[1], username: 'u3', voteType: 'downvote' })
        const vote = await Vote.getVote({ washroomId: testWashroomIds[1], username: 'u3' })

        expect(vote.upvote).toBe(0)
        expect(vote.user_id).toBe('u3')
        expect(vote.post_id).toBe(testWashroomIds[1])
    })
    test('it turns an upvote into a downvote for a post that user has already voted on', async () => {
        await submittVote({ washroomId: testWashroomIds[0], username: 'u1', voteType: 'downvote' })
        const vote = await Vote.getVote({ washroomId: testWashroomIds[0], username: 'u1' })

        expect(vote.upvote).toBe(0)
        expect(vote.user_id).toBe('u1')
        expect(vote.post_id).toBe(testWashroomIds[0])
    })
    test('it turns an downvote into a upvote for a post that user has already voted on', async () => {
        await submittVote({ washroomId: testWashroomIds[1], username: 'u1', voteType: 'upvote' })
        const vote = await Vote.getVote({ washroomId: testWashroomIds[1], username: 'u1' })

        expect(vote.upvote).toBe(1)
        expect(vote.user_id).toBe('u1')
        expect(vote.post_id).toBe(testWashroomIds[1])
    })
    test('it throws error if user tries to upvote with when already upvoted', async () => {
        try {
            await submittVote({ washroomId: testWashroomIds[0], username: 'u1', voteType: 'upvote' })
        } catch (e) {
            expect(e).toBeInstanceOf(ExpressError)
            expect(e.message).toEqual(`can't upvote twice`)
        }
    })
    test('it throws error if user tries to downvote with when already downvoted', async () => {
        try {
            await submittVote({ washroomId: testWashroomIds[1], username: 'u1', voteType: 'downvote' })
        } catch (e) {
            expect(e).toBeInstanceOf(ExpressError)
            expect(e.message).toEqual(`can't downvote twice`)
        }
    })
})

describe('removeVote', () => {
    test('it removes vote', async () => {
        const votePreRemoval = await Vote.getVote({ washroomId: testWashroomIds[0], username: 'u1' })
        await Vote.removeVote({washroomId:testWashroomIds[0], username:'u1'})
        const votePostRemoval = await Vote.getVote({ washroomId: testWashroomIds[0], username: 'u1' })

        expect(votePreRemoval).toBeTruthy()
        expect(votePostRemoval).toBe(undefined)
    })
})