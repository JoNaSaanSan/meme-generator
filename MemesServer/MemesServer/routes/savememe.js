var express = require('express');
var router = express.Router();

savedmemes = []

/* GET home page. */
router.post('/', function(req, res, next) {

  var url = req.query.url;
  savedmemes.push(url);
  console.log("meme received");
  res.send("Meme saved!");

});

module.exports = router;