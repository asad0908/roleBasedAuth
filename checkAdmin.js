const firebase = require("firebase");
const { db } = require("./firebase");

const checkAdmin = (req, res, next) => {
  const currentUser = firebase.auth().currentUser;
  db.collection("users")
    .doc(currentUser.email)
    .get()
    .then((user) => {
      if (user.data().role !== 1) {
        return res.status(403).send("Not allowed");
      } else {
        next();
      }
    });
};

module.exports = {
  checkAdmin,
};
