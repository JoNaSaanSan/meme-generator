var express = require('express');
var router = express.Router();
var path = require('path');

//const samplememe = require(path.join(__dirname, '..', 'public', 'images', "balloon.jpg"));
data = {
  data: {
    memes: [{
        id: 1,
        name: "balloon",
        url: "http://localhost:3000/images/balloon.jpg",
        width: 1200,
        height: 1200,
        box_count: 2
      },
      {
        id: 2,
        name: "distractedboyfriend",
        url: "http://localhost:3000/images/distractedboyfriend.jpg",
        width: 1200,
        height: 1200,
        box_count: 2
      }
    ]
  }
};
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.send("moin")

  res.send(data);
});

module.exports = router;