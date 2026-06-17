import { initializeApp }
from
"https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getFirestore
}
from
"https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:
    "AIzaSyAkKr28jL5dZFcFpgLihFQZz4PBofORGOc",

  authDomain:
    "celebrities-database-7a3f3.firebaseapp.com",

  projectId:
    "celebrities-database-7a3f3",

  storageBucket:
    "celebrities-database-7a3f3.firebasestorage.app",

  messagingSenderId:
    "745598201815",

  appId:
    "1:745598201815:web:f9fd20cb0118dcd5be2592"
};

const app =
  initializeApp(
    firebaseConfig
  );

const db =
  getFirestore(app);

export { db };