const ExpressError = require('../helpers/expressErrors');
const express = require('express');
const router = new express.Router();
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth')
const Washroom = require('../models/washroom');
const { SECRET_KEY } = require('../config');
const User = require('../models/user');


router.get('/', async (req, res, next) => {
    try {

        const washrooms = await Washroom.getAll()
        return res.json({ washrooms: washrooms })
    } catch (e) {
        return next(e)
    }
})


router.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
        
        const washroomInfo = req.body
        const username = req.user.username

        const result = await Washroom.submitNewWahsroom({ username, washroomInfo })
        return res.json({ message: 'washroom succesfully added', washroomId: result })

    } catch (e) {
        return next(e)
    }

})

router.get('/search', async (req, res, next) => {
    try {

        const searchParams = req.query;

        const washrooms = await Washroom.getFilteredWashrooms(searchParams);

        if (washrooms.length === 0) throw new ExpressError('No washrooms found with your search criterias')

        return res.json({ washrooms: washrooms })
    } catch (e) {
        return next(e)
    }

})

router.get('/search/:washroomId', async (req, res, next) => {
    try {
        const { washroomId } = req.params;

        const washroom = await Washroom.getSpecificWashroom(washroomId)
        return res.json({ washroom: washroom })

    } catch (e) {
        return next(e)
    }

})

router.delete('/:washroomId', ensureLoggedIn, async (req, res, next) => {
    try {
        
        const { washroomId } = req.params
        const washroomPoster = await Washroom.getSpecificWashroom(washroomId)
        debugger
        if(washroomPoster.length === 0) throw new ExpressError('washroom does not exist')
        if (washroomPoster[0].user_id !== req.user.username) throw new ExpressError('Only poster can delete post')
       

        await Washroom.deleteWashroom(washroomId);

        return res.json({message:`washroom ID ${washroomId} deleted`})
        
    } catch (e) {
        return next(e)
    }
})

router.patch('/:washroomId', ensureLoggedIn, async (req, res, next) => {
    try{
        const { washroomId } = req.params
        const washroomPoster = await Washroom.getSpecificWashroom(washroomId)
        // debugger
        if(washroomPoster.length === 0) throw new ExpressError('washroom does not exist')
        if (washroomPoster[0].user_id !== req.user.username) throw new ExpressError('Only poster can modify post')
        
        const result = await Washroom.modifyWashroom({washroomInfo:req.body, washroomId})
        
        return res.json({message:'washroom successfully updated!'})
    }catch(e){
        return next(e)
    }
        


})

module.exports = router


