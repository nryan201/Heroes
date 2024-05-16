// Fetch data from the server
fetch('http://localhost:3000/all.json')
    .then((response) => response.json())
    .then((json) => {
        // Call function to display data in the HTML
        displayData(json);
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });


function displayData(data) {
    const heroId = localStorage.getItem('heroId'); // Récupère l'ID du héros depuis le localStorage

    if (heroId) {
        const hero = data.find(h => h.id === parseInt(heroId));
        if (hero) {
            const heroInfo = document.getElementById('hero-info');
            heroInfo.innerHTML = `
                <h2>${hero.name}</h2>
                ${hero.images.xs ? `<img src="${hero.images.xs}" alt="${hero.name}">` : ''}
                <p><strong>Full Name:</strong> ${hero.biography.fullName}</p>
                <p><strong>Alias</strong> ${hero.biography.aliases}</p>
                <p><strong>Intelligence:</strong> ${hero.powerstats.intelligence}</p>
                <p><strong>Strenght:</strong> ${hero.powerstats.strength}</p>
                <p><strong>Speed:</strong> ${hero.powerstats.speed}</p>
                <p><strong>Durability:</strong> ${hero.powerstats.durability}</p>
                <p><strong>Power:</strong> ${hero.powerstats.power}</p>
                <p><strong>Combat:</strong> ${hero.powerstats.combat}</p>
                <p><strong>Race:</strong> ${hero.appearance.race}</p>
                <p><strong>Gender:</strong> ${hero.appearance.gender}</p>
                <p><strong>Height/Weight:</strong> ${hero.appearance.height} ${hero.appearance.weight}</p>
                <p><strong>Place Of Birth:</strong> ${hero.biography.placeOfBirth}</p>
                <p><strong>Alignment:</strong> ${hero.biography.alignment}</p>
                <p><strong>Occupation:</strong> ${hero.work.occupation}</p>
                <p><strong>Base:</strong> ${hero.work.base}</p>
                <p><strong>Group Affiliation:</strong> ${hero.connections.groupAffiliation}</p>
                <p><strong>Relatives:</strong> ${hero.connections.relatives}</p>
            `;
        } else {
            document.getElementById('hero-info').innerHTML = '<p>Hero not found</p>';
        }
    } else {
        document.getElementById('hero-info').innerHTML = '<p>No hero ID specified</p>';
    }
}
