
import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const SHEET_ID =
  "1wWydsOHKeGV34m50w7FdQLnVFd2r1hvt342hL6gCHgc";

const SHEET_NAME =
  "Celebrities";

const url =
`https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

let celebrities = [];

// IMAGE FIX
function getImageId(url){

  if(!url) return "";

  const idParam = url.match(/[?&]id=([^&]+)/);
  if(idParam) return idParam[1];

  const dMatch = url.match(/\/d\/([^/]+)/);
  if(dMatch) return dMatch[1];

  const thumbMatch = url.match(/thumbnail\?id=([^&]+)/);
  if(thumbMatch) return thumbMatch[1];

  return "";
}

// FETCH DATA
fetch(url)
.then(res => res.json())
.then(data => {

  celebrities = data;
  updateRanking(true); // orden inicial
});

// 🔥 UPDATE RANKING (SOLO CUANDO TÚ QUIERES)
window.updateRanking = async function(forceSort = true){

  const powers = {};

  const snapshot = await getDocs(
    collection(db, "starPowers")
  );

  snapshot.forEach(docSnap => {
    powers[docSnap.id] = docSnap.data().points || 0;
  });

  let ranked = celebrities.map(celeb => ({
    ...celeb,
    points: powers[celeb.ID] || 0
  }));

  if(forceSort){
    ranked.sort((a, b) => b.points - a.points);
  }

  renderRanking(ranked);
};

// RENDER
function renderRanking(data){

  const grid = document.getElementById("rankingGrid");

  let html = "";

  data.forEach((celeb, index) => {

    html += `
      <div class="card"
        onclick="window.location.href='profile.html?id=${celeb.ID}'"
      >

        <img src="https://lh3.googleusercontent.com/d/${getImageId(celeb.URL)}=w300">

        <div class="card-info">

          <h3>#${index + 1} ${celeb.Name}</h3>

          <p id="points-${celeb.ID}">
            ⭐ ${celeb.points} points
          </p>

          <p>${celeb.Occupation}</p>

          <button onclick="event.stopPropagation(); boostCelebrity('${celeb.ID}')">
            ⭐ Boost
          </button>

        </div>

      </div>
    `;
  });

  grid.innerHTML = html;
}

// 🔥 BOOST (NO REORDENA)
window.boostCelebrity = async function(id){

  const ref = doc(db, "starPowers", id);

  const snap = await getDoc(ref);

  let current = 0;

  if(snap.exists()){
    current = snap.data().points || 0;
  }

  await setDoc(ref, {
    points: current + 1
  });

  // SOLO ACTUALIZA TEXTO (NO REORDER)
  const el = document.getElementById(`points-${id}`);
  if(el){
    el.textContent = `⭐ ${current + 1} points`;
  }
};