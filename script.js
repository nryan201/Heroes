
// Const
const input = document.querySelector("#input");
const pageSizeSelect = document.querySelector("#pageSize");
const container = document.getElementById('data-container');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const table = document.createElement('table');

let currentPage = 1;
let pageSize = parseInt(pageSizeSelect.value);
let data = [];

// Fetch data from the server
fetch('http://localhost:3000/all.json')
    .then(response => response.json())
    .then(json => {
        data = json;
        displayData();

        input.addEventListener('input', displayData);

        pageSizeSelect.addEventListener('change', () => {
            pageSize = pageSizeSelect.value === 'all' ? data.length : parseInt(pageSizeSelect.value);
            currentPage = 1;
            displayData();
        });


        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayData();
            }
        });

        nextPageBtn.addEventListener('click', () => {
            if (currentPage * pageSize < filteredData().length) {
                currentPage++;
                displayData();
            }
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

function filteredData() {
    const query = input.value.toLowerCase();
    return data.filter(hero => {
        if (query === "") return true;
        return hero.name.toLowerCase().includes(query);
    });
}

// Function to display data in the HTML
function displayData() {
    const filtered = filteredData();
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = filtered.slice(start, end);

    table.className = 'hero-table';
    table.innerHTML = `
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

    paginatedData.forEach(hero => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${hero.name}</td>
            <td>${hero.images.xs ? `<img src="${hero.images.xs}" alt="${hero.name}" width="50">` : ''}</td>
            <td>${hero.biography.fullName}</td>
            <td>${hero.appearance.race}</td>
            <td>${hero.appearance.gender}</td>
            <td class="powerstats">
                <img src="icons/intelligence.png" alt="Intelligence" title="Intelligence"> ${hero.powerstats.intelligence}
                <img src="icons/strength.png" alt="Strength" title="Strength"> ${hero.powerstats.strength}
                <img src="icons/speed.png" alt="Speed" title="Speed"> ${hero.powerstats.speed}
                <img src="icons/durability.png" alt="Durability" title="Durability"> ${hero.powerstats.durability}
                <img src="icons/power.png" alt="Power" title="Power"> ${hero.powerstats.power}
                <img src="icons/combat.png" alt="Combat" title="Combat"> ${hero.powerstats.combat}
            </td>
            <td>${hero.appearance.height.join(', ')}</td>
            <td>${hero.appearance.weight.join(', ')}</td>
            <td>${hero.biography.placeOfBirth}</td>
            <td>${hero.biography.alignment}</td>
        `;
        row.addEventListener('click', () => {
            localStorage.setItem('heroId', hero.id);
            window.location.href = 'information.html';
        });

        table.appendChild(row);
    });

    container.innerHTML = '';
    container.appendChild(table);

    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filtered.length / pageSize)}`;
}
