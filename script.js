const SHEET_ID =
  "1wWydsOHKeGV34m50w7FdQLnVFd2r1hvt342hL6gCHgc";

const SHEET_NAME =
  "Celebrities";

const url =
  `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

let celebrities = [];

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
.then(data => {

  celebrities = data;

  // RANDOM CELEBRITIES
  const randomCelebs =
    [...data]
    .sort(() => 0.5 - Math.random())
    .slice(0,20);

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
});

// RENDER MAIN GRID
function renderCelebrities(
  data
){

  const grid =
    document.getElementById(
      "grid"
    );

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
  src="https://lh3.googleusercontent.com/d/${celeb.URL.split('id=')[1]}=w300"
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
document
.getElementById("search")
.addEventListener(
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

// SPECIAL SECTIONS
function renderSpecialSection(
  data,
  elementId
){

  const container =
    document.getElementById(
      elementId
    );

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
  src="https://lh3.googleusercontent.com/d/${celeb.URL.split('id=')[1]}=w300"
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