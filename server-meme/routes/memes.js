var express = require('express');
var router = express.Router();
var path = require('path');
const axios = require('axios');
var qs = require('qs');

const username = "SandraOMM";
const password = "onlinemultimedia2020";

var memes = [];

/* GET home page. */
router.get('/sampleMemes', function(req, res, next) {
  const URL = "https://api.imgflip.com/get_memes";
  console.log("sample memes requested");
  axios.get(URL)
    .then(response => {
      memes = response.data.data.memes;
      res.send(memes);
    })
    .catch(error => {
      console.log(error);
    })
});

router.post('/generateMeme', (req, res, next) => {
  const URL = "https://api.imgflip.com/caption_image";
  var id = req.body.id;
  var boxes = []
  req.body.inputBoxes.map(el => boxes.push({
    text: el.text,
    color: el.color
  }));
  var options = {
    template_id: id,
    username: username,
    password: password,
    boxes: boxes,
  };
  axios.post(URL, qs.stringify(options))
    .then(response => {
      if (response.data.success !== true) {
        console.log("An error occured: ", response.data);
        res.send(response.data)
      } else {
        console.log("sending: ", response.data);
        res.send(response.data);
      }
    })
    .catch(error => {
      console.log(error);
    })
});

router.post('/saveMeme', function(req, res, next) {
  const memes = req.db.get('memes');

  meme = {
    url: req.body.url,
    title: "title",
    creator: "creator",
    upvotes: 0,
    downvotes: 0,
    dateCreated: new Date().toLocaleString()
  }
  memes.insert(meme);
  res.send("Meme saved!");

});

router.get('/getmymemes', (req, res, next) => {
  const memes = req.db.get('memes');
  const user = req.body.user;

  memes.find({
    creator: user
  }).then(memes => {
    console.log(memes);
    res.send(memes);
  });
});

router.get('/upvote', (req, res, next) => {
  const memes = req.db.get('memes');
  const memeId = req.body.memeId;
  const user = req.body.user;

  //update user upvotes
  const users = req.db.get('users');
  users.update({
    name: user
  }, {
    $push: {
      upvotes: memeId
    }
  }).then(response => {
    console.log("User upvotes updated!");
  });

  memes.update({
    _id: memeId
  }, {
    $inc: {
      upvotes: 1
    }
  }).then(response => {
    console.log("Meme " + memeId + " upvoted!")
  });
});


router.get('/downvote', (req, res, next) => {
  const memes = req.db.get('memes');
  const memeId = req.body.memeId;
  const user = req.body.user;

  //update user downvotes
  const users = req.db.get('users');
  users.update({
    name: user
  }, {
    $push: {
      downvotes: memeId
    }
  }).then(response => {
    console.log("User downvotes updated!");
  });

  memes.update({
    _id: memeId
  }, {
    $inc: {
      downvotes: 1
    }
  }).then(response => {
    console.log("Meme " + memeId + " downvoted!")
  });
});

router.get('/browsememes', (req, res, next) => {
  const memes = req.db.get('memes');
  memes.find({}).then(memes => {
    res.send(memes);
  });
});


module.exports = router;