const SHEET_ID =
  "1wWydsOHKeGV34m50w7FdQLnVFd2r1hvt342hL6gCHgc";

const SHEET_NAME =
  "Celebrities";

const url =
  `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

let celeb;

const countryFlags = {

  "Argentina":"🇦🇷",
  "Australia":"🇦🇺",
  "Austria":"🇦🇹",
  "Barbados":"🇧🇧",
  "Belgium":"🇧🇪",
  "Benin":"🇧🇯",
  "Bermuda":"🇧🇲",
  "Brazil":"🇧🇷",
  "Bulgaria":"🇧🇬",
  "Cameroon":"🇨🇲",
  "Canada":"🇨🇦",
  "Chile":"🇨🇱",
  "China":"🇨🇳",
  "Colombia":"🇨🇴",
  "Croatia":"🇭🇷",
  "Cuba":"🇨🇺",
  "Czech Republic":"🇨🇿",
  "Denmark":"🇩🇰",
  "Egypt":"🇪🇬",
  "England":"gb-eng",
  "France":"🇫🇷",
  "Georgia":"🇬🇪",
  "Germany":"🇩🇪",
  "Guatemala":"🇬🇹",
  "Hong Kong":"🇭🇰",
  "Iceland":"🇮🇸",
  "India":"🇮🇳",
  "Ireland":"🇮🇪",
  "Israel":"🇮🇱",
  "Italy":"🇮🇹",
  "Ivory Coast":"🇨🇮",
  "Jamaica":"🇯🇲",
  "Japan":"🇯🇵",
  "Jersey":"🇯🇪",
  "Kosovo":"🇽🇰",
  "Lebanon":"🇱🇧",
  "Malaysia":"🇲🇾",
  "Mexico":"🇲🇽",
  "Monaco":"🇲🇨",
  "Morocco":"🇲🇦",
  "Netherlands":"🇳🇱",
  "New Zealand":"🇳🇿",
  "Nigeria":"🇳🇬",
  "North Macedonia":"🇲🇰",
  "Northern Ireland":"gb-nir",
  "Norway":"🇳🇴",
  "Oman":"🇴🇲",
  "Pakistan":"🇵🇰",
  "Panama":"🇵🇦",
  "Philippines":"🇵🇭",
  "Poland":"🇵🇱",
  "Portugal":"🇵🇹",
  "Puerto Rico":"🇵🇷",
  "Romania":"🇷🇴",
  "Russia":"🇷🇺",
  "Scotland":"gb-sct",
  "Serbia":"🇷🇸",
  "Singapore":"🇸🇬",
  "Slovakia":"🇸🇰",
  "Slovenia":"🇸🇮",
  "South Africa":"🇿🇦",
  "South Korea":"🇰🇷",
  "Spain":"🇪🇸",
  "Sudan":"🇸🇩",
  "Sweden":"🇸🇪",
  "Switzerland":"🇨🇭",
  "Taiwan":"🇹🇼",
  "Trinidad and Tobago":"🇹🇹",
  "Turkey":"🇹🇷",
  "Ukraine":"🇺🇦",
  "United States":"🇺🇸",
  "Uruguay":"🇺🇾",
  "Vietnam":"🇻🇳",
  "Wales":"gb-wls",
  "Zanzibar":"🇹🇿",
  "Algeria":"🇩🇿",
  "Ethiopia":"🇪🇹",
  "Finland":"🇫🇮",
  "Greece":"🇬🇷",
  "Haiti":"🇭🇹",
  "Isle of Man":"🇮🇲",
  "Dominican Republic":"🇩🇴",
  "Gibraltar":"🇬🇮",
  "Iran":"🇮🇷",
  "Namibia":"🇳🇦",
  "Somalia":"🇸🇴",
  "Venezuela":"🇻🇪",
};

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

loadStarPower(
  celeb.ID
);

});

// RENDER PROFILE
function renderProfile(celeb){

  const profile =
    document.getElementById("profile");

  profile.innerHTML = `
  
    <div class="profile-container">

  <div class="left-column">

  <img
    class="profile-img"
    src="https://lh3.googleusercontent.com/d/${celeb.URL.split('id=')[1]}=w300"
  >

  <div class="star-power-box">

    <h3>⭐ Star Power</h3>

    <p id="starPowerCount">
      0 points
    </p>

    <button
      id="boostBtn"
      onclick="increaseStarPower()"
    >
      ⭐ Boost
    </button>

    <button
      id="removeBoostBtn"
      onclick="decreaseStarPower()"
    >
      ➖ Remove
    </button>

  </div>

</div>

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
  <strong>Birth Place:</strong>

  ${
    celeb.BirthPlace
      ? `
        <img
          class="birthplace-flag"
          src="https://flagcdn.com/24x18/${getCountryCode(celeb.BirthPlace)}.png"
        >
        ${celeb.BirthPlace}
      `
      : "—"
  }
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

function getCountryCode(country){

  const codes = {

    "Argentina":"ar",
    "Australia":"au",
    "Austria":"at",
    "Barbados":"bb",
    "Belgium":"be",
    "Benin":"bj",
    "Bermuda":"bm",
    "Brazil":"br",
    "Bulgaria":"bg",
    "Cameroon":"cm",
    "Canada":"ca",
    "Chile":"cl",
    "China":"cn",
    "Colombia":"co",
    "Croatia":"hr",
    "Cuba":"cu",
    "Czech Republic":"cz",
    "Denmark":"dk",
    "Egypt":"eg",
    "England":"gb-eng",
    "France":"fr",
    "Georgia":"ge",
    "Germany":"de",
    "Guatemala":"gt",
    "Hong Kong":"hk",
    "Iceland":"is",
    "India":"in",
    "Ireland":"ie",
    "Israel":"il",
    "Italy":"it",
    "Ivory Coast":"ci",
    "Jamaica":"jm",
    "Japan":"jp",
    "Jersey":"je",
    "Kosovo":"xk",
    "Lebanon":"lb",
    "Malaysia":"my",
    "Mexico":"mx",
    "Monaco":"mc",
    "Morocco":"ma",
    "Netherlands":"nl",
    "New Zealand":"nz",
    "Nigeria":"ng",
    "North Macedonia":"mk",
    "Northern Ireland":"gb-nir",
    "Norway":"no",
    "Oman":"om",
    "Pakistan":"pk",
    "Panama":"pa",
    "Philippines":"ph",
    "Poland":"pl",
    "Portugal":"pt",
    "Puerto Rico":"pr",
    "Romania":"ro",
    "Russia":"ru",
    "Scotland":"gb-sct",
    "Serbia":"rs",
    "Singapore":"sg",
    "Slovakia":"sk",
    "Slovenia":"si",
    "South Africa":"za",
    "South Korea":"kr",
    "Spain":"es",
    "Sudan":"sd",
    "Sweden":"se",
    "Switzerland":"ch",
    "Taiwan":"tw",
    "Trinidad and Tobago":"tt",
    "Turkey":"tr",
    "Ukraine":"ua",
    "United States":"us",
    "Uruguay":"uy",
    "Vietnam":"vn",
    "Wales":"gb-wls",
    "Zanzibar":"tz",
    "Algeria":"dz",
    "Ethiopia":"et",
    "Finland":"fi",
    "Greece":"gr",
    "Haiti":"ht",
    "Isle of Man":"im",
    "Dominican Republic":"do",
    "Gibraltar":"gi",
    "Iran":"ir",
    "Namibia":"na",
    "Somalia":"so",
    "Venezuela":"ve",
  };

  return codes[country] || "un";
}

// STAR POWER

let currentCelebrityId = null;

function loadStarPower(id){

  currentCelebrityId = id;

  const powers =
    JSON.parse(
      localStorage.getItem(
        "starPowers"
      )
    ) || {};

  const points =
    powers[id] || 0;

  document.getElementById(
    "starPowerCount"
  ).textContent =
    `${points} points`;
}

function increaseStarPower(){

  const powers =
    JSON.parse(
      localStorage.getItem(
        "starPowers"
      )
    ) || {};

  powers[currentCelebrityId] =
    (powers[currentCelebrityId] || 0)
    + 1;

  localStorage.setItem(
    "starPowers",
    JSON.stringify(powers)
  );

  loadStarPower(
    currentCelebrityId
  );
}

function decreaseStarPower(){

  const powers =
    JSON.parse(
      localStorage.getItem(
        "starPowers"
      )
    ) || {};

  if(
    !powers[currentCelebrityId]
    ||
    powers[currentCelebrityId]
    <= 0
  ){
    return;
  }

  powers[currentCelebrityId]--;

  localStorage.setItem(
    "starPowers",
    JSON.stringify(powers)
  );

  loadStarPower(
    currentCelebrityId
  );
}