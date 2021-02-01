const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

var storage = new GridFsStorage({
  url: "mongodb+srv://memeAdmin:memeAdmin@memescluster.0vfqo.mongodb.net/templates",
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-memes-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: "uploads",
      filename: `${Date.now()}-memes-${file.originalname}`
    };
  }
});

var uploadFile = multer({
  storage: storage
}).single("template");
var uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;