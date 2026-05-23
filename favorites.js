const favorites =
  JSON.parse(
    localStorage.getItem("favorites")
  ) || [];

const grid =
  document.getElementById(
    "favoritesGrid"
  );

if(favorites.length === 0){

  grid.innerHTML = `
    <p
      style="
        color:white;
        padding:20px;
      "
    >
      No favorites yet.
    </p>
  `;
}

else{

  let html = "";

  favorites.forEach(celeb => {

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

        <small>
          ${celeb.Occupation}
        </small>

        <button
          class="remove-btn"
          onclick="
            removeFavorite(
              '${celeb.ID}'
            );
            event.stopPropagation();
          "
        >
          ❌
        </button>

      </div>
    `;
  });

  grid.innerHTML = html;
}

function removeFavorite(id){

  let favorites =
    JSON.parse(
      localStorage.getItem("favorites")
    ) || [];

  favorites =
    favorites.filter(f =>
      f.ID !== id
    );

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );

  location.reload();
}