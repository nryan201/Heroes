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
    const table = document.createElement('table');
    table.className = 'hero-table';

    // Create table header
    const header = `
        <tr>
            <th>Name</th>
            <th>Photo</th>
            <th>Full Name</th>
            <th>Race</th>
            <th>Gender</th>
            <th>Powerstats</th>
            <th>Height</th>
            <th>Weight</th>
            <th>Place Of Birth</th>
            <th>Alignment</th>
        </tr>
    `;
    table.innerHTML = header;

    if (Array.isArray(data)) {
        data.forEach(hero => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${hero.name}</td>
                <td>${hero.images.xs ? `<img src="${hero.images.xs}" alt="${hero.name}" width="50">` : ''}</td>
                <td>${hero.biography.fullName}</td>
                <td>${hero.appearance.race}</td>
                <td>${hero.appearance.gender}</td>
                <td class="powerstats">
                    <img src="icons/Intelligence.png" alt="Intelligence" title="Intelligence"> ${hero.powerstats.intelligence}
                    <img src="icons/Strength.png" alt="Strength" > ${hero.powerstats.strength},
                    <img src="icons/Speed.png" alt="Speed" > ${hero.powerstats.speed},
                    <img src="icons/Durability.png" alt="Durability" > ${hero.powerstats.durability},
                    <img src="icons/Power.png" alt="Power" > ${hero.powerstats.power},
                    <img src="icons/Combat.png" alt="Combat" > ${hero.powerstats.combat}
                </td>
                
                <td>${hero.appearance.height}</td>
                <td>${hero.appearance.weight}</td>
                <td>${hero.biography.placeOfBirth}</td>
                <td>${hero.biography.alignment}</td>
            `;
            row.addEventListener('click', () => {
                localStorage.setItem('heroId', hero.id);
                window.location.href = 'information.html';
            });

            table.appendChild(row);
        });
    }

    container.appendChild(table);
}


