const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** Middleware: Authenticate user. */

function authenticateJWT(req, res, next) {
    try {
        const tokenFromBody = req.body._token;
        const payload = jwt.verify(tokenFromBody, SECRET_KEY);

        req.user = payload; // create a current user
        return next();
    } catch (err) {
        return next();
    }
}

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
    if (!req.user) {
        return next({ status: 401, message: "Unauthorized" });
    } else {
        return next();
    }
}

/** Middleware: Requires correct username. */
// if we have a req.user (authenticatJWT added the user), then we check to see
// if the req.user is the same as what is being passed in the req.params
function ensureCorrectUser(req, res, next) {
    try {
        if (req.user.username === req.params.username) {
            return next();
        } else {
            return next({ status: 401, message: "Unauthorized" });
        }
    } catch (err) {
        // errors would happen here if we made a request and req.user is undefined
        return next({ status: 401, message: "Unauthorized" });
    }
}
// end

module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureCorrectUser
};