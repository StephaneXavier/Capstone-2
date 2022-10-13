const db = require('../db');
const ExpressError = require('../helpers/expressErrors')
const User = require('./user');
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


describe('authenticate', () => {
    test('should work with user that exists and proper password', async () => {
        const user = await User.authenticate('u1', 'pwd1')
        expect(user).toBeTruthy()
    })
    test('should throw error if username / password combination incorrect', async () => {
        const user = await User.authenticate('u1', 'pwd2')
        const user2 = await User.authenticate('u2', 'badpwd')

        expect(user).toBeFalsy();
        expect(user2).toBeFalsy();
    })
})

describe('get', () => {
    test('should get the user information', async () => {
        const user = await User.get('u1')

        expect(user.username).toBe('u1')
        expect(user.join_at).toEqual(expect.any(Object))
        expect(user.last_login_at).toBe(null)
    })
    test('should throw error if user does not exist', async () => {
        try {
            const user = await User.get('u5')
        } catch (e) {
            expect(e.message).toBe('username does not exit')
            expect(e).toBeInstanceOf(ExpressError)
        }
    })
})

describe('udpateLoginTimestamp', () => {
    test('should update user last_login_at', async () => {

        await User.updateLoginTimestamp('u1')
        const user = await User.get('u1')
        expect(user.last_login_at).toBeTruthy()
    })
})

describe('getUserPosts', () => {
    test('should get the user post information', async () => {
        const userPosts = await User.getUserPosts('u1')
        const user2Posts = await User.getUserPosts('u2')
        expect(userPosts.length).toBe(2)
        expect(user2Posts[0].washroom_type).toBe('gas-station')
    })
    test('should throw error if user has not submitted any washrooms', async () => {
        try {
            const userPost = await User.getUserPosts('u3')
        } catch (e) {
            expect(e).toBeInstanceOf(ExpressError)
            expect(e.message).toBe('no posts for user')
        }
    })
})


