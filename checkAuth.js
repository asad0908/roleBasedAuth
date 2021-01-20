const firebase = require("firebase");

const checkAuth = (req, res, next) => {
  const currentUser = firebase.auth().currentUser;
  if (currentUser == null) {
    return res.status(403).send("Not allowed");
  }
  next();
};

module.exports = {
  checkAuth,
};
