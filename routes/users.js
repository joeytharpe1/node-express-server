const express = require("express");
const User = require("../models/user");
const router = express.Router();
const passport = require("passport");//Passport uses what are termed strategies to authenticate requests.
const authenticate = require("../authenticate");

/* GET users listing. */
router.get(
  "/",
  authenticate.verifyUser, //checking if user is verified
  authenticate.verifyAdmin, // checking if verified user is a verified admin
  function (req, res, next) {
    User.find() //find the users
      .then((users) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(users);
      })
      .catch((err) => {
        return next(err);
      });
  }
);

// registration authentication (sign up router)
router.post("/signup", (req, res) => {
  User.register(
    new User({ username: req.body.username }), //creating user from client
    req.body.password, //from client
    (err, user) => {
      if (err) {
        res.statusCode = 500; //server error
        res.setHeader("Content-type", "application/json");
        res.json({ err: err }); //provide the info on error
      } else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        user.save((err) => { //saves the user info
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
            return;
          }
          passport.authenticate("local")(req, res, () => {  //if no error authenticate new registered user
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Registration Successful!" }); //send a status of Successful
          });
        });
      }
    }
  );
});

// LOGGING IN AUTHENTICATIONS!!!!
router.post("/login", passport.authenticate("local"), (req, res) => { //enable passport auth on this route, check for credentials and pasrings
  const token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "you have successfully logged in!",
  }); //sending status for success logged in
});

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy(); //deleting session on server side
    res.clearCookie("session-id"); //clear cookie stored on client
    res.redirect("/"); //redirect user to root path localhost:3000/
  } else {  //session doesnt exist
    const err = new Error("You are not logged in!");
    err.status = 401;
    return next(err);
  }
});

module.exports = router;