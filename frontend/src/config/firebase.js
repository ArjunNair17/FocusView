import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getDatabase } from "firebase/database";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";


// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyDgwnkWWGCxGkGemA5T5hTFS4fN3kXCn10",
  authDomain: "focusview-c3a33.firebaseapp.com",
  projectId: "focusview-c3a33",
  storageBucket: "focusview-c3a33.appspot.com",
  messagingSenderId: "1069093234322",
  appId: "1:1069093234322:web:d2354ded27db1de9aca84b",
  measurementId: "G-DP429NN7FS",
  databaseURL: "https://focusview-c3a33-default-rtdb.firebaseio.com/"
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();






//retrieve some data from the dummy collection
async function getData(db) {
  const dummyCol = collection(db, "dummy");
  const snap = await getDocs(dummyCol);
  const data = snap.docs.map((doc) => doc.data());
  return data;
}
