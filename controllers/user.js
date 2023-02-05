const User = require("../models/User");
const bcrypt = require('bcryptjs');
const passport = require("passport");


const registerUser = async(req,res)=>{
    const {name,email,password,password2} = req.body;

    // validation can be done using some third party package as well
    let errors = []
    if(!name || !email || !password || !password2 ){
        errors.push({msg:'Please provide all the fields'})
    }
    if(password !== password2){
        errors.push({msg:'Passwords do not match'})
    }
    if(password.length < 6){
        errors.push({msg:'Passowrd should be of 6 characters minimum'})
    }
    if(errors.length > 0){
        res.render('register',{
            name,email,password,password2,errors
        })
    } 
    const user = await User.findOne({email})
    if(user){
        errors.push({msg:'User with this email is already registered'})
        res.render('register',{
            name,email,password,password2,errors
        })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password,salt)
    const newUser = await User.create({name,email,password:hashedPass})
    req.flash('success_msg','You have been registered and now you can login')
    res.redirect('/users/login')
}

const loginUser = (req,res,next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash:true,
    })(req,res,next);
}

const logoutUser = (req,res)=>{
    // req.logout is now an asynchronous function so it needs a callback function
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success_msg','You have been logged out')
        res.redirect('/users/login')
      });
}

module.exports = {registerUser,loginUser,logoutUser}