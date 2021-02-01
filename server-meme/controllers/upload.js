const upload = require("../middlewares/upload");

const uploadFile = async (req, res) => {
  try {
    await upload(req, res);

    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }
    console.log(req)

    return res.send(`File has been uploaded with id ${req.file.id}.`);

  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload image: ${error}`);
  }
};

module.exports = {
  uploadFile: uploadFile
}