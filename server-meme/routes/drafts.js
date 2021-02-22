var express = require('express');
var router = express.Router();
let multer = require("multer");
let upload = multer();
const {
  ObjectId
} = require("mongodb");

router.post("/savedraft", verifyToken, upload.fields([]), (req, res) => {
  let drafts = req.db.get('drafts');
  let title = req.body.title;
  let base64 = req.body.base64; //Template! ohne schrift etc
  //let currentMeme = req.body.currentMeme;
  let additionalImages = req.body.additionalImages; //eingefügte bilder
  let drawPaths = req.body.drawPaths;
  let inputBoxes = req.body.inputBoxes;
  let userId = req.userId;
  darft = {
    title,
    base64,
    additionalImages,
    drawPaths,
    inputBoxes,
    userId
  };

  drafts.find({
    title: title
  }).then(found => {
    if (found != []) {
      console.log("Title already existing");
      res.status(400).send({
        message: "Title already existing, choose another one"
      });
    } else {
      drafts.insert(draft).then(draft => {
        if (draft._id == null) {
          console.log("Error saving draft");
          res.status(400).send({
            message: "Error saving draft"
          });
        } else {
          //User draft array updaten? Oder nciht?
          console.log(`Saved draft with it ${draft._id}`);
          res.status(200).send({
            message: "Draft saved"
          });
        }
      });
    }
  }).catch(error => {
<<<<<<< HEAD
    console.log(error);
    res.status(400).send(error);

=======
      console.log(error);
      res.status(400).send(error
      );
>>>>>>> ac26188babfe3b3a7809130225d32aa3c5b90a47
  });
});

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