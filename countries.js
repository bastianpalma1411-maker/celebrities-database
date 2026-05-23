const SHEET_ID =
  "1wWydsOHKeGV34m50w7FdQLnVFd2r1hvt342hL6gCHgc";

const SHEET_NAME =
  "Celebrities";

const url =
`https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

// COUNTRY FLAGS
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
  "England":"🇬🇧",
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
  "Northern Ireland":"🇬🇧",
  "Oman":"🇴🇲",
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
  "Zanzibar":"🇹🇿"
};

fetch(url)
.then(res => res.json())
.then(data => {

  const container =
    document.getElementById(
      "countryButtons"
    );

  const uniqueCountries =
    [...new Set(
      data
      .map(c => c.BirthPlace)
      .filter(Boolean)
    )]
    .sort();

  let html = "";

  uniqueCountries
  .forEach(country => {

    const flag =
      countryFlags[country]
      || "🌍";

    html += `
  <button
    class="occupation-btn"
    onclick="
      filterCountry(
        '${country.replace(/'/g,"\\'")}'
      )
    "
  >

    <img
      class="country-flag"
      src="
https://flagcdn.com/24x18/${getCountryCode(country)}.png
      "
    >

    ${country}

  </button>
`;
  });

  container.innerHTML =
    html;

  window.allCelebrities =
    data;
});

function filterCountry(
  country
){

  document.getElementById(
    "countryButtons"
  ).style.display =
    "none";

  const filtered =
    window.allCelebrities
    .filter(c =>
      c.BirthPlace ===
      country
    );

  const results =
    document.getElementById(
      "countryResults"
    );

  let html = `

  <button
    class="back-btn"
    onclick="showCountries()"
  >
    ← Back to Countries
  </button>

  <h2 class="country-title">

    <img
      class="country-title-flag"
      src="
https://flagcdn.com/24x18/${getCountryCode(country)}.png
      "
    >

    ${country}

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

function showCountries(){

  document.getElementById(
    "countryButtons"
  ).style.display =
    "flex";

  document.getElementById(
    "countryResults"
  ).innerHTML =
    "";
}

function getCountryCode(
  country
){

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
    "Northern Ireland":"gb",
    "Oman":"om",
    "Panama":"pa",
    "Philippines":"ph",
    "Poland":"pl",
    "Portugal":"pt",
    "Puerto Rico":"pr",
    "Romania":"ro",
    "Russia":"ru",
    "Scotland":"gb",
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
    "Wales":"gb",
    "Zanzibar":"tz"
  };

  return codes[country]
    || "un";
}