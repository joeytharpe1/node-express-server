const express = require('express');
const User = require('../models/user');
const passport = require('passport');

const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
  User.register(
    new User({ username: req.body.username }), // create user from client
    req.body.password, //from client
    err => {
      if (err) {
        res.statusCode = 500; //server error
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err }); //provin info on error
      } else {
        passport.authenticate('local')(req, res, () => { //if no error authenticate new registered user
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Registration Successful!' }); //send a status of Successful
        });
      }
    }
  );
});

router.post('/login', passport.authenticate('local'), (req, res) => { //enable passport auth on this route, check for credentials and pasrings
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, status: 'You are successfully logged in!' }); //sending status for success logged in
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy(); //deleting session on server side
    res.clearCookie('session-id'); //clear cookie stored on client
    res.redirect('/'); //redirect user to root path localhost:3000/
  } else { //session doesnt exist
    const err = new Error('You are not logged in!');
    err.status = 401;
    return next(err);
  }
});

module.exports = router;