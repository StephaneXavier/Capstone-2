const express = require('express');
const app = express();
const ExpressError = require("./helpers/expressErrors");
const {authenticateJWT} = require('./middleware/auth')

app.use(express.json());
app.use(authenticateJWT)

const authRoutes = require('./routes/auth')
const washroomRoutes = require('./routes/washroom')



app.use("/auth", authRoutes)
app.use("/washroom", washroomRoutes)


app.use(function(req, res, next) {
    const err = new ExpressError("Not Found", 404);
  
    // pass the error to the next piece of middleware
    return next(err);
  });
  
  /** general error handler */
  
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
  
    return res.json({
      status: err.status,
      message: err.message
    });
  });
  
  module.exports = app;