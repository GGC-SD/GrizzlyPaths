// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
//export const auth = getAuth(app);
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAy_7mW5ONAo7mM7KGaHoz8HASVqc9SVQI",
  authDomain: "grizzlypaths.firebaseapp.com",
  databaseURL: "https://grizzlypaths-default-rtdb.firebaseio.com",
  projectId: "grizzlypaths",
  storageBucket: "grizzlypaths.firebasestorage.app",
  messagingSenderId: "751018499039",
  appId: "1:751018499039:web:2a82284e18d78fe35d026a",
  measurementId: "G-K4WP4TR1RG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);
export{app,auth,database};
