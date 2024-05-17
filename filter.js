const sortStates = {};


const extractHeight = (hero) => {
    const heightArray = hero.appearance.height;
    if (Array.isArray(heightArray) && heightArray.length > 1) {
        const heightInFeet = heightArray[0];
        const heightInCm = heightArray[1];

        if (heightInFeet === "-0" || heightInCm === "-0") {
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


const applyFilters = (data, column) => {
 
    sortStates[column] = sortStates[column] === 'asc' ? 'desc' : 'asc';

    let sortedData = [...data];

    switch (column) {
        case 'name':
            sortedData.sort((a, b) => {
                const nameA = a.name.replace(/^\(.*\)\s*/, '');
                const nameB = b.name.replace(/^\(.*\)\s*/, '');
                return sortStates[column] === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            });
            break;
        case 'fullName':
            sortedData.sort((a, b) => {
                const fullNameA = a.biography.fullName || '';
                const fullNameB = b.biography.fullName || '';
                return sortStates[column] === 'asc' ? fullNameA.localeCompare(fullNameB) : fullNameB.localeCompare(fullNameA);
            });
            break;
        case 'race':
            sortedData.sort((a, b) => {
                const raceA = (a.appearance.race || '').replace(/^\(.*\)\s*/, '');
                const raceB = (b.appearance.race || '').replace(/^\(.*\)\s*/, '');
                return sortStates[column] === 'asc' ? raceA.localeCompare(raceB) : raceB.localeCompare(raceA);
            });
            break;
        case 'gender':
            sortedData.sort((a, b) => {
                const genderA = a.appearance.gender || '';
                const genderB = b.appearance.gender || '';
                return sortStates[column] === 'asc' ? genderA.localeCompare(genderB) : genderB.localeCompare(genderA);
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
        case 'height':
            sortedData.sort((a, b) => {
                const heightA = extractHeight(a);
                const heightB = extractHeight(b);
                return sortStates[column] === 'asc' ? heightA - heightB : heightB - heightA;
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
};