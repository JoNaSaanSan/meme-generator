var express = require('express');
var router = express.Router();
var path = require('path');
const axios = require('axios');
var qs = require('qs');
var dateHelper = require('../helpers/dateHelper.js');

const username = "SandraOMM";
const password = "onlinemultimedia2020";

var memes = [];

/*
  Requests sample memes from the imgflip API.
  Returns an array of memes to the client.
*/
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

/*
  Requests to generate a meme at the imgflip api.
  Returns the generated meme to the client.
*/
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

/*
  Saves a meme url with title, creator to the DB.
*/
router.post('/savememe', function(req, res, next) {
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

/*
  Requests all memes created by the user.
  Returns an array of memes.
*/
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

/*
  Upvotes a meme existing in the DB. Adds the id of the upvoted meme to the user document,
   and increases the upvote counter of the meme document by 1.
*/
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

  //increase meme updates by 1
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

/*
  Downvotes a meme existing in the DB. Adds the id of the downvoted meme to the user document,
   and decreases the upvote counter of the meme document by 1.
*/
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

  //decrease meme updates by 1
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

/*
  Requests an array of memes by dateCreated
*/
router.get('/newmemes', (req, res, next) => {
  const memes = req.db.get('memes');
  memes.find({}).then(memes => {
    memes.sort((b, a) => dateHelper.stringToDateObj(a["dateCreated"]) - dateHelper.stringToDateObj(b["dateCreated"]));
    res.send(memes);
  });
});

/*
  Requests the most popular memes
*/
router.get('/popularmemes', (req, res, next) => {
  const memes = req.db.get('memes');
  //TODO
  memes.find({}).then(memes => {
    res.send(memes);
  });
});

router.post('/uploadtemplate', (req, res, next) => {
  const memes = req.db.get('memes');
  console.log(req.body);
  console.log("Upload!");
});


module.exports = router;