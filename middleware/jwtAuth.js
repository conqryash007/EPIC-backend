require("dotenv").config();
const jwt = require("jsonwebtoken");

function verifyTokenAndAddPayload(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log("token", req.headers, token);
  
  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    req.user = decoded;

    console.log("final token",decoded);
    next();
  });
}

module.exports = verifyTokenAndAddPayload;
