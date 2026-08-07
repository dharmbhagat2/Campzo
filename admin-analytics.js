let barChartInstance;
let pieChartInstance;

function updateCharts(events, registrations) {

    // 🔥 COUNT REGISTRATIONS PER EVENT
    let eventMap = {};

    registrations.forEach(r => {
        eventMap[r.title] = (eventMap[r.title] || 0) + 1;
    });

    let labels = Object.keys(eventMap);
    let values = Object.values(eventMap);

    // =========================
    // 📊 BAR CHART
    // =========================
    if (barChartInstance) barChartInstance.destroy();

    const barCtx = document.getElementById("barChart").getContext("2d");

    barChartInstance = new Chart(barCtx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Registrations",
                data: values,
                backgroundColor: "#4e73df"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // =========================
    // 🥧 PIE CHART
    // =========================
    if (pieChartInstance) pieChartInstance.destroy();

    const pieCtx = document.getElementById("pieChart").getContext("2d");

    pieChartInstance = new Chart(pieCtx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#4e73df",
                    "#f6c23e",
                    "#e74a3b",
                    "#1cc88a",
                    "#36b9cc"
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}
async function loadAnalytics() {

    try {

        const eventRes = await fetch(
            "http://localhost:3000/events"
        );

        const regRes = await fetch(
            "http://localhost:3000/registrations"
        );

        const events = await eventRes.json();
        const registrations = await regRes.json();

        console.log("Events:", events);
        console.log("Registrations:", registrations);

        updateCharts(events, registrations);
        loadRecentRegistrations(registrations);

    }
    catch(error) {

        console.error(error);

    }

}

document.addEventListener(
    "DOMContentLoaded",
    loadAnalytics
);
function loadRecentRegistrations(registrations) {

    const table =
    document.getElementById(
        "recentRegistrations"
    );

    if(!table) return;

    table.innerHTML = "";

    registrations
    .slice()
    .reverse()
    .slice(0, 5)
    .forEach(reg => {

        table.innerHTML += `
        <tr>
            <td>${reg.email || "-"}</td>
            <td>${reg.title || "-"}</td>
        </tr>
        `;

    });

}