var express = require('express');
var router = express.Router();
let multer = require("multer");
let upload = multer();

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

module.exports = router;