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
  console.log(req.query);
  var boxes = req.query.boxes;
  console.log(boxes)
  //console.log(typeof(boxes));
  var options = {
    template_id: req.query.memeID,
    username: username,
    password: password,
    boxes: req.query.boxes,
  };
  console.log(options)
  axios.post(URL, qs.stringify(options))
    .then(response => {
      console.log(response);
      if (response.success != true) {
        console.log("An error occured: ", response.data);
        res.send(response.data)
      } else {
        res.send(response.data.data);
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