const ExpressError = require('../helpers/expressErrors');
const express = require('express');
const router = new express.Router();
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth')
const Washroom = require('../models/washroom');
const { SECRET_KEY } = require('../config');
const User = require('../models/user');


// route to get all washroom in db
router.get('/', async (req, res, next) => {
    try {

        const washrooms = await Washroom.getAll()
        return res.json({ washrooms: washrooms })
    } catch (e) {
        return next(e)
    }
})

// post new washroom. washroomInfo must contain {xCoordinate, yCoordinate, washroomType}, option to add opensAt and closesAt
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

/* route to get filtered washroom in db. Must contain one of the following params:
- opensAt, closesAt, minX, maxX, minY, maxY, washroomType.
If a coordinate is passed, you must pass in all 4 (min & max of X & Y)
*/ 
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

// gets specific washroom based off of ID
router.get('/search/:washroomId', async (req, res, next) => {
    try {
        const { washroomId } = req.params;
        
        const washroom = await Washroom.getSpecificWashroom(washroomId)
        return res.json({ washroom: washroom })

    } catch (e) {
        return next(e)
    }

})

// deletes washroom based off id
router.delete('/:washroomId', ensureLoggedIn, async (req, res, next) => {
    try {
        
        const { washroomId } = req.params
        const washroomPoster = await Washroom.getSpecificWashroom(washroomId)
        
      
        if (washroomPoster.user_id !== req.user.username) throw new ExpressError('Only poster can delete post')
       

        await Washroom.deleteWashroom(washroomId);

        return res.json({message:`washroom ID ${washroomId} deleted`})
        
    } catch (e) {
        return next(e)
    }
})

// route to patch existing washroom
router.patch('/:washroomId', ensureLoggedIn, async (req, res, next) => {
    try{
       
        const { washroomId } = req.params
        const washroomPoster = await Washroom.getSpecificWashroom(washroomId)
        
        if (washroomPoster.user_id !== req.user.username) throw new ExpressError('Only poster can modify post')
        
        const result = await Washroom.modifyWashroom({washroomInfo:req.body, washroomId})
        
        return res.json({message:'washroom successfully updated!'})
    }catch(e){
        return next(e)
    }
        


})

module.exports = router


