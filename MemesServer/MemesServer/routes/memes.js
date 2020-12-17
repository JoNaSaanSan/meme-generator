var express = require('express');
var router = express.Router();
var path = require('path');
const axios = require('axios');

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
  console.log(req);
  //axios.post(URL)
});

/* GET home page. */
router.post('/saveMeme', function(req, res, next) {
  const memes = req.db.get('memes');
  console.log(req.query);
  memes.insert(req.query);
  res.send("Meme saved!");

});

module.exports = router;