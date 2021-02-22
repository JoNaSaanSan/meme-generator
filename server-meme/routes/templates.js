var express = require('express');
var router = express.Router();
let multer = require("multer");
let upload = multer();
const {
  ObjectId
} = require("mongodb");

router.post("/uploadtemplate", verifyToken, upload.fields([]), (req, res) => {
  let templates = req.db.get('templates');
  let users = req.db.get('users');
  let title = req.body.title;
  let base64 = req.body.base64;
  let userId = req.userId;
  let template = {
    title,
    userId,
    base64
  };

  templates.insert(template).then(obj => {
    users.update({
      _id: userId
    }, {
      $push: {
        templates: obj._id
      }
    }).then(obj2 => {
      console.log(`Template saved with id ${obj._id}.`);
      res.status(200).send({
        message: "Template saved"
      });
    });
  }).catch(error => {
    console.log(error);
    res.status(400).send({
      message: error
    });
  });
});


router.get("/loadtemplates", verifyToken, (req, res) => {
  let templates = req.db.get('templates');
  let userId = req.userId;

  templates.find({
    userId: userId
  }).then(templates => {
    res.status(200).send({
      templates: templates
    })
  }).catch(error => {
    console.log(error);
    res.status(400).send({
      message: error
    });
  });
});


module.exports = router;