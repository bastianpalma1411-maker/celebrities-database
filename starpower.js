const SHEET_ID =
  "1wWydsOHKeGV34m50w7FdQLnVFd2r1hvt342hL6gCHgc";

const SHEET_NAME =
  "Celebrities";

const url =
`https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

let celebrities = [];

fetch(url)
.then(res => res.json())
.then(data => {

  celebrities = data;

  updateRanking();
});

function updateRanking(){

  const powers =
    JSON.parse(
      localStorage.getItem(
        "starPowers"
      )
    ) || {};

  const ranked =
    celebrities
    .map(celeb => {

      return {

        ...celeb,

        points:
          powers[
            celeb.ID
          ] || 0
      };
    })
    .sort((a,b) =>
      b.points - a.points
    );

  renderRanking(
    ranked
  );
}

function renderRanking(data){

  const grid =
    document.getElementById(
      "rankingGrid"
    );

  let html = "";

  data.forEach(
    (celeb,index) => {

    html += `

      <div
        class="card"
        onclick="
          window.location.href=
          'profile.html?id=${celeb.ID}'
        "
      >

        <img
          src="
https://lh3.googleusercontent.com/d/${celeb.URL.split('id=')[1]}=w300
          "
        >

        <div class="card-info">

          <h3>
            #${index + 1}
            ${celeb.Name}
          </h3>

          <p
             id="points-${celeb.ID}"
            >
             ⭐ ${celeb.points}
             points
          </p>

          <p>
            ${celeb.Occupation}
          </p>

          <button
            class="star-btn"
            onclick="
              event.stopPropagation();
              boostCelebrity('${celeb.ID}')
            "
          >
            ⭐ Boost
          </button>

          <button
            class="remove-star-btn"
            onclick="
              event.stopPropagation();
              removeBoost('${celeb.ID}')
            "
          >
            ➖ Remove
          </button>

        </div>

      </div>
    `;
  });

  grid.innerHTML =
    html;
}

function boostCelebrity(id){

  const powers =
    JSON.parse(
      localStorage.getItem(
        "starPowers"
      )
    ) || {};

  powers[id] =
    (powers[id] || 0) + 1;

  localStorage.setItem(
    "starPowers",
    JSON.stringify(powers)
  );

  // UPDATE ONLY TEXT
  const pointsElement =
    document.getElementById(
      `points-${id}`
    );

  pointsElement.textContent =
    `⭐ ${powers[id]} points`;
}

function removeBoost(id){

  const powers =
    JSON.parse(
      localStorage.getItem(
        "starPowers"
      )
    ) || {};

  if(
    !powers[id]
    ||
    powers[id] <= 0
  ){
    return;
  }

  powers[id]--;

  localStorage.setItem(
    "starPowers",
    JSON.stringify(powers)
  );

  const pointsElement =
  document.getElementById(
    `points-${id}`
  );

pointsElement.textContent =
  `⭐ ${powers[id]} points`;
}