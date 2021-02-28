var express = require('express');
var router = express.Router();
let multer = require("multer");
let upload = multer();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const config = require("../config/authconfig.js");
const verifyToken = require("../middlewares/authJWT.js");

/*
  Registers a new user to the db.
*/
router.post("/register", upload.fields([]), (req, res) => {
  var users = req.db.get("users");
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;

  //check if username or email is already existing
  users.findOne({
    $or: [{
      username: username
    }, {
      email: email
    }]
  }).then(obj => {
    if (obj != null) {
      res.status(400).send({
        message: "Username or Email already taken, choose another one!"
      });
    } else {
      //Create user document and insert it to DB
      console.log("Creating new user " + username);
      users.insert({
          username: username,
          password: bcrypt.hashSync(password, 10),
          email: email,
          upvotes: [],
          downvotes: [],
          comments: [],
          templates: [],
          memes: []
        })
        .then(obj => {
          res.status(200).send({
            message: "Registration successful!"
          });
        }).catch(error => {
          console.log(error);
          res.send(400).send({
            message: "Registration failed!"
          });
        });
    }
  });
});

/*
  Request to log a user in. Checks the password and returns a JWT and the user's profile if successful.
*/
router.post("/login", upload.fields([]), (req, res) => {
  var users = req.db.get("users");
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;

  //Checks if user is existing
  users.findOne({
    $or: [{
        username: username
      },
      {
        email: email
      }
    ]
  }).then(user => {
    if (user == null) {
      res.status(404).send({
        message: "Username or Email not found."
      });
    } else {
      //checks password
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      //error if password is incorrect
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      //create JWT
      var token = jwt.sign({
        userId: user._id
      }, config.secret, {
        expiresIn: 86400 //24 hours
      });
      console.log(`User ${user.username} logged in`);
      //return profile
      res.status(200).send({
        message: "Login successful!",
        username: user.username,
        email: user.email,
        upvotes: user.upvotes,
        downvotes: user.downvotes,
        comments: user.comments,
        templates: user.templates,
        memes: user.memes,
        accessToken: token
      });
    }
  });
});

/*
  Returns a user's profile. Authentication is required.
*/
router.get("/getprofile", verifyToken, (req, res) => {
  let userId = req.userId;
  let users = req.db.get("users");
  let memes = req.db.get("memes");
  let templates = req.db.get("templates");

  users.findOne({
    _id: userId
  }).then(user => {
    memes.find({
      _id: {
        $in: user.memes
      }
    }).then(userMemes => {
      memes.find({
        _id: {
          $in: user.upvotes
        }
      }).then(userUpvotes => {
        memes.find({
          _id: {
            $in: user.downvotes
          }
        }).then(userDownvotes => {

          templates.find({
            userId: user._id
          }).then(userTemplates => {

            res.status(200).send({
              username: user.username,
              email: user.email,
              memes: userMemes,
              upvotes: userUpvotes,
              downvotes: userDownvotes,
              templates: userTemplates,
              comments: user.comments
            });
          })
        });
      });
    });
  });
});

module.exports = router;