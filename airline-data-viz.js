const airlineNameMap = Object.keys(airlines).reduce((acc, cur) => ({ ...acc, [airlines[cur]]: cur }), {});

const counterEl = document.getElementById('counter');
const airlineEl = document.getElementById('airline');
const searchEl = document.getElementById('search');

searchEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        doSearch(searchEl.value);
    }
});
searchEl.addEventListener('blur', (e) => {
    doSearch(searchEl.value);
});

const doSearch = (query) => {
    const airlineCode = airlineCodeFromName(query.trim());
    updateGraph(airlineCode);
};

const airlineCodeFromName = (query) => {
    if (!query) {
        return null;
    }
    const airlineNames = Object.keys(airlineNameMap);
    const foundName = airlineNames.find(name => name.toLowerCase().includes(query.toLowerCase()));
    if (!foundName) {
        return null;
    }
    return airlineNameMap[foundName];
};

const isValidFlight = (flight) => {
    return typeof flight === 'object'
        && flight !== null
        && typeof flight.airline === 'string'
        && typeof flight.time === 'string';
};

const updateGraph = (airlineCode) => {
    const results = flights_jan_01_2008.filter(flight => {
        if (!isValidFlight(flight)) {
            return false;
        }
        if (!airlineCode) {
            return true;
        }
        return flight.airline === airlineCode;
    });
    const numResults = results.length;
    counterEl.innerHTML = `${numResults} Flight${numResults === 1 ? '' : 's'}`;
    airlineEl.innerHTML = airlineCode ? airlines[airlineCode] : 'All Airlines';
};

updateGraph(null);
