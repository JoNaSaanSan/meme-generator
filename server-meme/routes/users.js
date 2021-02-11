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
  users = req.db.get("users");
  nickname = req.body.nickname;
  googleId = Number(req.body.googleId);

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
  users = req.db.get("users");
  username = req.body.username;
  password = req.body.password;

  users.findOne({
    username: username
  }).then(obj => {
    if (obj != null) {
      res.send("Username already taken, choose another one!");
    } else {
      //User erstellen
      console.log("Creating new user");
      users.insert({
          username: username,
          password: bcrypt.hashSync(password, 10),
          email: "",
          upvotes: [],
          downvotes: [],
          comments: [],
          templates: [],
          memes: []
        })
        .then(obj => {
          res.send("Registration successful!");
        }).catch(error => console.log(error));
    }
  });
});


router.post("/login", upload.fields([]), (req, res) => {
  users = req.db.get("users");
  username = req.body.username;
  password = req.body.password;

  users.findOne({
    username: username
  }).then(user => {
    if (user == null) {
      res.status(404).send({
        message: "Username not found."
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
        id: user.id
      }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
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

router.get("/testtoken", verifyToken, (req, res) => {

  console.log("done");
});
module.exports = router;