const ExpressError = require('../helpers/expressErrors');
const express = require('express');
const router = new express.Router();
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth')
const Vote = require('../models/vote');
const { DB_URI } = require('../config');
const { json } = require('express');


/* Retrieves the vote of a specified user on a specific post
*/ 
router.get('/:washroomId', ensureLoggedIn, async (req, res, next) => {
    
    try {
        
        const { washroomId } = req.params;
        const result = await Vote.getVote({ washroomId, username: req.user.username })

        if (!result) throw new ExpressError('No votes yet')
        debugger
        if (result.upvote === 1) return res.json({ vote: result })
        else return res.json({ vote: result })

    } catch (e) {
        return next(e)
    }
})

router.post('/:voteType/:washroomId', ensureLoggedIn, async (req, res, next) => {
    try {
        const { washroomId, voteType } = req.params;
        const { username } = req.user

        const result = await Vote.submitVote({ username, washroomId, voteType })

        return res.json({ message: `post_id ${washroomId} has been ${voteType}d by ${username}` })

    } catch (e) {
        return next(e)
    }
})

router.delete('/:washroomId', ensureLoggedIn, async (req, res, next) => {
    try {
        const { washroomId } = req.params;
        const { username } = req.user
        const voteInfo = await Vote.getVote({ washroomId, username })

        if (voteInfo.length === 0) throw new ExpressError('no vote for post/username combo')

        await Vote.removeVote({ washroomId, username })

        return res.json({ message: `vote deleted` })
    } catch (e) {
        return next(e)
    }
})




module.exports = router