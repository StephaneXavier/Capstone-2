const ExpressError = require('../helpers/expressErrors');
const express = require('express');
const router = new express.Router();
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth')
const Vote = require('../models/vote');
const { DB_URI } = require('../config');
const { json } = require('express');

router.get('/:washroomId', async (req, res, next) => {

    try{
        const {wahsroomId} = req.params;

        const result = await Vote.getVote({wahsroomId, username:req.user.username})

        if(result.rows.length === 0) throw new ExpressError('No votes yet')

        if(result.rows[0].upvote ===1) return res.json({vote: 'upvote'})
        else return res.json({vote:'downvote'})

    }catch(e){
        return next(e)
    }
})

router.post('/:vote/:washroomId', ensureLoggedIn, async (req, res, next) => {
    try{
        const {washroomId, vote} = req.params;
        
        if(vote === 'upvote'){
          await Vote.upvote({washroomId, username: req.user.username})
          return res.json({message: 'upvoted'})
        }else if(vote === 'downvote'){
            await Vote.upvote({washroomId, username:req.user.username})
        }


    }catch(e){
        return next(e)
    }
})




module.exports = router