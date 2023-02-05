require('dotenv').config()
require('express-async-errors')
const express = require('express')
const passport = require('passport')
const start = require('./connectDb')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')

require('./config/passport')(passport)
const app = express()
const port = process.env.PORT

mongoose.set('strictQuery', false);

// EJS
// app.use(expressLayouts) should be before setting the view engine
app.use(expressLayouts)
app.set('view engine','ejs')

// bodyParser is now inbuilt into express
app.use(express.urlencoded({extended:false}))

// express-session
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}))

// passport should be after the session middleware
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
// flash is required when we pass some information while we redirect from one endpoint to another
// flash messages are different than rendering views
// flash also requires session to pass messages
app.use(flash())

// Global Vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

app.use('/',require('./routes/index'))
app.use('/users',require('./routes/user'))



app.listen(port,async ()=>{
    try {
        console.log(`Server is running on port ${port}`)
        await start(process.env.MONGO_URI)
    } catch (error) {
        console.log(error)
    }
})