const SHEET_ID =
  "1wWydsOHKeGV34m50w7FdQLnVFd2r1hvt342hL6gCHgc";

const SHEET_NAME =
  "Celebrities";

const url =
  `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

let celeb;

// GET ID FROM URL
const params =
  new URLSearchParams(
    window.location.search
  );

const celebId =
  params.get("id");

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

  celeb =
    data.find(c =>
      c.ID === celebId
    );

  if(!celeb){

    document.body.innerHTML =
      "<h1>Celebrity not found</h1>";

    return;
  }

  renderProfile(celeb);
});

// RENDER PROFILE
function renderProfile(celeb){

  const profile =
    document.getElementById("profile");

  profile.innerHTML = `
  
    <div class="profile-container">

      <img
        class="profile-img"
        src="https://drive.google.com/thumbnail?id=${celeb.URL.split('id=')[1]}"
      >

      <div class="profile-info">

        <h1>${celeb.Name}</h1>

        <h2>ID #${celeb.ID}</h2>

        <p>
          <strong>Age:</strong>
          ${celeb.Age}
        </p>

        <p>
          <strong>Birth Date:</strong>
          ${formatDate(celeb.BirthDate)}
        </p>

        ${
          celeb.DeathDate
          ? `
            <p>
              <strong>Death Date:</strong>
              ${formatDate(celeb.DeathDate)}
            </p>
          `
          : ""
        }

        <p>
          <strong>Occupation:</strong>
          ${celeb.Occupation}
        </p>

        <p>
          <strong>Children:</strong>
          ${celeb.Children || "—"}
        </p>

        <p>
          <strong>Zodiac Sign:</strong>
          ${celeb.ZodiacSign || "—"}
        </p>

        <button id="favoriteBtn">
          ❤️ Add to Favorites
        </button>

      </div>

    </div>
  `;

  // FAVORITES
  const favoriteBtn =
    document.getElementById(
      "favoriteBtn"
    );

  favoriteBtn.addEventListener(
    "click",
    () => {

      let favorites =
        JSON.parse(
          localStorage.getItem(
            "favorites"
          )
        ) || [];

      const alreadyExists =
        favorites.some(f =>
          f.ID === celeb.ID
        );

      if(alreadyExists){

        alert(
          "Already in favorites!"
        );

        return;
      }

      favorites.push({
        ID: celeb.ID,
        Name: celeb.Name,
        URL: celeb.URL,
        Occupation:
          celeb.Occupation
      });

      localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
      );

      alert(
        "Added to favorites!"
      );
    }
  );
}