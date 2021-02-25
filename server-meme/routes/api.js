var express = require('express');
var router = express.Router();
let multer = require("multer");
let canvas = require('canvas');
var sizeOf = require('image-size');
let upload = multer();
const {
  ObjectId
} = require("mongodb");

/*
  localhost:3000/api/602bf82b1eb7f235c08e3f04/TEXT1.5.5.40_TEXT2.200.200.40
  ohne graphisches interface bild erzeugen: memeid/text1.x1.y1.fontsize1_text2.x2.y2.fontsize2
*/
router.get('/:templateId/:textboxes', (req, res) => {
  let templates = req.db.get('templates');
  let textboxesStr = req.params.textboxes; //abc.com/textOben
  let templateId = req.params.templateId;

  let textboxes = textboxesStr.split("_").map((item, i) => {
    let itemSplit = item.split(".");
    return {
      text: itemSplit[0],
      xPos: Number(itemSplit[1]),
      yPos: Number(itemSplit[2]),
      size: Number(itemSplit[3])
    }
  });

  templates.findOne({
    _id: templateId
  }).then(template => {

    //find out dimensions of template
    var im = Buffer.from(template.base64.split(';base64,').pop(), 'base64');
    var dims = sizeOf(im);

    //create canvas with templade size
    const mycanvas = canvas.createCanvas(dims.width, dims.height);
    var ctx = mycanvas.getContext('2d');

    console.log(dims);
    const img = new canvas.Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.onerror = err => {
      throw err;
    }
    img.src = template.base64;


    textboxes.map(box => {
      ctx.font = box.size + 'px "Impact"';
      ctx.fillText(box.text, box.xPos, box.yPos)
    });

    let dataURL = mycanvas.toDataURL();

    res.status(200).send({
      dataURL: dataURL
    });

  }).catch(error => {
    console.log(error);
    res.status(400).send(error);
  });
});



module.exports = router;