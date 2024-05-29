const express = require("express");
const router = express.Router();
const db = require("../../config/firebase");
const { collection, getDocs, getDoc } = require("firebase/firestore");

router.get("/all", async (req, res) => {
  try {
    const coll = collection(db, "user");
    const snap = await getDocs(coll);
    const data = snap.docs.map((doc) => doc.data());
    console.log("data: ", data);
    res.json(data);
  } catch (error) {
    console.error("Error getting data from Firestore", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/analytics", async (req, res) => {
  try {
    const coll = collection(db, "user", "analytics", "meta");
    const snap = await getDocs(coll);
    const data = snap.docs.map((doc) => doc.data());
    console.log("data: ", data);
    res.json(data);
  } catch (error) {
    console.error("Error getting data from Firestore", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
