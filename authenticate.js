const passport = require("passport"); //Passport uses what are termed strategies to authenticate requests.
const LocalStrategy = require("passport-local").Strategy; // Strategies range from verifying a username and password, using local
const User = require("./models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens, jwt_payload is an object literal containing the decoded JWT payload.

const config = require("./config.js");

exports.local = passport.use(new LocalStrategy(User.authenticate())); //exporting passwords
passport.serializeUser(User.serializeUser()); // to persist user data (after successful authentication) into session
passport.deserializeUser(User.deserializeUser()); //used to retrieve user data from session.

exports.getToken = function (user) { //exporting tokens
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {}; //is an object literal containing options to control how the token is extracted from the request or verified.
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //creates a new extractor that looks for the JWT in the authorization header with the scheme 'bearer'
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => { //return done() will cause the function to stop executing immediately.
        console.log("JWT payload:", jwt_payload);
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false); //exception occurred while verifying the credentials (for example, if the database is not available
            } else if (user) {
                return done(null, user); //correct username, If the credentials are valid,
            } else {
                return done(null, false); //If the credentials are not valid for ex: incorrect username or you could create a new account
            }
        });
    })
);

exports.verifyUser = passport.authenticate("jwt", { session: false }); //for verified users

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) { //checking if verifyUser is a verified admin
        return next();
    } else {
        const err = new Error(
            "You are not authorized to access this. Admins only."
        );
        err.status = 403; //is a good forbidden user but not authorized
        return next(err);
    }
};