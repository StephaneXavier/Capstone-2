const ExpressError = require('../helpers/expressErrors');
const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config')

/** POST /login - login: {username, password} => {token}**/
router.post('/login', async (req, res, next) => {
    const {username, password} = req.body
    console.log('trying to log in')
    try {
        if (!username || !password) {
            throw new ExpressError('Please provide username and password', 401)
        };
        
        const user = await User.get(username);
        
        if (await User.authenticate(username, password)) {
            let payload = { username: user.username };
            let token = jwt.sign(payload, SECRET_KEY);
            User.updateLoginTimestamp(user.username);
            return res.json({ token })
        } else {
            throw new ExpressError('Invald username/password combination', 404)
        }

    } catch (e) {
        return next(e)
    }

})



/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password} => {token}.
 */
router.post('/register', async (req, res, next) => {
    
    try {
        const newUser = await User.register(req.body);
        User.updateLoginTimestamp(newUser.username);
        let token = jwt.sign({ username: newUser.username }, SECRET_KEY);
        return res.json({ token })

    } catch (e) {
        return next(new ExpressError(`username already taken`, 401))
    }

})

module.exports = router;