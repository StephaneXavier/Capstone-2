const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

const {authenticateJWT, ensureLoggedIn} = require('./auth')

const testJWT = jwt.sign({username:'George'}, SECRET_KEY)
const badJWT = jwt.sign({username:'Paris'},'wrong')


describe('authenticateJWT', () => {
    
    test('works with valid token, adds _token to req', () => {
        const req = {body:{_token:testJWT}};
        const res = {};
        const next = function(err) {
            expect(err).toBeFalsy();
        };

        authenticateJWT(req, res, next);
        expect(req.user.username).toBe('George')
        expect(req.user.iat).toEqual(expect.any(Number))
    })

    test('throws error when invalid token provided', () => {
        const req = {body:{_token:badJWT}};
        const res = {};
        const next = function(err) {
            expect(err).toBeFalsy();
        };
        
        authenticateJWT(req, res, next);
        expect(req.user).toEqual(null)
    })
    
})


describe('ensureLoggedIn', () => {

    test('works when user is logged in', () => {
        const req = {body:{_token:testJWT}, user: {username:'George', iat:123456}};
        const res = {};
        const next = function(err) {
            expect(err).toBeFalsy();
        };

        ensureLoggedIn(req, res, next);
    })

    test('throw error when user is not logged in', () => {
        const req = {body:{_token:badJWT}};
        const res = {};
        const next = function(err) {
            expect(err).toEqual({ status: 401, message: "Unauthorized" });
        };

        ensureLoggedIn(req, res, next);
    })
})