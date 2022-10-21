const ExpressError = require('../helpers/expressErrors');
const express = require('express');
const router = new express.Router();
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth')
const User = require('../models/user');
const { SECRET_KEY, DB_URI } = require('../config')



// returns {username, join_at, last_login_at}
router.get('/:username', async (req, res, next) => {
    try {

        const { username } = req.params
        const user = await User.get(username)
        return res.json({ user: user })

    } catch (e) {
        return next(e)
    }

})

/* get all the posts submitted by a particular user
{
washrooms:[
    {
        id: expect.any(Number),
        longitude: '45.01',
        latitude: '55.12',
        opens_at: '1200',
        closes_at: '1500',
        washroom_type: 'porta-potty'
    }, etc...
]
}
*/
router.get('/submission/:username', ensureLoggedIn, async (req, res, next) => {
    try {
        const { username } = req.params
        const washrooms = await User.getUserPosts(username)

        return res.json({ washrooms: washrooms })
    } catch (e) {
        return next(e)
    }
})


module.exports = router