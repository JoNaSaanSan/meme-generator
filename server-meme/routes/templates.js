var express = require('express');
var router = express.Router();
let multer = require("multer");
let upload = multer();
let puppeteer = require("puppeteer");
const {
  ObjectId
} = require("mongodb");

/*
  Uploads a template to the DB. Authentication is required.
*/
router.post("/uploadtemplate", verifyToken, upload.fields([]), (req, res) => {
  let templates = req.db.get('templates');
  let users = req.db.get('users');
  let title = req.body.title;
  let base64 = req.body.base64;
  let userId = req.userId;
  let width = req.body.width;
  let height = req.body.height;
  let fileType = req.body.fileType;
  let template = {
    title,
    userId,
    used: 0,
    width,
    height,
    base64,
    fileType
  };

  templates.insert(template).then(obj => {
    //add templadeId to the user profiles
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

/*
  Returns all templates the logged in user. Authentication is required.
*/
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

/*
  Captures a screnshot of a url to an png/jpg and sends it as base64 to the client.
*/
router.get("/templatefromurl", (req, res) => {
  const url = req.query.url;
  console.log(url);

  //catch if url is empty
  if (url == "") {
    res.status(404).send({
      message: "Empty url"
    });
  } else {
    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      //screenshot website
      var scrsh = await page.screenshot({
        type: "png",
        encoding: "base64"
      });
      await browser.close();
      return scrsh;
    })().then(pic64 => {
      res.status(200).send({
        base64: pic64
      });
    }).catch(error => {
      console.log(error);
      res.status(400).send(error);
    });
  }
});


module.exports = router;