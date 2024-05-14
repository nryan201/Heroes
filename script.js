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

// Function to display data in the HTML
function displayData(data) {
    const container = document.getElementById('data-container');

    if (Array.isArray(data)) {
        data.forEach(hero => {
            const heroElement = document.createElement('div');
            heroElement.className = 'hero-item';

            // Display specific properties
            heroElement.innerHTML = `
                <h2>${hero.name}</h2>
                ${hero.images.xs ? `<img src="${hero.images.xs}" alt="${hero.name}">` : ''}
                <p>Full Name: ${hero.biography.fullName}</p>
                <p>Race: ${hero.appearance.race}</p>
                <p>Gender: ${hero.appearance.gender}</p>
                <p>Height: ${hero.appearance.height}</p>
                <p>Place Of Birth: ${hero.biography.placeOfBirth}</p>
                <p>Alignment: ${hero.biography.alignment}</p>
            `;
            container.appendChild(heroElement);
        });
    }
}
