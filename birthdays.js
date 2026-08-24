import { db } from "./firebase.js";

import {
  collection,
  getDocs
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const SHEET_ID =
  "1wWydsOHKeGV34m50w7FdQLnVFd2r1hvt342hL6gCHgc";

const SHEET_NAME =
  "Celebrities";

const url =
`https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

// =======================
// 🔥 IMAGE FIX
// =======================
function getImageId(url){

  if(!url) return "";

  url = url.trim();

  let match =
    url.match(/[?&]id=([^&]+)/);

  if(match) return match[1].trim();

  match =
    url.match(/\/d\/([^/]+)/);

  if(match) return match[1].trim();

  match =
    url.match(/uc\?id=([^&]+)/);

  if(match) return match[1].trim();

  match =
    url.match(/thumbnail\?id=([^&]+)/);

  if(match) return match[1].trim();

  if(!url.includes("http") && url.length > 20){
    return url.trim();
  }

  return "";
}

let celebrities = [];

// =======================
// 🔥 MODE STATE
// =======================
let mode = "birthday";

// =======================
// 🔥 INIT DATA
// =======================
fetch(url)
.then(res => res.json())
.then(async data => {

  celebrities = data;

  setupBirthdaySelectors();

  document.getElementById("birthDay")
    .addEventListener("change", searchBirthdays);

  document.getElementById("birthMonth")
    .addEventListener("change", searchBirthdays);

  renderModeUI();
});

// =======================
// 🔥 SET MODE
// =======================
window.setMode = function(newMode){

  mode = newMode;

  renderModeUI();
};

// =======================
// 🔥 SHOW / HIDE UI
// =======================
function renderModeUI(){

  const box =
    document.querySelector(".birthday-search-box");

  const results =
    document.getElementById("birthdayResults");

  results.innerHTML = "";

  if(mode === "birthday"){
    box.style.display = "flex";
  } else {
    box.style.display = "none";
  }

  if(mode === "birthYear"){
    renderBirthYears();
  }

  if(mode === "deathYear"){
    renderDeathYears();
  }

  if(mode === "ages"){
    renderAgeDecades();
  }
}

// =======================
// 🔥 SETUP DAY SELECTOR
// =======================
function setupBirthdaySelectors(){

  const birthDay =
    document.getElementById("birthDay");

  for(let i = 1; i <= 31; i++){
    birthDay.innerHTML += `
      <option value="${i}">${i}</option>
    `;
  }
}

// =======================
// 🔥 ORIGINAL SEARCH (DAY + MONTH)
// =======================
function searchBirthdays(){

  if(mode !== "birthday") return;

  const selectedDay =
    parseInt(document.getElementById("birthDay").value);

  const selectedMonth =
    parseInt(document.getElementById("birthMonth").value);

  const filtered = celebrities.filter(c => {

    if(!c.BirthDate) return false;

    const birth = new Date(c.BirthDate);

    return (
      birth.getDate() === selectedDay &&
      birth.getMonth() + 1 === selectedMonth
    );
  });

filtered.sort((a,b)=>{

  const aAlive = !a.DeathDate;
  const bAlive = !b.DeathDate;

  if(aAlive && !bAlive){
    return -1;
  }

  if(!aAlive && bAlive){
    return 1;
  }

  return 0;

});

  renderResults(filtered);
}

// =======================
// 🔥 BIRTH YEARS
// =======================
function getBirthYears(){

  const years = new Set();

  celebrities.forEach(c => {
    if(c.BirthDate){
      years.add(new Date(c.BirthDate).getFullYear());
    }
  });

  return [...years].sort((a,b)=>a-b);
}

function renderBirthYears(){

  const years = getBirthYears();

  let html = `
    <div class="section-title">Birth Years</div>
    <div class="button-grid">
  `;

  years.forEach(y => {
    html += `
      <button class="year-btn birth"
        onclick="filterBirthYear(${y})">
        ${y}
      </button>
    `;
  });

  html += `</div>`;

  document.getElementById("birthdayResults").innerHTML = html;
}

window.filterBirthYear = function(year){

  const filtered = celebrities.filter(c =>
    c.BirthDate &&
    new Date(c.BirthDate).getFullYear() === year
  );

  renderResults(filtered);
};

// =======================
// 🔥 DEATH YEARS
// =======================
function getDeathYears(){

  const years = new Set();

  celebrities.forEach(c => {
    if(c.DeathDate){
      years.add(new Date(c.DeathDate).getFullYear());
    }
  });

  return [...years].sort((a,b)=>a-b);
}

function renderDeathYears(){

  const years = getDeathYears();

  let html = `
    <div class="section-title">Death Years</div>
    <div class="button-grid">
  `;

  years.forEach(y => {
    html += `
      <button class="year-btn death"
        onclick="filterDeathYear(${y})">
        ${y}
      </button>
    `;
  });

  html += `</div>`;

  document.getElementById("birthdayResults").innerHTML = html;
}

window.filterDeathYear = function(year){

  const filtered = celebrities.filter(c =>
    c.DeathDate &&
    new Date(c.DeathDate).getFullYear() === year
  );

  renderResults(filtered);
};

// =======================
// 🔥 AGE DECADES
// =======================

function renderAgeDecades(){

  const decades = [
    { label: "10s", min: 10, max: 19 },
    { label: "20s", min: 20, max: 29 },
    { label: "30s", min: 30, max: 39 },
    { label: "40s", min: 40, max: 49 },
    { label: "50s", min: 50, max: 59 },
    { label: "60s", min: 60, max: 69 },
    { label: "70s", min: 70, max: 79 },
    { label: "80s", min: 80, max: 89 },
    { label: "90s", min: 90, max: 99 },
    { label: "100s", min: 100, max: 109 }
  ];

  let html = `
    <div class="section-title">Ages</div>
    <div class="button-grid">
  `;

  decades.forEach(decade => {

    html += `
      <button
        class="year-btn"
        onclick="filterAgeDecade(${decade.min}, ${decade.max})"
      >
        ${decade.label}
      </button>
    `;

  });

  html += `</div>`;

  document.getElementById("birthdayResults").innerHTML = html;
}

window.filterAgeDecade = async function(minAge, maxAge){

  const filtered =
    celebrities.filter(c => {

      const age =
        parseInt(c.Age);

      return (
        !isNaN(age) &&
        age >= minAge &&
        age <= maxAge
      );

    });

  // =======================
  // ⭐ LOAD STAR POWER
  // =======================

  const snapshot =
    await getDocs(
      collection(
        db,
        "starPowers"
      )
    );

  const powers = {};

  snapshot.forEach(doc => {

    powers[doc.id] =
      doc.data().points || 0;

  });

  // =======================
  // ⭐ ADD STAR POWER
  // =======================

  filtered.forEach(celeb => {

    celeb.points =
      powers[celeb.ID] || 0;

  });

  // =======================
  // ⭐ SORT BY STAR POWER
  // =======================

  filtered.sort((a,b) => {

    // Living first
    const aAlive = !a.DeathDate;
    const bAlive = !b.DeathDate;

    if(aAlive && !bAlive){
      return -1;
    }

    if(!aAlive && bAlive){
      return 1;
    }

    // Then Star Power
    return b.points - a.points;

  });

  renderResults(filtered);

};

// =======================
// 🔥 RENDER RESULTS
// =======================
function renderResults(list){

  const results =
    document.getElementById("birthdayResults");

  let livingHtml = "";
  let deceasedHtml = "";

  list.forEach(celeb => {

    console.log(celeb.Name, celeb.Age);
    const card = `
      <div class="mini-card fade-in-card"
        onclick="window.location.href='profile.html?id=${celeb.ID}'"
      >

        <div class="img-wrapper">
          <img src="https://lh3.googleusercontent.com/d/${getImageId(celeb.URL)}=w300">
        </div>

        <div class="card-text">

          <p class="name">
            ${celeb.Name}
          </p>

          <small class="occupation">
            ${celeb.Occupation}
          </small>

          <small class="age">
            ${
            celeb.DeathDate
            ? `Died at age ${celeb.Age}`
            : `Age ${celeb.Age}`
            }
          </small>

        </div>

      </div>
    `;

    if(celeb.DeathDate){

      deceasedHtml += card;

    }else{

      livingHtml += card;

    }

  });

  let html = "";

  if(livingHtml){

    html += `
      <h2 class="results-title living-title">
        🎉 Living Celebrities
      </h2>

      ${livingHtml}
    `;
  }

  if(deceasedHtml){

    html += `
      <h2 class="results-title deceased-title">
        🕊️ Deceased Celebrities
      </h2>

      ${deceasedHtml}
    `;
  }

  if(html === ""){

    html = `
      <div class="empty-state">
        <h3>No results found</h3>
        <p>Try another filter ✨</p>
      </div>
    `;
  }

  results.innerHTML = html;
}