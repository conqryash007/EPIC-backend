const admin = require("firebase-admin");
const serviceAccount = require("./epic-admin-key");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
