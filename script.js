document.addEventListener('DOMContentLoaded', () => {
    showTime();
    setupData();
});

function showTime() {
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const session = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    hours = hours.toString().padStart(2, "0");

    const time = `${hours}:${minutes}:${seconds} ${session}`;
    document.getElementById("clockDisplay").textContent = time;

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");

    document.getElementById("date").textContent = `Date: ${month} / ${day} / ${year}`;

    setTimeout(showTime, 1000);
}

function setupData() {
    const input = document.getElementById("myInput");
    const btn = document.getElementById("submit");

    const countryLabel = document.getElementById("country");
    const lastUP = document.getElementById("lastUP");

    const statsMapping = {
        Active_Cases: "cases.active",
        Total_Cases: "cases.total",
        Recovered_Cases: "cases.recovered",
        Critical_Cases: "cases.critical",
        Total_Death: "deaths.total",
        Covid_Tests: "tests.total"
    };

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '9bbe6884d5msh737dc3cf474112ap10e713jsna91712890c69',
            'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
        }
    };

    function getNested(obj, path) {
        return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? "N/A";
    }

    input.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            btn.click();
        }
    });

    btn.addEventListener("click", () => {
        fetchData(input.value.trim(), statsMapping, options, countryLabel, lastUP, getNested);
    });
}

function fetchData(country, statsMapping, options, countryLabel, lastUP, getNested) {
    if (!country) return alert("Please enter or select a country.");

    fetch(`https://covid-193.p.rapidapi.com/statistics?country=${country}`, options)
        .then(response => response.json())
        .then(data => {
            const stats = data.response[0];

            for (const [id, path] of Object.entries(statsMapping)) {
                const el = document.getElementById(id);
                if (el) el.textContent = getNested(stats, path);
            }

            countryLabel.textContent = country;
            lastUP.textContent = `Last Update: ${stats.time ?? "N/A"}`;

        })
        .catch(err => {
            console.error(err);
            alert("Failed to fetch data or No data to display. Please try again.");
        });
}
