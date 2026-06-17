const SHEET_ID =
  "1wWydsOHKeGV34m50w7FdQLnVFd2r1hvt342hL6gCHgc";

const SHEET_NAME =
  "Celebrities";

const url =
`https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

// FIX GOOGLE DRIVE IMAGES
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
    url.match(
      /thumbnail\?id=([^&]+)/
    );

  if(thumbMatch){
    return thumbMatch[1];
  }

  return "";
}

fetch(url)
.then(res => res.json())
.then(data => {

  const container =
    document.getElementById(
      "occupationButtons"
    );

  const uniqueOccupations =
    [...new Set(
      data
      .map(c => c.Occupation)
      .filter(Boolean)
    )]
    .sort();

  let html = "";

  uniqueOccupations
  .forEach(occupation => {

    html += `
      <button
        class="occupation-btn"
        onclick="
          filterOccupation(
            '${occupation.replace(/'/g,"\\'")}'
          )
        "
      >
        ${occupation}
      </button>
    `;
  });

  container.innerHTML =
    html;

  window.allCelebrities =
    data;
});

function filterOccupation(
  occupation
){

  // HIDE BUTTONS
  document.getElementById(
    "occupationButtons"
  ).style.display =
    "none";

  const filtered =
    window.allCelebrities
    .filter(c =>
      c.Occupation ===
      occupation
    );

  const results =
    document.getElementById(
      "occupationResults"
    );

  let html = `

    <button
      class="back-btn"
      onclick="showOccupations()"
    >
      ← Back to Occupations
    </button>

    <h2>
      ${occupation}
    </h2>
  `;

  filtered.forEach(celeb => {

    html += `
      <div
        class="mini-card"
        onclick="
          window.location.href=
          'profile.html?id=${celeb.ID}'
        "
      >

        <img
          src="https://lh3.googleusercontent.com/d/${getImageId(celeb.URL)}=w300"
        >

        <p>
          ${celeb.Name}
        </p>

      </div>
    `;
  });

  results.innerHTML =
    html;
}

function showOccupations(){

  document.getElementById(
    "occupationButtons"
  ).style.display =
    "flex";

  document.getElementById(
    "occupationResults"
  ).innerHTML =
    "";
}