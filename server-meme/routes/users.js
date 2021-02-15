var express = require('express');
var router = express.Router();
let multer = require("multer");
let upload = multer();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const config = require("../config/authconfig.js");
const verifyToken = require("../middlewares/authJWT.js");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('users');
});

/*
user document: _id, googleData, nickname, upvotes(?), downvotes(?), comments(?), templates, memes
*/

router.post("/setnickname", upload.fields([]), (req, res) => {
  var users = req.db.get("users");
  var nickname = req.body.nickname;
  var googleId = Number(req.body.googleId);

  //Check if nickname is already taken
  users.findOne({
    nickname: nickname
  }).then(obj => {
    if (obj != null) {
      res.send("Nickname already taken, choose another one!");
    } else {
      //TODO googleid erst verify?
      //find user via googleId and update nickname
      users.update({
        googleId: {
          $eq: googleId
        }
      }, {
        $set: {
          nickname: nickname
        }
      }).then(obj => {
        //catch errors
        if (obj.nModified == 1) {
          res.send("Nickname saved!")
        } else {
          console.log(obj);
          res.send("Error, goolgeId not found, nickname not saved.");
        }
      }).catch(error => console.log(error));

    }
  });
});


router.post("/register", upload.fields([]), (req, res) => {
  var users = req.db.get("users");
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;

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
      //User erstellen
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


router.post("/login", upload.fields([]), (req, res) => {
  var users = req.db.get("users");
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;

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
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({
        userId: user._id //userid oder username?
      }, config.secret, {
        expiresIn: 86400 // 24 stunden
      });

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

router.get("/getprofile", verifyToken, (req, res) => {
  let userId = req.userId;
  let users = req.db.get("users");
  let memes = req.db.get("memes");

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

          userTemplates = []; //TODO

          res.status(200).send({
            username: user.username,
            email: user.email,
            memes: userMemes,
            upvotes: userUpvotes,
            downvotes: userDownvotes,
            templates: userTemplates
          });
        });
      });
    });
  });
});

router.get("/testtoken", verifyToken, (req, res) => {

  console.log("done");
});
module.exports = router;