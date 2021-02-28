var express = require('express');
var router = express.Router();
let multer = require("multer");
let canvas = require('canvas');
var sizeOf = require('image-size');
let upload = multer();

const JSZip = require('jszip');

const {
  ObjectId
} = require("mongodb");

/*
  Creates a meme of the given templateId and textboxes.
  templateId: Id of a template in the DB.
  textboxes: Text, x position, y position and font size in format "text.xposition.yposition.fontsize".
  Example request: localhost:3000/api/6037ccfbad0c2d43dcdc3e4d/text1.1.1.20_text2.50.50.20    Creates a memes of the template 6037ccfbad0c2d43dcdc3e4d with 2 textboxes.
                                                                                              "text1" at position 1,1 with font size 20 and "text2" at position 50,50 with font size 20.
*/
router.get('/:templateId/:textboxes', (req, res) => {
  let templates = req.db.get('templates');
  let textboxesStr = req.params.textboxes;
  let templateId = req.params.templateId;

  //build text boxes from request
  let textboxes = textboxesStr.split("_").map((item, i) => {
    let itemSplit = item.split(".");
    return {
      text: itemSplit[0],
      xPos: Number(itemSplit[1]),
      yPos: Number(itemSplit[2]),
      size: Number(itemSplit[3])
    }
  });

  //find template
  templates.findOne({
    _id: templateId
  }).then(template => {

    //find out dimensions of template
    var im = Buffer.from(template.base64.split(';base64,').pop(), 'base64');
    var dims = sizeOf(im);

    //create canvas with templade size
    const mycanvas = canvas.createCanvas(dims.width, dims.height);
    var ctx = mycanvas.getContext('2d');


    const img = new canvas.Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.onerror = err => {
      throw err;
    }
    img.src = template.base64;

    //write textboxes on canvas
    textboxes.map(box => {
      ctx.font = box.size + 'px "Impact"';
      ctx.fillText(box.text, box.xPos, box.yPos)
    });

    let dataURL = mycanvas.toDataURL();

    //send data url
    res.status(200).send({
      dataURL: dataURL
    });

  }).catch(error => {
    console.log(error);
    res.status(400).send(error);
  });
});

/*
  localhost:3000/api/602bf82b1eb7f235c08e3f04/TEXT1.5.5.40_TEXT2.200.200.40
  ohne graphisches interface bild erzeugen: memeid/anzahltextboxes/text1.x1.y1.fontsize1_text2.x2.y2.fontsize2;test3.x1.y1....
  texte für bilder sind druch ; getrennt

  Create multiple memes of a given template with different texts.
  templateId: Id of a template in the DB.
  textboxes: Text, x position, y position and font size in format "text.xposition.yposition.fontsize".
              Different textboxes for each meme devided by a ";". For multiple textboxes in one image, devide them by "_".
  Example request: localhost:3000/api/multitext/6037ccfbad0c2d43dcdc3e4d/text1.1.1.20_text2.50.50.20;text3.1.1.20_text4.50.50.20    Creates 2 memes of the template 6037ccfbad0c2d43dcdc3e4d with 2 textboxes for each meme.
                                                                                                                                    On the first meme "text1" at position 1,1 with font size 20 and "text2" at position 50,50 with font size 20.
                                                                                                                                    Second meme with "text3" at position 1,1 and font size 20 etc
*/
router.get("/multitext/:templateId/:textboxes", (req, res) => {
  let templates = req.db.get('templates');
  let textboxesParams = req.params.textboxes;
  let templateId = req.params.templateId;

  var zip = new JSZip();

  templates.findOne({
    _id: templateId
  }).then(template => {

    //split images by ; and create textboxes
    textboxesParams.split(";").map((text, i) => {
      let textboxes = text.split("_").map((item, i) => {
        let itemSplit = item.split(".");
        return {
          text: itemSplit[0],
          xPos: Number(itemSplit[1]),
          yPos: Number(itemSplit[2]),
          size: Number(itemSplit[3])
        }
      });

      //find out dimensions of template
      var im = Buffer.from(template.base64.split(';base64,').pop(), 'base64');
      var dims = sizeOf(im);

      //create canvas with templade size
      const mycanvas = canvas.createCanvas(dims.width, dims.height);
      var ctx = mycanvas.getContext('2d');

      const img = new canvas.Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.onerror = err => {
        throw err;
      }
      img.src = template.base64;

      //write textboxes on cavnas
      textboxes.map(box => {
        ctx.font = box.size + 'px "Impact"';
        ctx.fillText(box.text, box.xPos, box.yPos)
      });

      //den anfang wegschneiden, sonst kapierts zip nicht
      let dataURL = mycanvas.toDataURL().split('base64,')[1];

      //send file to zip
      zip.file("meme" + i + ".png", dataURL, {
        base64: true
      });
    });

    // header für die zip setzen
    res.setHeader('Content-Disposition', 'attachment; filename="memes.zip"')

    // zip senden
    zip.generateNodeStream({
        type: 'nodebuffer',
        streamFiles: true
      })
      .pipe(res).on('finish', function() {
        console.log("out.zip written.");
      });
  });
});

/*
  Requests a set of images(no GIFs/videos) matching given search tags as a zip file.
    type: "meme"/"template" - Search for memes or templatesRouter
    tags: "category:values" - Possible categories and values: "title" - title keywords, i.e. "dog,drake" divided by a ",". Matches all memes with "dog" or "drake" in title.
                                                              "minsize" - Mininum image size as format "width,height", i.e. "100,200" for all memes bigger than 100*200.
                                                              "maxsize" - Maximum image size
                                                              "votes" - Most upvoted memes. No values needed.
    maxamount: Maximum amount of images to return in the zip.
    Example requests: localhost:3000/api/imagesaszip/memes/maxsize:1000,1000/3      Returns 3 memes with a maximum width 1000 and heigth 1000.
                      localhost:3000/api/imagesaszip/memes/title:drake,dog/2        Returns 2 memes with "drake" or "dog" in the title.
                      localhost:3000/api/imagesaszip/memes/votes/1                  Returns 1 meme with the most upvotes.
                      localhost:3000/api/imagesaszip/templates/minsize:500,300/4    Returns 4 templates with a minimum width 500 and height 300.
*/
router.get("/imagesaszip/:type/:tags/:maxamount", (req, res) => {
  let collection;

  let type = req.params.type;
  let searchparam = req.params.tags.split(":")[0];

  let maxAmount = Number(req.params.maxamount);

  //Select correct collection
  if (type == "memes") {
    collection = req.db.get("memes");
  } else if (type == "templates") {
    collection = req.db.get("templates");
  } else {
    res.status(400).send({
      message: "No valid type, choose memes or templates"
    });
  }

  var zip = new JSZip();
  var query = {};
  var filter = {};

  //Create query and filter according to the request parameters
  if (searchparam == "title") {
    let tags = req.params.tags.split(":")[1].replace(",", " ");
    query = {
      $text: {
        $search: tags
      }
    }
    collection.createIndex({
      title: "text"
    });
  } else if (searchparam == "minsize") {
    let paramWidth = Number(req.params.tags.split(":")[1].split(",")[0]);
    let paramHeight = Number(req.params.tags.split(":")[1].split(",")[1]);
    query = {
      "memeTemplate.width": {
        $gte: paramWidth
      },
      "memeTemplate.height": {
        $gte: paramHeight
      },
      "memeTemplate.formatType": "image"
    }
  } else if (searchparam == "maxsize") {
    let paramWidth = Number(req.params.tags.split(":")[1].split(",")[0]);
    let paramHeight = Number(req.params.tags.split(":")[1].split(",")[1]);
    query = {
      "memeTemplate.width": {
        $lte: paramWidth
      },
      "memeTemplate.height": {
        $lte: paramHeight
      },
      "memeTemplate.formatType": "image"
    }
  } else if (searchparam == "votes") {
    filter = {
      sort: {
        upvotes: -1
      }
    }
    query = {
      "memeTemplate.formatType": "image"
    }
  } else {
    res.status(400).send({
      message: "Error: No valid search parameter. Choose title/size/votes"
    });
  }

  //Database request
  collection.find(query, filter).then(memes => {
    let maxLength = maxAmount > memes.length ? memes.length : maxAmount;
    let resultMemes = memes.splice(0, maxLength);

    //convert the base64 of every meme to a png and add it to the zip
    resultMemes.map((rmeme, i) => {
      var im = Buffer.from(rmeme.base64.split(';base64,').pop(), 'base64');
      var dims = sizeOf(im);

      //create canvas with templade size
      const mycanvas = canvas.createCanvas(dims.width, dims.height);
      var ctx = mycanvas.getContext('2d');

      const img = new canvas.Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.onerror = err => {
        throw err;
      }
      img.src = rmeme.base64;

      //slice base64 url
      let dataURL = mycanvas.toDataURL().split('base64,')[1];
      let fileType = mycanvas.toDataURL().split('base64,')[0].split("/")[1].slice(0, -1);


      zip.file(rmeme.title + "_" + i + "." + fileType, dataURL, {
        base64: true
      });
    });
    // zip header
    res.setHeader('Content-Disposition', 'attachment; filename="searchresults.zip"')

    // send zip
    zip.generateNodeStream({
        type: 'nodebuffer',
        streamFiles: true
      })
      .pipe(res).on('finish', function() {
        console.log("out.zip written.");
      });
  }).catch(error => {
    console.log(error);
    res.status(400).send(error);
  });
});

module.exports = router;