const ExpressError = require('../helpers/expressErrors');
const express = require('express');
const router = new express.Router();
const {ensureLoggedIn} = require('../middleware/auth')
const Washroom = require('../models/washroom');
const { SECRET_KEY } = require('../config')


router.get('/', async(req, res, next) => {
    try{
        const washrooms = await Washroom.get()
        return res.json({washrooms: washrooms})
    }catch(e){
        return next(e)
    }
})


router.post('/', ensureLoggedIn , async(req,res,next) => {
    try{
        
        const {washroomType, xYCoordinates, opensAt, closesAt} = req.body

    }catch(e){
        return next(e)
    }
})

module.exports = router


