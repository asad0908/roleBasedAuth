const express = require("express");
const { db, auth } = require("./firebase");
const app = express();
const { checkAuth } = require("./checkAuth");
const { checkAdmin } = require("./checkAdmin");
const firebase = require("firebase");
const cors = require("cors");

app.use(express.json());
app.use(cors({ origin: "http://localhost:5000" }));

//to create new user
app.post("/users", (req, res) => {
  const { email, password, username, age, role } = req.body;
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      db.collection("users")
        .doc(email)
        .set({
          username: username,
          email: email,
          age: age,
          role: role,
        })
        .then(() => {
          res.status(200).send(user);
        })
        .catch((err) => res.status(502).send(err.message));
    })
    .catch((err) => res.status(502).send(err.message));
});

//to login into the app
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  auth
    .signInWithEmailAndPassword(email, password)
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(502).send(err.message));
});

//to get all users from the database
app.get("/users", checkAdmin, (req, res) => {
  db.collection("users")
    .get()
    .then((users) =>
      res.status(200).send(users.docs.map((user) => user.data()))
    )
    .catch((err) => res.status(502).send(err.message));
});

//to get our own user info from db
app.get("/user", checkAuth, (req, res) => {
  const currentUser = firebase.auth().currentUser;
  db.collection("users")
    .doc(currentUser.email)
    .get()
    .then((user) => res.status(200).send(user.data()))
    .catch((err) => res.status(502).send(err));
});

//to logout user
app.get("/logout", checkAuth, (req, res) => {
  auth
    .signOut()
    .then(() => {
      res.status(200).send("successfully signed out");
    })
    .catch((err) => res.send(err.message));
});

//to change password of our account and also others if we are a admin
app.post("/changePassword", (req, res) => {
  const { user, newPassword } = req.body;
  auth.onAuthStateChanged((user) => {
    if (user) {
      const newUser = firebase.auth().currentUser;
      if (newUser) {
        newUser
          .updatePassword(newPassword)
          .then(() => res.status(200).send("updated successfully"))
          .catch((err) => res.send(err.message));
      } else {
        res.status(502).send("no current user");
      }
    } else {
      res.status(502).send("User logged out");
    }
  });
});

app.listen(5000);
