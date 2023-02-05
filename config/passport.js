const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const User = require('../models/User');

module.exports = (passport)=>{
    // pass the usernameField , it is really important 
    // if we don't pass it it does not work if the usernameField is something other than username , here it is email
    passport.use(new LocalStrategy({ usernameField: 'email' },
        (email, password, done)=> {
          User.findOne({ email: email },async (err, user)=>{
            if(err){
                return done(err);
            }
            if(!user){
                console.log('does not exist')
                return done(null, false,{message:'User with this email does not exist'});
            }
            const comparePass = await bcrypt.compare(password,user.password)
            if(!comparePass){
                console.log('passwords do not match')
                return done(null, false,{message:'Password is incorrect'}); 
            }
            return done(null, user);
          });
        }
    ));

    // Second way - using callbacks instead of async await
    // passport.use(
    //     new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    //       // Match user
    //       User.findOne({
    //         email: email
    //       }).then(user => {
    //         if (!user) {
    //           return done(null, false, { message: 'That email is not registered' });
    //         }
    
    //         // Match password
    //         bcrypt.compare(password, user.password, (err, isMatch) => {
    //           if (err) throw err;
    //           if (isMatch) {
    //             return done(null, user);
    //           } else {
    //             return done(null, false, { message: 'Password incorrect' });
    //           }
    //         });
    //       });
    //     })
    //   );

    
    /* Configure session management.
    *
    * When a login session is established, information about the user will be
    * stored in the session.  This information is supplied by the `serializeUser`
    * function, which is yielding the user ID and username.
    *
    * As the user interacts with the app, subsequent requests will be authenticated
    * by verifying the session.  The same user information that was serialized at
    * session establishment will be restored when the session is authenticated by
    * the `deserializeUser` function.
    *
    * Since every request to the app needs the user ID and username, in order to
    * fetch todo records and render the user element in the navigation bar, that
    * information is stored in the session.
    */

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });
    
}