var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  const memes = req.db.get('memes');
  console.log(req.query);
  memes.insert(req.query);
  res.send("Meme saved!");

});

module.exports = router;