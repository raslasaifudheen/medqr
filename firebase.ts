import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDUN7UryxKT_hevMoihvWDX_ZhZGrYlJ2k",
  authDomain: "mini-project-s6cs.firebaseapp.com",
  projectId: "mini-project-s6cs",
  storageBucket: "mini-project-s6cs.firebasestorage.app",
  messagingSenderId: "894302735168",
  appId: "1:894302735168:web:d6a17120a4bb0972d788a5",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);

export { db, auth, functions };
