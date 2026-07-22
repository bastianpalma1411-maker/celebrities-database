
import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const SHEET_ID =
  "1wWydsOHKeGV34m50w7FdQLnVFd2r1hvt342hL6gCHgc";

const SHEET_NAME =
  "Celebrities";

const url =
  `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

// GET ID FROM URL
const params =
  new URLSearchParams(window.location.search);

const celebId =
  params.get("id");

let celeb;
let currentCelebrityId = null;

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

// FORMAT DATE (BONITO)
function formatDate(dateString){

  if(!dateString) return "Unknown";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// FETCH DATA
fetch(url)
.then(res => res.json())
.then(data => {

  celeb = data.find(c => c.ID === celebId);

  if(!celeb){
    document.body.innerHTML = "<h1>Celebrity not found</h1>";
    return;
  }

  renderProfile(celeb);
  loadStarPower(celeb.ID);
});

// RENDER PROFILE
function renderProfile(celeb){

  const profile =
    document.getElementById("profile");

  profile.innerHTML = `
  
    <div class="profile-container">

      <div class="left-column">

        <img
          class="profile-img"
          src="https://lh3.googleusercontent.com/d/${getImageId(celeb.URL)}=w300"
        >

        <div class="star-power-box">

          <h3>⭐ Star Power</h3>

          <p id="starPowerCount">0 points</p>

          <p id="starPowerRank">
          🏆 Loading...
          </p>

          <button onclick="increaseStarPower()">
            ⭐ Boost
          </button>

        </div>

      </div>

      <div class="profile-info">

        <h1>${celeb.Name}</h1>

        <h2>ID #${celeb.ID}</h2>

        <p><strong>Age:</strong> ${celeb.Age}</p>

        <p><strong>Birth Date:</strong> ${formatDate(celeb.BirthDate)}</p>

        ${
          celeb.DeathDate
            ? `<p><strong>Death Date:</strong> ${formatDate(celeb.DeathDate)}</p>`
            : ""
        }

        <p><strong>Occupation:</strong> ${celeb.Occupation}</p>

        <p>
          <strong>Birth Place:</strong>
          ${
            celeb.BirthPlace
              ? `
                <img
                  class="birthplace-flag"
                  src="https://flagcdn.com/24x18/${getCountryCode(celeb.BirthPlace)}.png"
                >
                ${celeb.BirthPlace}
              `
              : "—"
          }
        </p>

        <p><strong>Children:</strong> ${celeb.Children || "—"}</p>

        <p><strong>Zodiac Sign:</strong> ${celeb.ZodiacSign || "—"}</p>

        <button id="favoriteBtn">
          ❤️ Add to Favorites
        </button>

      </div>

    </div>
  `;

  // FAVORITES
  const favoriteBtn =
    document.getElementById("favoriteBtn");

  favoriteBtn.addEventListener("click", () => {

    let favorites =
      JSON.parse(localStorage.getItem("favorites")) || [];

    const exists =
      favorites.some(f => f.ID === celeb.ID);

    if(exists){
      alert("Already in favorites!");
      return;
    }

    favorites.push({
      ID: celeb.ID,
      Name: celeb.Name,
      URL: celeb.URL,
      Occupation: celeb.Occupation
    });

    localStorage.setItem("favorites", JSON.stringify(favorites));

    alert("Added to favorites!");
  });
}

// 🌍 FULL COUNTRY CODES (RESTAURADO COMPLETO)
function getCountryCode(country){

  const codes = {

    "Argentina":"ar",
    "Australia":"au",
    "Austria":"at",
    "Barbados":"bb",
    "Belgium":"be",
    "Benin":"bj",
    "Bermuda":"bm",
    "Brazil":"br",
    "Bulgaria":"bg",
    "Cameroon":"cm",
    "Canada":"ca",
    "Chile":"cl",
    "China":"cn",
    "Colombia":"co",
    "Croatia":"hr",
    "Cuba":"cu",
    "Czech Republic":"cz",
    "Denmark":"dk",
    "Egypt":"eg",
    "England":"gb-eng",
    "Scotland":"gb-sct",
    "Wales":"gb-wls",
    "Northern Ireland":"gb-nir",
    "France":"fr",
    "Georgia":"ge",
    "Germany":"de",
    "Guatemala":"gt",
    "Hong Kong":"hk",
    "Iceland":"is",
    "India":"in",
    "Ireland":"ie",
    "Israel":"il",
    "Italy":"it",
    "Ivory Coast":"ci",
    "Jamaica":"jm",
    "Japan":"jp",
    "Jersey":"je",
    "Kosovo":"xk",
    "Lebanon":"lb",
    "Malaysia":"my",
    "Mexico":"mx",
    "Monaco":"mc",
    "Morocco":"ma",
    "Netherlands":"nl",
    "New Zealand":"nz",
    "Nigeria":"ng",
    "North Macedonia":"mk",
    "Oman":"om",
    "Pakistan":"pk",
    "Panama":"pa",
    "Philippines":"ph",
    "Poland":"pl",
    "Portugal":"pt",
    "Puerto Rico":"pr",
    "Romania":"ro",
    "Russia":"ru",
    "Serbia":"rs",
    "Singapore":"sg",
    "Slovakia":"sk",
    "Slovenia":"si",
    "South Africa":"za",
    "South Korea":"kr",
    "Spain":"es",
    "Sudan":"sd",
    "Sweden":"se",
    "Switzerland":"ch",
    "Taiwan":"tw",
    "Trinidad and Tobago":"tt",
    "Turkey":"tr",
    "Ukraine":"ua",
    "United States":"us",
    "Uruguay":"uy",
    "Uzbekistan":"uz",
    "Vietnam":"vn",
    "Zanzibar":"tz",
    "Algeria":"dz",
    "Ethiopia":"et",
    "Finland":"fi",
    "Greece":"gr",
    "Haiti":"ht",
    "Isle of Man":"im",
    "Norway":"no",
    "Dominican Republic":"do",
    "Gibraltar":"gi",
    "Iran":"ir",
    "Namibia":"na",
    "Somalia":"so",
    "Venezuela":"ve",
    "Bosnia and Herzegovina":"ba",
    "Hungary":"hu",
    "Latvia":"lv",
    "Nicaragua":"ni",
    "Tunisia":"tn",
  };

  return codes[country] || "un";
}

// 🔥 STAR POWER FIREBASE
async function loadStarPower(id){

  currentCelebrityId = id;

  const ref = doc(db, "starPowers", id);
  const snap = await getDoc(ref);

  let points = 0;

  if(snap.exists()){
    points = snap.data().points || 0;
  }

  document.getElementById("starPowerCount").textContent =
  `${points} points`;

loadRankingPosition();
}

async function loadRankingPosition(){

  const snapshot =
    await getDocs(
      collection(
        db,
        "starPowers"
      )
    );

  let ranking = [];

  snapshot.forEach(doc => {

    ranking.push({

      id: doc.id,

      points:
        doc.data().points || 0

    });

  });

  ranking.sort((a,b)=>
    b.points - a.points
  );

  const position =
    ranking.findIndex(c =>
      c.id === currentCelebrityId
    );

  const rankElement =
    document.getElementById(
      "starPowerRank"
    );

  if(position === -1){

    rankElement.textContent =
      `🏆 Unranked`;

  }else{

    rankElement.textContent =
      `🏆 Rank #${position + 1} of ${ranking.length}`;

  }

}

// BOOST
window.increaseStarPower = async function(){

  const ref = doc(db, "starPowers", currentCelebrityId);

  const snap = await getDoc(ref);

  let current = snap.exists() ? snap.data().points || 0 : 0;

  await setDoc(ref, {
    points: current + 1
  });

  loadStarPower(currentCelebrityId);
};