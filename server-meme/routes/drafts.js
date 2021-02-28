var express = require('express');
var router = express.Router();
let multer = require("multer");
let upload = multer();
const {
  ObjectId
} = require("mongodb");

/*
  Saves a draft to the DB. Authentication is required.
*/
router.post("/savedraft", verifyToken, upload.fields([]), (req, res) => {
  let drafts = req.db.get('drafts');
  let users = req.db.get('users');
  let title = req.body.title;
  let base64 = req.body.base64; //base64 of the template
  let currentMeme = req.body.currentMeme;
  let additionalImages = req.body.additionalImages; //draft pictures
  let drawPaths = req.body.drawPaths;
  let inputBoxes = req.body.inputBoxes;
  let userId = req.userId;
  let draft = {
    title,
    base64,
    additionalImages,
    drawPaths,
    inputBoxes,
    userId,
    currentMeme,
    visibility: 1
  };

  //check if draft title already exists
  drafts.find({
    title: title
  }).then(found => {
    if (found.length > 0) {
      console.log("Title already existing");
      res.status(400).send({
        message: "Title already existing, choose another one"
      });
    } else {
      //insert draft document to DB
      drafts.insert(draft).then(draft => {
        if (draft._id == null) {
          console.log("Error saving draft");
          res.status(400).send({
            message: "Error saving draft"
          });
        } else {
          //Update the user with the draft id
          users.findOneAndUpdate({
            _id: userId
          }, {
            $push: {
              drafts: draft._id
            }
          }).then(() => {
            console.log(`Saved draft with it ${draft._id}`);
            res.status(200).send({
              message: "Draft saved to user",
              draftId: draft._id
            });
          })
        }
      });
    }
  }).catch(error => {
    console.log(error);
    res.status(400).send(error);
  });
});

/*
  Returns an array of all drafts of a user. Authentication is required.
*/
router.get("/loaddrafts", verifyToken, (req, res) => {
  let drafts = req.db.get('drafts');
  let userId = req.userId;

  drafts.find({
    userId: userId
  }).then(results => {
    res.status(200).send({
      drafts: results
    });
  }).catch(error => {
    console.log("Error loading drafts: " + error);
    res.status(400).send({
      message: error
    })
  });
});

module.exports = router;