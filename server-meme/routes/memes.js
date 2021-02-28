var express = require('express');
var router = express.Router();
var path = require('path');
const axios = require('axios');
var qs = require('qs');
const fs = require('fs');
var dateHelper = require('../helpers/dateHelper.js');
const puppeteer = require('puppeteer');
const util = require("util");
let multer = require("multer");
let upload = multer();
const verifyToken = require("../middlewares/authJWT.js");
const {
  ObjectId
} = require("mongodb");


const username = "SandraOMM";
const password = "onlinemultimedia2020";

/*
  memes document: _id, title, creatorId, imgstring, upvotes, downvotes, comments, private, dateCreated, visibility(0=unlisted, 1=private, 2=public) ,tags(?)
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
  Requests to generate a meme using the imgflip api.
  Returns the generated meme to the client. Authentication is required.
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
  //Request to the imgflip api, expects the meme as return
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
      res.status(400).send(error),
    });
});

/*
  Saves a meme to the DB. Must have either base64 or URL to the image. Authentication is required.
*/
router.post('/publishmeme', verifyToken, upload.fields([]), function(req, res) {
  const memes = req.db.get('memes');
  const users = req.db.get('users');
  const templates = req.db.get('templates');

  let url = req.body.url;
  let base64 = req.body.base64;
  let userId = req.userId;
  let title = req.body.title;
  let visibility = req.body.visibility;
  let memeTemplate = req.body.memeTemplate;

  //catch empty url AND empty base64
  if (url == null && base64 == null) {
    res.status(400).send({
      message: "url and base64 is null"
    });
  }

  //create meme document
  meme = {
    url: url,
    base64: base64,
    title: title,
    creatorId: userId,
    upvotes: 0,
    downvotes: 0,
    visibility: Number(visibility),
    dateCreated: new Date().toLocaleString(),
    memeTemplate
  }

  //insert meme to DB
  memes.insert(meme).then(obj => {
    if (obj._id == null) {
      res.status(400).send({
        message: "Error inserting meme to database"
      });
    } else {
      //Update user profile
      users.findOneAndUpdate({
        _id: userId
      }, {
        $push: {
          memes: obj._id
        }
      }).then(user => {
        //if template is already existing, update. Else insert a new one
        memeTemplateId = memeTemplate.id.toString().length == 24 ? memeTemplate.id : "000000000000000000000000"; //catches invalid id error by mongo, ids have to be 24 chars.
        templates.update({
          _id: memeTemplateId
        }, {
          $inc: {
            used: 1
          }
        }, {
          upsert: true
        }).then(template => {
          if (obj._id != null) {
            console.log(obj._id);
            res.status(200).send({
              message: "Meme saved successfully",
              memeId: obj._id
            });
          } else {
            res.status(400).send({
              message: "Error updating user document"
            });
          }
        });
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
  Upvotes a meme existing in the DB. Adds the id of the upvoted meme to the user document,
   and increases the upvote counter of the meme document by 1. Each meme can only get upvoted once by the same user.
   Authentication is required.
*/
router.get('/upvote', verifyToken, upload.fields([]), (req, res, next) => {
  const memes = req.db.get('memes');
  const memeId = req.query.memeId;
  const userId = req.userId;

  //update user upvotes
  const users = req.db.get('users');
  users.findOne({
    _id: userId
  }).then(existing => {
    //check if user already upvoted the meme.
    if (existing.upvotes.includes(memeId)) {
      res.status(400).send({
        message: "Already voted"
      })
    } else {
      //if the user did not upvote the meme yet, update user profile
      users.findOneAndUpdate({
        _id: userId
      }, {
        $push: {
          upvotes: memeId
        }
      }).then(() => {
        console.log("User upvotes updated!");
        //increase meme upvote counter
        memes.findOneAndUpdate({
          _id: memeId
        }, {
          $inc: {
            upvotes: 1
          }
        }).then(doc => {
          console.log("Meme " + memeId + " upvoted!");
          res.status(200).send({
            message: "Meme " + memeId + " upvoted!",
            upvotes: doc.upvotes
          })
        });
      })
    }
  }).catch(error => {
    console.log(error);
    res.status(400).send({
      message: error
    });
  });
});


/*
  Downvotes a meme existing in the DB. Adds the id of the downvoted meme to the user document,
  and decreases the upvote counter of the meme document by 1. Each meme can only get downvoted once by the same user.
  Authentication is required.
*/
router.get('/downvote', verifyToken, (req, res, next) => {
  const memes = req.db.get('memes');
  const memeId = req.query.memeId;
  const userId = req.userId;

  //update user upvotes
  const users = req.db.get('users');
  //Update user
  users.findOne({
    _id: userId,
  }).then(existing => {
    //Check if user already voted the meme
    if (existing.downvotes.includes(memeId)) {
      res.status(400).send({
        message: "Already voted"
      })
    } else {
      //update downvotes of user profile
      users.findOneAndUpdate({
        _id: userId
      }, {
        $push: {
          downvotes: memeId
        }
      }).then(() => {
        console.log("User downvotes updated!");
        //increase meme downvote counter
        memes.findOneAndUpdate({
          _id: memeId
        }, {
          $inc: {
            downvotes: 1
          }
        }).then(doc => {
          console.log("Meme " + memeId + " downvoted!");
          res.status(200).send({
            message: "Meme " + memeId + " downvoted!",
            downvotes: doc.downvotes
          })
        });
      })
    }
  }).catch(error => {
    console.log(error);
    res.status(400).send({
      message: error
    });
  });
});

/*
  Requests an array of memes by dateCreated.
*/
router.get('/newmemes', (req, res, next) => {
  const memes = req.db.get('memes');
  memes.find({
    visibility: 2
  }).then(memes => {
    //sort by date created
    memes.sort((b, a) => dateHelper.stringToDateObj(a["dateCreated"]) - dateHelper.stringToDateObj(b["dateCreated"]));
    res.send(memes);
  });
});

/*
  Requests the most popular memes. Poularity is calculated by upvotes - downvotes.
*/
router.get('/popularmemes', (req, res, next) => {
  const memes = req.db.get('memes');
  memes.find({
    visibility: 2
  }, {
    sort: {
      upvotes: -1
    }
  }).then(docs => {
    //sort by upvotes - downvotes
    memesSorted = docs.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    res.status(200).send(memesSorted);
  }).catch(error => {
    console.log(error);
    res.status(400).send({
      message: error
    });
  });;
});

/*
  Requests the memes by order given in the database aka sorted by creation date
*/
router.get("/browsememes", (req, res) => {
  const memes = req.db.get('memes');

  memes.find({
    visibility: 2
  }).then(docs => {
    res.status(200).send(docs);
  }).catch(error => {
    console.log(error);
    res.status(400).send({
      message: error
    });
  });
});

/*
  Post a comment to a meme. Authentication is required.
*/
router.post("/comment", verifyToken, upload.fields([]), (req, res) => {
  let users = req.db.get("users");
  let memes = req.db.get("memes");
  let memeId = req.body.memeId;
  let userId = req.userId;
  let commentText = req.body.comment;
  let date = new Date().toLocaleString();

  //create comment object
  comment = {
    userId: userId,
    text: commentText,
    date: date
  };

  //add comment to meme's comment array
  memes.update({
    _id: memeId
  }, {
    $push: {
      comments: comment
    }
  }).then(() => {
    //update the user profile and add comment tot he users comment array
    users.update({
      _id: userId
    }, {
      $push: {
        comments: {
          memeId: memeId,
          text: commentText,
          date: date
        }
      }
    }).then(() => {
      res.status(200).send({
        message: "Comment saved"
      });
    })

  }).catch(error => {
    console.log(error);
    res.status(400).send({
      message: error
    });
  });
});


/*
  Requests a single meme by the _id of the database
*/
router.get("/:id", (req, res) => {
  memes = req.db.get('memes');
  let id = req.params.id;

  memes.findOne({
    _id: id
  }).then(meme => {
    console.log(meme);
    res.status(200).send(meme);
  }).catch(error => {
    console.log(error);
    res.status(400).send(error);
  })
});

module.exports = router;