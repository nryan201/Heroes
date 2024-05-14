fetch('http://localhost:3000/all.json')
    .then((response) => response.json())
    .then((json) => console.log(json));