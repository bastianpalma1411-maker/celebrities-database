const SHEET_ID =
  "1wWydsOHKeGV34m50w7FdQLnVFd2r1hvt342hL6gCHgc";

const SHEET_NAME =
  "Celebrities";

const url =
`https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

// IMAGE ID FIX
function getImageId(url){

  if(!url)
    return "";

  url = url.trim();

  let match =
    url.match(/[?&]id=([^&]+)/);

  if(match){
    return match[1].trim();
  }

  match =
    url.match(/\/d\/([^/]+)/);

  if(match){
    return match[1].trim();
  }

  match =
    url.match(/uc\?id=([^&]+)/);

  if(match){
    return match[1].trim();
  }

  match =
    url.match(/thumbnail\?id=([^&]+)/);

  if(match){
    return match[1].trim();
  }

  // si la celda tiene solo el ID
  if(
    !url.includes("http") &&
    url.length > 20
  ){
    return url.trim();
  }

  return "";
}

fetch(url)
.then(res => res.json())
.then(data => {

  const container =
    document.getElementById(
      "childrenButtons"
    );

  const uniqueChildren =
    [...new Set(
      data
      .map(c => c.Children)
      .filter(c =>
        c !== "" &&
        c !== undefined
      )
    )]
    .sort((a,b) =>
      parseInt(a) -
      parseInt(b)
    );

  let html = "";

  uniqueChildren
  .forEach(number => {

    const label =
      parseInt(number) === 1
      ? "child"
      : "children";

    html += `
      <button
        class="occupation-btn"
        onclick="
          filterChildren(
            '${number}'
          )
        "
      >
        ${number} ${label}
      </button>
    `;
  });

  container.innerHTML =
    html;

  window.allCelebrities =
    data;
});

function filterChildren(
  number
){

  document.getElementById(
    "childrenButtons"
  ).style.display =
    "none";

  const filtered =
    window.allCelebrities
    .filter(c =>
      c.Children == number
    );

  const results =
    document.getElementById(
      "childrenResults"
    );

  const label =
    parseInt(number) === 1
    ? "child"
    : "children";

  let html = `

    <button
      class="back-btn"
      onclick="showChildren()"
    >
      ← Back to Children
    </button>

    <h2>
      ${number}
      ${label}
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

function showChildren(){

  document.getElementById(
    "childrenButtons"
  ).style.display =
    "flex";

  document.getElementById(
    "childrenResults"
  ).innerHTML =
    "";
}