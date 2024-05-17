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
let currentSortColumn = 'name';

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
function displayData(sortedData = data) {
    const filtered = filteredData();
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = sortedData.slice(start, end);

    table.className = 'hero-table';
    table.innerHTML = `
        <tr>
            <th onclick="sortTable('name')">Name</th>
            <th>Photo</th>
            <th onclick="sortTable('fullName')">Full Name</th>
            <th onclick="sortTable('race')">Race</th>
            <th onclick="sortTable('gender')">Gender</th>
            <th onclick="sortTable('powerstats')">Powerstats</th>
            <th onclick="sortTable('height')">Height</th>
            <th onclick="sortTable('weight')">Weight</th>
            <th onclick="sortTable('placeOfBirth')">Place Of Birth</th>
            <th onclick="sortTable('alignment')">Alignment</th>
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

let sortStates = {
    name: 'asc',
    fullName: 'asc',
    race: 'asc',
    gender: 'asc',
    powerstats: 'asc',
    height: 'asc',
    weight: 'asc',
    placeOfBirth: 'asc',
    alignment: 'asc'
};

const extractHeight = (hero) => {
    const heightArray = hero.appearance.height;
    if (Array.isArray(heightArray) && heightArray.length > 1) {
        const heightInFeet = heightArray[0];
        const heightInCm = heightArray[1];

        if (heightInFeet === "-" || heightInCm === "-") {
            return Number.POSITIVE_INFINITY;
        }

        if (typeof heightInFeet === 'string' && heightInFeet.includes('ft')) {
            const feetValue = parseFloat(heightInFeet);
            const feetInCm = feetValue * 30.48;
            return feetInCm;
        } else if (typeof heightInCm === 'string') {
            if (heightInCm.includes('cm')) {
                const cmValue = parseFloat(heightInCm);
                return cmValue;
            } else if (heightInCm.includes('m')) {
                const metersValue = parseFloat(heightInCm);
                const metersInCm = metersValue * 100;
                return metersInCm;
            }
        }
    }
    return 0;
};

function sortTable(column) {
    if (sortStates[column] === 'asc') {
        sortStates[column] = 'desc';
    } else {
        sortStates[column] = 'asc';
    }

    let sortedData = [...data];
    switch (column) {
        case 'name':
            sortedData.sort((a, b) => {
                const nameA = a.name.replace(/^\(.*\)\s*/, '');
                const nameB = b.name.replace(/^\(.*\)\s*/, '');

                if (!nameA || !/[a-zA-Z]/.test(nameA)) return 1;
                if (!nameB || !/[a-zA-Z]/.test(nameB)) return -1;

                if (sortStates[column] === 'asc') {
                    return nameA.localeCompare(nameB);
                } else {
                    return nameB.localeCompare(nameA);
                }
            });
            break;
        case 'powerstats':
            sortedData.sort((a, b) => {
                const sumA = Object.values(a.powerstats).reduce((acc, val) => acc + parseInt(val), 0);
                const sumB = Object.values(b.powerstats).reduce((acc, val) => acc + parseInt(val), 0);

                if (sortStates[column] === 'asc') {
                    return sumA - sumB;
                } else {
                    return sumB - sumA;
                }
            });
            break;
        case 'fullName':
            sortedData.sort((a, b) => {
                if (!a.biography.fullName) return 1;
                if (!b.biography.fullName) return -1;

                if (sortStates[column] === 'asc') {
                    return a.biography.fullName.localeCompare(b.biography.fullName);
                } else {
                    return b.biography.fullName.localeCompare(a.biography.fullName);
                }
            });
            break;
        case 'race':
            sortedData.sort((a, b) => {
                const raceA = (a.appearance.race || '').replace(/^\(.*\)\s*/, '');
                const raceB = (b.appearance.race || '').replace(/^\(.*\)\s*/, '');

                if (!raceA || !/[a-zA-Z]/.test(raceA)) return 1;
                if (!raceB || !/[a-zA-Z]/.test(raceB)) return -1;

                if (sortStates[column] === 'asc') {
                    return raceA.localeCompare(raceB);
                } else {
                    return raceB.localeCompare(raceA);
                }
            });
            break;
        case 'gender':
            sortedData.sort((a, b) => {
                if (!a.appearance.gender && b.appearance.gender !== "-") return 1;
                if (!b.appearance.gender && a.appearance.gender !== "-") return -1;
                if (a.appearance.gender === "-" && b.appearance.gender !== "-") return 1;
                if (b.appearance.gender === "-" && a.appearance.gender !== "-") return -1;

                if (sortStates[column] === 'asc') {
                    return a.appearance.gender.localeCompare(b.appearance.gender);
                } else {
                    return b.appearance.gender.localeCompare(a.appearance.gender);
                }
            });
            break;
        case 'height':
            sortedData.sort((a, b) => {
                const heightA = extractHeight(a);
                const heightB = extractHeight(b);

                if (sortStates[column] === 'asc') {
                    return heightA - heightB;
                } else {
                    return heightB - heightA;
                }
            });
            break;
        case 'weight':
            sortedData.sort((a, b) => {
                if (sortStates[column] === 'asc') {
                    return parseInt(a.appearance.weight) - parseInt(b.appearance.weight);
                } else {
                    return parseInt(b.appearance.weight) - parseInt(a.appearance.weight);
                }
            });
            break;
        case 'placeOfBirth':
            sortedData.sort((a, b) => {
                const placeOfBirthA = a.biography.placeOfBirth.replace(/^\(.*\)\s*/, '');
                const placeOfBirthB = b.biography.placeOfBirth.replace(/^\(.*\)\s*/, '');

                if (!placeOfBirthA || !/[a-zA-Z]/.test(placeOfBirthA)) return 1;
                if (!placeOfBirthB || !/[a-zA-Z]/.test(placeOfBirthB)) return -1;

                if (sortStates[column] === 'asc') {
                    return placeOfBirthA.localeCompare(placeOfBirthB);
                } else {
                    return placeOfBirthB.localeCompare(placeOfBirthA);
                }
            });
            break;
        case 'alignment':
            sortedData.sort((a, b) => {
                const alignmentA = a.biography.alignment.replace(/^\(.*\)\s*/, '');
                const alignmentB = b.biography.alignment.replace(/^\(.*\)\s*/, '');

                if (!alignmentA || !/[a-zA-Z]/.test(alignmentA)) return 1;
                if (!alignmentB || !/[a-zA-Z]/.test(alignmentB)) return -1;

                if (sortStates[column] === 'asc') {
                    return alignmentA.localeCompare(alignmentB);
                } else {
                    return alignmentB.localeCompare(alignmentA);
                }
            });
            break;
        default:
            return;
    }

    sortedData = sortedData.filter(hero => !hero.appearance.height.includes("-"))
        .concat(sortedData.filter(hero => hero.appearance.height.includes("-")));

    displayData(sortedData);
}
