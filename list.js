const SHEET_ID =
  "1wWydsOHKeGV34m50w7FdQLnVFd2r1hvt342hL6gCHgc";

const SHEET_NAME =
  "Celebrities";

const url =
  `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

// FIX GOOGLE DRIVE IMAGES
function getImageId(url){

  if(!url)
    return "";

  const idParam =
    url.match(/[?&]id=([^&]+)/);

  if(idParam){
    return idParam[1];
  }

  const dMatch =
    url.match(/\/d\/([^/]+)/);

  if(dMatch){
    return dMatch[1];
  }

  const thumbMatch =
    url.match(
      /thumbnail\?id=([^&]+)/
    );

  if(thumbMatch){
    return thumbMatch[1];
  }

  return "";
}

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
          src="https://lh3.googleusercontent.com/d/${getImageId(celeb.URL)}=w300"
        >

        <p>
          ${celeb.Name}
        </p>

      </div>
    `;
  });

  document.getElementById(
    "celebritiesList"
  ).innerHTML =
    html;
});