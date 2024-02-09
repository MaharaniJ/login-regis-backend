const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      console.log(token);

      // check the token is valid or not
      let decode = jwt.verify(token, process.env.SECRET_KEY);
      console.log(decode);
      if (decode) {
        req.userID = decode.id;
        next();
      }
    } else {
      res.json({
        statusCode: 401,
        message: "unauthorized",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Invalid User" });
  }
};

module.exports = { authenticate };


