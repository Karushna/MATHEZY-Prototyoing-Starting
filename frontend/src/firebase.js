import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBUy4WA6PNbOywOxEcTmJtcyRmug-aMAEY",
  authDomain: "mathezy-prototype-starting.firebaseapp.com",
  projectId: "mathezy-prototype-starting",
  storageBucket: "mathezy-prototype-starting.appspot.com", // 🔥 FIXED
  messagingSenderId: "708257425439",
  appId: "1:708257425439:web:f3b6fbfb3f3fbce21f4d2a"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);