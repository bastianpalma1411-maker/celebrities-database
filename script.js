import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const SHEET_ID =
  "1wWydsOHKeGV34m50w7FdQLnVFd2r1hvt342hL6gCHgc";

const SHEET_NAME =
  "Celebrities";

const url =
  `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

function getImageId(url){

  if(!url)
    return "";

  const idParam =
    url.match(/[?&]id=([^&]+)/);

  if(idParam){
    return idParam[1];
  }

  const dMatch =
    url.match(/\/d\/([^/]+)/);

  if(dMatch){
    return dMatch[1];
  }

  const thumbMatch =
    url.match(/thumbnail\?id=([^&]+)/);

  if(thumbMatch){
    return thumbMatch[1];
  }

  return "";
}

let celebrities = [];
function waitCelebritiesReady(callback) {
  if (celebrities && celebrities.length > 0) {
    callback();
  } else {
    setTimeout(() => waitCelebritiesReady(callback), 300);
  }
}

// FORMAT DATE
function formatDate(dateString){

  if(!dateString)
    return "Unknown";

  const date =
    new Date(dateString);

  return date.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  );
}

// FETCH DATA
fetch(url)
.then(res => res.json())
.then(async data => {

  celebrities = data;

  // RANDOM CELEBRITIES
  const randomCelebs =
    [...data]
    .sort(() => 0.5 - Math.random())
    .slice(0,12);

  renderCelebrities(
    randomCelebs
  );

  // BIRTHDAYS TODAY
  const today =
    new Date();

  const todayDay =
    today.getDate();

  const todayMonth =
    today.getMonth() + 1;

// BIRTHDAYS TODAY

const birthdaysToday =
  data.filter(c => {

    if(!c["BirthDate"])
      return false;

    const date =
      new Date(
        c["BirthDate"]
      );

    return (
      date.getDate() ===
        todayDay &&
      date.getMonth() + 1 ===
        todayMonth
    );
  });

// LOAD STAR POWER FROM FIRESTORE

const snapshot =
  await getDocs(
    collection(
      db,
      "starPowers"
    )
  );

const powers = {};

snapshot.forEach(doc => {

  powers[
    doc.id
  ] =
    doc.data().points || 0;

});

// ADD POINTS

birthdaysToday.forEach(celeb => {

  celeb.points =
    powers[
      celeb.ID
    ] || 0;

});

// SORT BY STAR POWER

birthdaysToday.sort((a,b)=>{

  const aAlive =
    !a.DeathDate;

  const bAlive =
    !b.DeathDate;

  // Primero los vivos

  if(aAlive && !bAlive){
    return -1;
  }

  if(!aAlive && bAlive){
    return 1;
  }

  // Después ordenar por Star Power

  return b.points - a.points;

});

// RENDER

renderSpecialSection(
  birthdaysToday,
  "birthdays"
);

  // RECENTLY DECEASED
  const deceased =
    data
    .filter(c =>
      c["DeathDate"] &&
      c["DeathDate"]
      .trim() !== ""
    )
    .sort((a,b) =>
      new Date(
        b["DeathDate"]
      ) -
      new Date(
        a["DeathDate"]
      )
    )
    .slice(0,20);

  renderSpecialSection(
    deceased,
    "deceased"
  );

  // LIVING CELEBRITIES ONLY
  const livingCelebs =
    data.filter(c =>
      c.Age &&
      !c.DeathDate
    );

  // YOUNGEST
  const youngest =
    [...livingCelebs]
    .sort((a,b) =>
      parseInt(a.Age) -
      parseInt(b.Age)
    )
    .slice(0,20);

  renderSpecialSection(
    youngest,
    "youngest"
  );

  // OLDEST
  const oldest =
    [...livingCelebs]
    .sort((a,b) =>
      parseInt(b.Age) -
      parseInt(a.Age)
    )
    .slice(0,20);

  renderSpecialSection(
    oldest,
    "oldest"
  );

 waitCelebritiesReady(loadTrending);
 registerVisit();

});

// RENDER MAIN GRID
function renderCelebrities(data){

  const grid =
    document.getElementById("grid");

  if(!grid) return;

  let html = "";

  data.forEach(celeb => {

    html += `
      <div
        class="card"
        onclick="
          window.location.href=
          'profile.html?id=${celeb.ID}'
        "
      >

        <img
  src="https://lh3.googleusercontent.com/d/${getImageId(celeb.URL)}=w300"
>

        <div class="card-info">

          <h3>
            ${celeb.Name}
          </h3>

          <p>
            ${celeb.Occupation}
          </p>

        </div>

      </div>
    `;
  });

  grid.innerHTML =
    html;
}

// SEARCH
const searchInput =
  document.getElementById("search");

if(searchInput){

  searchInput.addEventListener(
    "input",
    e => {

      const value =
        e.target.value
        .toLowerCase();

  // SHOW / HIDE
  document
    .querySelector(
      "#birthdays"
    )
    .parentElement
    .style.display =
      value
      ? "none"
      : "block";

  document
    .querySelector(
      "#deceased"
    )
    .parentElement
    .style.display =
      value
      ? "none"
      : "block";

  document
    .querySelector(
      "#youngest"
    )
    .parentElement
    .style.display =
      value
      ? "none"
      : "block";

  document
    .querySelector(
      "#oldest"
    )
    .parentElement
    .style.display =
      value
      ? "none"
      : "block";

  // RESET
  if(value === ""){

    const randomCelebs =
      [...celebrities]
      .sort(() =>
        0.5 -
        Math.random()
      )
      .slice(0,20);

    renderCelebrities(
      randomCelebs
    );

    return;
  }

  // FILTER
  const filtered =
    celebrities.filter(c =>
      c.Name &&
      c.Name
      .toLowerCase()
      .includes(value)
    );

  renderCelebrities( 
    filtered
  );
});
}

// SPECIAL SECTIONS
function renderSpecialSection(
  data,
  elementId
){

  const container =
    document.getElementById(
      elementId
    );

  if(!container) return;

  let html = "";

  data.forEach(celeb => {

    html += `
      <div
        class="card"
        onclick="
          window.location.href=
          'profile.html?id=${celeb.ID}'
        "
      >

        <img
  src="https://lh3.googleusercontent.com/d/${getImageId(celeb.URL)}=w300"
>

        <div class="card-info">

          <h3>
            ${celeb.Name}
          </h3>

          <p>
            ${celeb.Occupation}
          </p>

          ${
            elementId ===
            "birthdays"
            ? `
              <p class="birth-date">
                ${formatDate(
                  celeb.BirthDate
                )}
              </p>

              <p class="death-date">
                ${
                  celeb.DeathDate
                  ? `
                    Died at age:
                    ${celeb.Age}
                  `
                  : `
                    Age:
                    ${celeb.Age}
                  `
                }
              </p>
            `
            : ""
          }

          ${
            elementId ===
            "youngest" ||
            elementId ===
            "oldest"
            ? `
              <p class="death-date">
                Age:
                ${celeb.Age}
              </p>
            `
            : ""
          }

          ${
            elementId ===
            "deceased"
            ? `
              <p class="death-date">
                Died:
                ${formatDate(
                  celeb.DeathDate
                )}
              </p>

              <p class="death-date">
                Died at age:
                ${celeb.Age}
              </p>
            `
            : ""
          }

        </div>

      </div>
    `;
  });

  if(html === ""){

    html = `
      <p
        style="
          padding:20px;
          color:#888;
        "
      >
        No celebrities found.
      </p>
    `;
  }

  container.innerHTML =
    html;
}

window.toggleMenu = function(){

  document
    .getElementById("menu")
    .classList
    .toggle("active");
}

async function loadTrending() {

  const container = document.getElementById("trendingToday");
  if (!container) return;

  try {

    const snapshot = await getDocs(collection(db, "starPowers"));

    const points = {};

    snapshot.forEach(docSnap => {
      points[docSnap.id] = docSnap.data()?.points || 0;
    });

    const ranked = celebrities
      .map(c => ({
        ...c,
        points: points[c.ID] || 0
      }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 20);

    container.innerHTML = ranked.map(c => `
      <div class="mini-card"
        onclick="window.location.href='profile.html?id=${c.ID}'">

        <img src="https://lh3.googleusercontent.com/d/${getImageId(c.URL)}=w300">
        <p class="trend-name">${c.Name}</p>
        <p class="trend-occupation">${c.Occupation || ""}</p>
        <small>⭐ ${c.points}</small>

      </div>
    `).join("");

  } catch (err) {
    console.error("Trending error:", err);
    container.innerHTML = `<p style="opacity:.6">Trending unavailable</p>`;
  }
}

async function registerVisit() {

  const today =
    new Date().toDateString();

  const lastVisit =
    localStorage.getItem(
      "lastVisit"
    );

  const ref =
    doc(
      db,
      "siteStats",
      "visits"
    );

  // solo suma si nunca visitó hoy
  if(lastVisit !== today){

    await updateDoc(
      ref,
      {
        count: increment(1)
      }
    );

    localStorage.setItem(
      "lastVisit",
      today
    );
  }

const snap =
  await getDoc(ref);

const counter =
  document.getElementById(
    "visitCounter"
  );

if(counter){

  counter.textContent =
    snap.data().count;
}

console.log(
  "Visits:",
  snap.data().count
);
 }