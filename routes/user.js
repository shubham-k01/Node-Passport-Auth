const express = require('express')
const { registerUser, loginUser, logoutUser } = require('../controllers/user')
const router = express.Router()
const {forwardAuthenticated} = require('../config/auth')

router.get('/login',forwardAuthenticated,(req,res)=>{
    res.render('login')
})
router.get('/register',forwardAuthenticated,(req,res)=>{
    res.render('register')
})

router.post('/register',registerUser)

router.post('/login',loginUser)

router.get('/logout',logoutUser)

module.exports = router