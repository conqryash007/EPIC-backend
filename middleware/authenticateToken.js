const admin = require("../helper/firebaseAdmin");

const authenticateToken = async (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).send({ message: "Invalid Auth Token!" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log(decodedToken);
    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Error while verifying Firebase ID token:", error);
    return res.status(401).send({ message: "Unauthorized" });
  }
};

module.exports = authenticateToken;
