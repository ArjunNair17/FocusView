const express = require("express");
const router = express.Router();
const db = require("../../config/firebase");
const {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
} = require("firebase/firestore");

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

router.get("/:id", async (req, res) => {
  try {
    const user = await getDoc(doc(db, "user", req.params.id));
    console.log("data: ", user.data());
    res.json(user.data());
  } catch (error) {
    console.error("Error getting data from Firestore", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/:id/analytics/proportions", async (req, res) => {
  try {
    const user = await getDoc(
      doc(db, "user", req.params.id, "analytics", "proportions")
    );
    console.log("data: ", user.data());
    res.json(user.data());
  } catch (error) {
    console.error("Error getting data from Firestore", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//to set user data directly in the user's document
router.post("/:id", async (req, res) => {
  try {
    // console.log(req.params.id);
    const user = await getDoc(doc(db, "user", req.params.id));
    if (user.exists) {
      console.log("User data: ", user.data());
      const docRef = doc(db, "user", req.params.id);
      await setDoc(docRef, req.body, { merge: true });
      const updatedUser = await getDoc(doc(db, "user", req.params.id));
      console.log("Updated user data: ", updatedUser.data());
    } else {
      console.log("user does not exist");
    }
    res.json("done");
  } catch (error) {
    console.error("Error setting user data", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//to set user data in user(document)->analytics(collection)->proportions(document)
router.post("/:id/proportions", async (req, res) => {
  try {
    // console.log(req.params.id);
    const user = await getDoc(doc(db, "user", req.params.id));
    if (user.exists) {
      console.log("User data: ", user.data());
      const docRef = doc(db, "user", req.params.id, "analytics", "proportions");
      await setDoc(docRef, req.body, { merge: true });
      const updatedUser = await getDoc(
        doc(db, "user", req.params.id, "analytics", "proportions")
      );
      console.log("Updated user data: ", updatedUser.data());
    } else {
      console.log("user does not exist");
    }
    res.json("done");
  } catch (error) {
    console.error("Error setting user data", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
