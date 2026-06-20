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
.then(data => {

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
// 🔥 RENDER RESULTS
// =======================
function renderResults(list){

  const results =
    document.getElementById("birthdayResults");

  let html = "";

  list.forEach(celeb => {

    html += `
      <div class="mini-card fade-in-card"
        onclick="window.location.href='profile.html?id=${celeb.ID}'"
      >

        <div class="img-wrapper">
          <img src="https://lh3.googleusercontent.com/d/${getImageId(celeb.URL)}=w300">
        </div>

        <div class="card-text">
          <p class="name">${celeb.Name}</p>
          <small class="occupation">${celeb.Occupation}</small>
        </div>

      </div>
    `;
  });

  if(list.length === 0){
    html = `
      <div class="empty-state">
        <h3>No results found</h3>
        <p>Try another filter ✨</p>
      </div>
    `;
  }

  results.innerHTML = html;
}