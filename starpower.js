const SHEET_ID =
  "1wWydsOHKeGV34m50w7FdQLnVFd2r1hvt342hL6gCHgc";

const SHEET_NAME =
  "Celebrities";

const url =
`https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

fetch(url)
.then(res => res.json())
.then(data => {

  const powers =
    JSON.parse(
      localStorage.getItem(
        "starPowers"
      )
    ) || {};

  const ranked =
    data.map(celeb => {

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
});

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

        <div
          class="card-info"
        >

          <h3>
            #${index + 1}
            ${celeb.Name}
          </h3>

          <p>
            ⭐
            ${celeb.points}
            points
          </p>

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