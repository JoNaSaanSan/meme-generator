var express = require('express');
var router = express.Router();
var path = require('path');
const axios = require('axios');
//const samplememe = require(path.join(__dirname, '..', 'public', 'images', "balloon.jpg"));
/*
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
};*/
var memes = [];

/* GET home page. */
router.get('/', function(req, res, next) {
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

module.exports = router;