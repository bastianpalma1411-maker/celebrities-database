const SHEET_ID =
  "1wWydsOHKeGV34m50w7FdQLnVFd2r1hvt342hL6gCHgc";

const SHEET_NAME =
  "Celebrities";

const url =
  `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

fetch(url)
.then(res => res.json())
.then(data => {

  data.sort((a,b) =>
    a.Name.localeCompare(b.Name)
  );

  let html = "";

  data.forEach(celeb => {

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

    <p>${celeb.Name}</p>

  </div>
`;
  });

  document.getElementById(
    "celebritiesList"
  ).innerHTML = html;
});