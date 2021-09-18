const passport = require('passport');
const LocalStrategy= require('passport-local').Strategy;

const User = require('../models/Users');

passport.use(new LocalStrategy({
   usernameField: 'email',
   passwordField: 'contraseña' 
}, async (email, contraseña, done) =>{
    const user = await User.findOne({email: email});
    if(!user){
        return done(null, false, {message: 'No se encontró el usuario'});
    }else{
        const match = await user.matchPassword(contraseña);
        if(match){
            return done(null, user);
        }else{
            return done(null, false, {message: 'Contraseña incorrecta'});
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err,user) => {
        done(err, user);
    });
});