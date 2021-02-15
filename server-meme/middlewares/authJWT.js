const jwt = require("jsonwebtoken");
const config = require("../config/authconfig.js");

/*
  Verifies a given JWT token and attaches the userId to the request.
*/

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    console.log("User with id " + decoded.userId + " verified.");

    /*const newToken = jwt.sign({
      userId: decoded.userId
    }, config.secret, {
      expiresIn: 3600,
    })*/
    req.userId = decoded.userId;
    next();
  });
};

module.exports = verifyToken;