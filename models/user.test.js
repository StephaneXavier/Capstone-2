const db = require('../db');
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
        const user = await User.authenticate({username:'u1', password:'pwd1'})

        expect(user).toBeTruthy()
    })
})