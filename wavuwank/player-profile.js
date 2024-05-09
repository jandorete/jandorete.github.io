const characters = [];
const replays = [];
let playerName;
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const char = urlParams.get('char');
const url = 'https://wank.wavu.wiki/player/' + id + "/" + char;

async function requestPlayerData() {
    return fetch('https://corsproxy.io/?' + url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Origin': window.location.href,
            'Access-Control-Allow-Origin': '*'
        }
    })
    .then(res => res.text())
    .then(html =>html);
}

function getCurrentCharacter() {
    return characters.find(char => char.selected);
}

function parsePlayerData(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const tables = doc.getElementsByTagName('table');
    parsePlayerName(tables[1]);
    parseRatings(tables[2]);
    parseReplays(tables[3]);
}

function parsePlayerName(namesTable) {
    const rows = namesTable.getElementsByTagName('tr');
    playerName = [...rows][1].getElementsByTagName('td')[0].innerText.trim();
}

function parseRatings(ratingsTable) {
    const rows = ratingsTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    [...rows].forEach((row, index) => {
        const cells = row.getElementsByTagName('td');
        const name = cells[0].getElementsByTagName('a')[0].innerText.trim();
        const rating = cells[1].innerText;

        characters.push({
            name,
            rating,
            selected: (!char && index == 0) || name.toLowerCase() === char
        });
    });
}

function parseReplays(replaysTable) {
    const rows = replaysTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    [...rows].forEach((row, index) => {
        const cells = row.getElementsByTagName('td');
        const date = moment(cells[0].innerText.trim()).format('YYYY-MM-DD');
        const rating = cells[2].innerText.split('\n')[1].trim();
        replays.push({ date, rating });
    });
    replays.reverse();
}

function processPlayerData() {
    const data = [];
    const groupedReplays = Object.groupBy(replays, ({ date }) => date);

    Object.keys(groupedReplays).forEach(key => {
        data.push({ x: key, y: Math.max(...groupedReplays[key].map(replay => parseInt(replay.rating))) });
    });

    const datasets = {
        datasets: [{
            label: 'Max Daily Character Rating',
            data: data,
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const chart = new Chart(
        document.getElementById('canvas-history'),
        {
            type: 'line',
            data: datasets,
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            displayFormats: {
                                day: 'LL',
                                hour: 'LLL',
                                minute: 'LLL'
                            },
                            unit: 'day'
                        }
                    },
                    y: {
                        min: 1200,
                        label: 'Rating'
                    }
                }
            }
        }
    );

    displayCharacterData();
}

function displayCharacterData() {
    document.getElementById('header-player').innerText = playerName;
    document.getElementById('header-character').innerText = getCurrentCharacter().name;
    document.getElementById('header-rating').innerText = "Current Rating: " + getCurrentCharacter().rating;
    document.getElementById('anchor-source').href = url;
}

requestPlayerData()
.then(html => parsePlayerData(html))
.then(() => processPlayerData());