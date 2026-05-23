const SHEET_ID =
  "1wWydsOHKeGV34m50w7FdQLnVFd2r1hvt342hL6gCHgc";

const SHEET_NAME =
  "Celebrities";

const url =
`https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

fetch(url)
.then(res => res.json())
.then(data => {

  const container =
    document.getElementById(
      "zodiacButtons"
    );

  const uniqueSigns =
    [...new Set(
      data
      .map(c => c.ZodiacSign)
      .filter(Boolean)
    )]
    .sort();

  let html = "";

  uniqueSigns
  .forEach(sign => {

    html += `
      <button
        class="occupation-btn"
        onclick="
          filterZodiac(
            '${sign.replace(/'/g,"\\'")}'
          )
        "
      >
        ${sign}
      </button>
    `;
  });

  container.innerHTML =
    html;

  window.allCelebrities =
    data;
});

function filterZodiac(
  sign
){

  // HIDE BUTTONS
  document.getElementById(
    "zodiacButtons"
  ).style.display =
    "none";

  const filtered =
    window.allCelebrities
    .filter(c =>
      c.ZodiacSign === sign
    );

  const results =
    document.getElementById(
      "zodiacResults"
    );

  let html = `

    <button
      class="back-btn"
      onclick="showZodiac()"
    >
      ← Back to Zodiac Signs
    </button>

    <h2>
      ${sign}
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
          loading="lazy"
          src="
https://drive.google.com/thumbnail?id=${celeb.URL.split('id=')[1]}"
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

function showZodiac(){

  document.getElementById(
    "zodiacButtons"
  ).style.display =
    "flex";

  document.getElementById(
    "zodiacResults"
  ).innerHTML =
    "";
}