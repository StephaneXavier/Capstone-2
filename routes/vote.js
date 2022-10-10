const ExpressError = require('../helpers/expressErrors');
const express = require('express');
const router = new express.Router();
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth')
const Vote = require('../models/vote');
const { DB_URI } = require('../config');
const { json } = require('express');

router.get('/:washroomId', async (req, res, next) => {

    try{
        debugger
        const {washroomId} = req.params;

        const result = await Vote.getVote({washroomId, username:req.user.username})

        if(result.length === 0) throw new ExpressError('No votes yet')

        if(result[0].upvote ===1) return res.json({vote: 'upvote'})
        else return res.json({vote:'downvote'})

    }catch(e){
        return next(e)
    }
})

router.post('/:voteType/:washroomId', ensureLoggedIn, async (req, res, next) => {
    try{
        const {washroomId, voteType} = req.params;
        const {username} = req.user
        
        const result = await Vote.submittVote({username, washroomId, voteType})
        
        return res.json({message:`post_id ${washroomId} has been ${voteType}d by ${username}`})

    }catch(e){
        return next(e)
    }
})

router.delete('/:washroomId', async (req, res, next) => {
    try{
        const {washroomId} = req.params;
        const {username} = req.user
        const voteInfo = await Vote.getVote({washroomId, username})
        
        if(voteInfo.length === 0) throw new ExpressError('no vote for post/username combo') 

        await Vote.removeVote({washroomId, username})

        return res.json({message:`vote deleted`})
    }catch(e){
        return next(e)
    }
})




module.exports = router