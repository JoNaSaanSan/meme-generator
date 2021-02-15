var express = require('express');
var router = express.Router();
var path = require('path');
const axios = require('axios');
var qs = require('qs');
const fs = require('fs');
var dateHelper = require('../helpers/dateHelper.js');
//const upload = require("../middlewares/upload");
const puppeteer = require('puppeteer');
const util = require("util");
let multer = require("multer");
//const GridFsStorage = require("multer-gridfs-storage");
let upload = multer();
const verifyToken = require("../middlewares/authJWT.js");
const {
  ObjectId
} = require("mongodb");


const username = "SandraOMM";
const password = "onlinemultimedia2020";

var memes = [];
/*
  memes document: _id, title, creatorId, imgstring, upvotes, downvotes, comments, private, dateCreated, private,tags(?)
*/

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
router.post('/generateMeme', upload.fields([]), (req, res, next) => {
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
router.post('/savememe', verifyToken, upload.fields([]), function(req, res) {
  const memes = req.db.get('memes');
  const users = req.db.get('users');

  let url = req.body.url;
  let base64_img = req.body.base64_img;
  let userId = req.userId;
  let title = req.body.title;
  if (url == null && base64_img == null) {
    res.status(400).send({
      message: "url and base64 is null"
    });
  }

  meme = {
    url: url,
    base64_img: base64_img,
    title: title,
    creatorId: ObjectId(userId),
    upvotes: 0,
    downvotes: 0,
    private: false,
    dateCreated: new Date().toLocaleString()
  }
  memes.insert(meme).then(obj => {
    if (obj._id == null) {
      res.status(400).send({
        message: "Error inserting meme to database"
      });
    } else {
      users.update({
        _id: userId
      }, {
        $push: {
          memes: obj._id
        }
      }).then(writeResult => {
        if (writeResult.nModified == 1) {
          res.status(200).send({
            message: "Meme saved successfully"
          });
        } else {
          res.status(400).send({
            message: "Error updating user document"
          })
        }
      });
    }
  }).catch(error => {
    console.log(error);
    res.status(400).send({
      message: error
    });
  });
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
router.get('/upvote', verifyToken, upload.fields([]), (req, res, next) => {
  const memes = req.db.get('memes');
  const memeId = req.query.memeId;
  const userId = req.userId;

  //update user upvotes
  const users = req.db.get('users');
  users.update({
    _id: userId
  }, {
    $push: {
      upvotes: ObjectId(memeId)
    }
  }).then(() => {
    console.log("User upvotes updated!");
    memes.update({
      _id: memeId
    }, {
      $inc: {
        upvotes: 1
      }
    }).then(response => {
      console.log("Meme " + memeId + " upvoted!");
      res.status(200).send({
        messsage: "Meme " + memeId + " upvoted!"
      })
    });
  }).catch(error => {
    console.log(error);
    res.status(400).send({
      message: error
    });
  });
});

//increase meme updates by 1


/*
  Downvotes a meme existing in the DB. Adds the id of the downvoted meme to the user document,
   and decreases the upvote counter of the meme document by 1.
*/
router.get('/downvote', (req, res, next) => {
  const memes = req.db.get('memes');
  const memeId = req.query.memeId;
  const userId = req.userId;

  users.update({
    _id: userId
  }, {
    $push: {
      downvotes: ObjectId(memeId)
    }
  }).then(() => {
    console.log("User upvotes updated!");
    memes.update({
      _id: memeId
    }, {
      $inc: {
        downvotes: 1
      }
    }).then(response => {
      console.log("Meme " + memeId + " downvoted!");
      res.status(200).send({
        messsage: "Meme " + memeId + " downvoted!"
      })
    });
  }).catch(error => {
    console.log(error);
    res.status(400).send({
      message: error
    });
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
  memes.find({
    private: false
  }).then(memes => {
    conosole.log(memes);
    res.send(memes);
  });
});

/*
  Uploads a template to the MongoDB
*/
router.post('/uploadtemplate', verifyToken, upload.fields([]), (req, res) => {
  const templates = req.db.get('templates');
  const users = req.db.get('users');
  const creatorId = req.userId;
  const title = req.body.title;
  const imgstring = req.body.base64_img;

  //var imgBuffer = new Buffer(imgstring, "base64")
  //console.log(imgstring)
  template = {
    title: title,
    creatorId: creatorId,
    base64_img: base64_img,
    dateCreated: new Date().toLocaleString()
  }

  templates.insert(template).then(newObj => {
    if (newObj._id == null) {
      res.status(400).send({
        message: "Error inserting template to DB"
      });
    } else {

      res.send(`Template saved with id ${newObj._id}!`);
    }

  });
});

/*
  Captures a screnshot of a url to an png/jpg and sends it as base64 to the client
*/
router.get("/templatefromurl", (req, res) => {
  const url = req.query.url;

  //catch if url is empty or not a png/jpeg
  if (url == "") {
    res.status(404).send("Empty url");
  } else {
    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      var scrsh = await page.screenshot({
        type: "png",
        encoding: "base64"
      });

      await browser.close();
      return scrsh;
    })().then(pic => {
      //TODO bild direkt unter templates in der db speichern?
      res.status(200).send({
        base64_img: pic
      });
    });
  }
});

router.post("")

module.exports = router;