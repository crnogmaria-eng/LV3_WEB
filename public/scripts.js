console.log("JS radi");

let svePjesme = []; 
let playlist = []; 

document.addEventListener("DOMContentLoaded", function () {

  fetch("glazba.csv")
    .then(response => response.text())
    .then(csvText => {
      const rezultat = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
      });

      const pjesme = rezultat.data.map(red => ({
        id: red["ID"],
        naslov: red["Naslov"],
        izvodac: red["Izvođač"],
        zanr: red["Žanr"],
        godina: Number(red["Godina"]),
        tempo: Number(red["BPM"]),
        raspolozenje: red["Raspoloženje"]
      }));

      svePjesme = pjesme;

      prikaziTablicu(pjesme);
    })
    .catch(error => console.error("Greška pri dohvaćanju CSV-a:", error));

  // slider
  const tempoSlider = document.getElementById("filter-tempo");
  const tempoValue = document.getElementById("tempo-value");

  tempoSlider.addEventListener("input", () => {
    tempoValue.textContent = tempoSlider.value;
  });

  // filter
  document.getElementById("filtriraj").addEventListener("click", () => {

    const godina = document.getElementById("filter-godina").value;
    const tempo = document.getElementById("filter-tempo").value;
    const mood = document.querySelector('input[name="mood"]:checked').value;

    const filtrirano = svePjesme.filter(p => {
      return (
        (godina === "" || p.godina >= godina) &&
        (tempo === "" || p.tempo >= tempo) &&
        (mood === "" || p.raspolozenje.toLowerCase() === mood.toLowerCase())
      );
    });

    prikaziTablicu(filtrirano);
  });

  // klik na dodaj u playlistu
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("add-btn")) {

      const row = e.target.closest("tr");

      const pjesma = {
        id: row.children[0].textContent,
        naslov: row.children[1].textContent,
        izvodac: row.children[2].textContent,
        zanr: row.children[3].textContent,
        godina: row.children[4].textContent
      };

      if (!playlist.some(p => p.id === pjesma.id)) {
        playlist.push(pjesma);
        updatePlaylist();
      } else {
        alert("Pjesma je već u playlisti!");
      }
    }
  });

  // potvrda playlist
  document.getElementById("potvrdi-playlistu").addEventListener("click", () => {

    if (playlist.length === 0) {
      alert("Playlist je prazna!");
    } else {
      alert(`Uspješno si dodao ${playlist.length} pjesama u playlistu!`);
      playlist = [];
      updatePlaylist();
    }

  });

});


function prikaziTablicu(podaci) {
  const tbody = document.getElementById("music-table-body");

  tbody.innerHTML = "";

  podaci.forEach(pjesma => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${pjesma.id}</td>
      <td>${pjesma.naslov}</td>
      <td>${pjesma.izvodac}</td>
      <td>${pjesma.zanr}</td>
      <td>${pjesma.godina}</td>
      <td>${pjesma.tempo}</td>
      <td>${pjesma.raspolozenje}</td>
      <td><button class="add-btn">Dodaj</button></td>
    `;

    tbody.appendChild(tr);
  });
}


function updatePlaylist() {
  const lista = document.getElementById("lista-playliste");

  lista.innerHTML = "";

  playlist.forEach((p, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${p.naslov} - ${p.izvodac}
      <button onclick="removeFromPlaylist(${index})">Ukloni</button>
    `;

    lista.appendChild(li);
  });
}


function removeFromPlaylist(index) {
  playlist.splice(index, 1);
  updatePlaylist();
}