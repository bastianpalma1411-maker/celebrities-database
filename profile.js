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
  "England":"🏴",
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
  "Northern Ireland":"🏴",
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
  "Scotland":"🏴",
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
  "Wales":"🏴",
  "Zanzibar":"🇹🇿",
  "Algeria":"🇩🇿",
  "Ethiopia":"🇪🇹",
  "Finland":"🇫🇮",
  "Greece":"🇬🇷",
  "Haiti":"🇭🇹",
  "Isle of Man":"🇮🇲"
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
});

// RENDER PROFILE
function renderProfile(celeb){

  const profile =
    document.getElementById("profile");

  profile.innerHTML = `
  
    <div class="profile-container">

      <img
  src="https://lh3.googleusercontent.com/d/${celeb.URL.split('id=')[1]}=w300"
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
    "England":"gb",
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
    "Isle of Man":"im"

  };

  return codes[country] || "un";
}