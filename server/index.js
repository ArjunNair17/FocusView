require("dotenv").config({ path: "../.env" });
// Create express server
const express = require("express");
const app = express();
const testRoutes = require("./routes/api/tests");

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  listCollections,
} = require("firebase/firestore");

const hostname = "127.0.0.1";
const port = 8080;

//FIRESTORE
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const fire = initializeApp(firebaseConfig);
const db = getFirestore(fire);

//DEFAULT get route
app.get("/", (req, res) => {
  res.send("Hello");
});

//route to test getting data from firestore
app.get("/data", async (req, res) => {
  try {
    const coll = collection(db, "collection1");
    const snap = await getDocs(coll);
    const data = snap.docs.map((doc) => doc.data());
    console.log("data: ", data);
    res.json(data);
  } catch (error) {
    console.error("Error getting data from Firestore", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//use the methods in routes/api/tests when a user calls '/api/tests'
app.use("/api/tests", testRoutes);

// Prints a log once the server starts listening
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
