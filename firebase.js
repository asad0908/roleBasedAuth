const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyBwi0QrkXLXBQPyZYv1TkZLU5cvkwehe_s",
  authDomain: "role-based-auth-ec43e.firebaseapp.com",
  projectId: "role-based-auth-ec43e",
  storageBucket: "role-based-auth-ec43e.appspot.com",
  messagingSenderId: "309537043131",
  appId: "1:309537043131:web:62977de3c40c7c9e036f9e",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
module.exports = {
  db,
  auth,
};
