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
  //res.send("moin")
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

/* GET home page. */
router.post('/saveMeme', function(req, res, next) {
  const memes = req.db.get('memes');
  console.log(req.query);
  memes.insert(req.query);
  res.send("Meme saved!");

});

module.exports = router;