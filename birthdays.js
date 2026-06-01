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

  celebrities =
    data;

  const birthDay =
    document.getElementById(
      "birthDay"
    );

  // GENERATE DAYS
  for(
    let i = 1;
    i <= 31;
    i++
  ){

    birthDay.innerHTML += `
      <option value="${i}">
        ${i}
      </option>
    `;
  }

  // AUTO SEARCH
  document
  .getElementById(
    "birthDay"
  )
  .addEventListener(
    "change",
    searchBirthdays
  );

  document
  .getElementById(
    "birthMonth"
  )
  .addEventListener(
    "change",
    searchBirthdays
  );
});

function searchBirthdays(){

  const selectedDay =
    parseInt(
      document.getElementById(
        "birthDay"
      ).value
    );

  const selectedMonth =
    parseInt(
      document.getElementById(
        "birthMonth"
      ).value
    );

  const filtered =
    celebrities.filter(c => {

      if(!c.BirthDate)
        return false;

      const birth =
        new Date(
          c.BirthDate
        );

      return (
        birth.getDate() ===
          selectedDay &&
        birth.getMonth() + 1 ===
          selectedMonth
      );
    });

  const results =
    document.getElementById(
      "birthdayResults"
    );

  let html = "";

  filtered.forEach(
    celeb => {

    html += `
      <div
        class="mini-card"
        onclick="
          window.location.href=
          'profile.html?id=${celeb.ID}'
        "
      >

        <img
  src="https://lh3.googleusercontent.com/d/${celeb.URL.split('id=')[1]}=w300"
>

        <p>
          ${celeb.Name}
        </p>

        <small>
          ${celeb.Occupation}
        </small>

      </div>
    `;
  });

  if(filtered.length === 0){

    html =
    `
      <p>
        No birthdays found.
      </p>
    `;
  }

  results.innerHTML =
    html;
}