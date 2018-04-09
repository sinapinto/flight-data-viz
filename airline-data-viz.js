const airlineNameMap = Object.keys(airlines).reduce((acc, cur) => ({ ...acc, [airlines[cur]]: cur }), {});

const counterEl = document.getElementById('counter');
const airlineEl = document.getElementById('airline');
const searchEl = document.getElementById('search');
const animateEl = document.getElementById('animate');

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

const valuesToPoints = (values) => {
    let str = '';
    for (let i = 0; i < values.length; i++) {
        str += `${i*10 + 5},${values[i]} `;
    }
    return str.trim();
};

let fromValues = Array.from({ length: 24 }, () => 100);

const updateGraph = (airlineCode) => {
    const flights = flights_jan_01_2008.filter(flight => {
        if (!isValidFlight(flight)) {
            return false;
        }
        if (!airlineCode) {
            return true;
        }
        return flight.airline === airlineCode;
    });

    // build an array containing the number of flights, where the index represents the hour
    const numFlightsByHour = Array.from({ length: 24 }, () => 0);
    flights.forEach(flight => {
        const hour = Number(flight.time.slice(0, 2));
        if (!isNaN(hour) && hour >= 0 && hour < 24) {
            numFlightsByHour[hour]++;
        }
    });

    const maxValue = numFlightsByHour.reduce((max, cur) => Math.max(max, cur), Number.MIN_VALUE);
    const scale = 100; // this should match the viewBox height
    const toValues = numFlightsByHour.map(num => scale - (num / maxValue) * scale);
    const values = `${valuesToPoints(fromValues)}; ${valuesToPoints(toValues)}`;
    animateEl.setAttribute('values', values);
    animateEl.beginElement();
    fromValues = toValues;

    const numResults = flights.length;
    counterEl.innerHTML = `${numResults} Flight${numResults === 1 ? '' : 's'}`;
    airlineEl.innerHTML = airlineCode ? airlines[airlineCode] : 'All Airlines';
};

doSearch(searchEl.value);
