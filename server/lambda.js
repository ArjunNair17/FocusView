require("dotenv").config({ path: "../.env" });
// Create express server
const express = require("express");
const app = express();
const testRoutes = require("./routes/api/tests");
const db = require("./config/firebase");
const { collection, getDocs } = require("firebase/firestore");

const hostname = "127.0.0.1";
const port = 8080;

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

//using AWS Lambda instead:
const serverless = require("serverless-http");
module.exports.handler = serverless(app);
