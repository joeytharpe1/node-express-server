const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const config = require('./config.js');


exports.local = passport.use(new LocalStrategy(User.authenticate())); //how to add strategy to passport auth
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {}; //contains config options for jwt strategy
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //sending jwt as a header and bearer token
opts.secretOrKey = config.secretKey; //supply with a key to set up token

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({ _id: jwt_payload._id }, (err, user) => { //find a user with the same payload id as in the token
                if (err) {
                    return done(err, false); // no user found
                } else if (user) {
                    return done(null, user); // user is found
                } else {
                    return done(null, false); // no error but no user doc found matching with token
                }
            });
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', { session: false });