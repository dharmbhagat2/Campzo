// 🔥 LOAD DASHBOARD DATA
async function loadDashboard() {
    try {
        let eventsRes = await fetch("https://campzo.onrender.com/events");
        let registrationsRes = await fetch("https://campzo.onrender.com/registrations");

        let events = await eventsRes.json();
        let registrations = await registrationsRes.json();

        // ✅ TOTAL COUNTS
        document.getElementById("totalEvents").innerText = events.length;
        document.getElementById("totalRegistrations").innerText = registrations.length;

        // 🔥 TOTAL REVENUE
        let totalRevenue = 0;

        registrations.forEach(r => {
            if (r.amount && r.amount !== "Free") {
                let value = r.amount.replace("₹", "");
                totalRevenue += parseInt(value) || 0;
            }
        });

        document.getElementById("totalRevenue").innerText = "₹" + totalRevenue;

        // ✅ RECENT REGISTRATIONS TABLE
        let table = document.getElementById("recentTable");

        table.innerHTML = `
            <tr>
                <th>Student</th>
                <th>Event</th>
            </tr>
        `;

        if (registrations.length === 0) {
            table.innerHTML += `<tr><td colspan="2">No Data</td></tr>`;
            return;
        }

        // 🔥 SHOW ONLY LATEST 5
        registrations.slice(0, 5).forEach(r => {
            table.innerHTML += `
                <tr>
                    <td>${r.email}</td>
                    <td>${r.title}</td>
                </tr>
            `;
        });

    } catch (err) {
        console.error("DASHBOARD ERROR:", err);
    }
}

// ==========================================
// 🔥 LOAD ANALYTICS (BAR + PIE)
// ==========================================
async function loadAnalytics() {

    try {
        const res = await fetch("https://campzo.onrender.com/registrations");
        const registrations = await res.json();

        if (registrations.length === 0) {
            document.getElementById("barChart").outerHTML = "<p>No Data</p>";
            document.getElementById("pieChart").outerHTML = "<p>No Data</p>";
            return;
        }

        // 🔥 COUNT REGISTRATIONS PER EVENT
        let eventCount = {};

        registrations.forEach(r => {
            eventCount[r.title] = (eventCount[r.title] || 0) + 1;
        });

        let labels = Object.keys(eventCount);
        let data = Object.values(eventCount);

        // 🔥 DESTROY OLD CHARTS
        if (window.barChartInstance) window.barChartInstance.destroy();
        if (window.pieChartInstance) window.pieChartInstance.destroy();

        // 🔵 BAR CHART
        const barCtx = document.getElementById("barChart").getContext("2d");

        window.barChartInstance = new Chart(barCtx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Registrations",
                    data: data,
                    backgroundColor: "#4e73df"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // 🟣 PIE CHART
        const pieCtx = document.getElementById("pieChart").getContext("2d");

        window.pieChartInstance = new Chart(pieCtx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        "#4e73df",
                        "#1cc88a",
                        "#36b9cc",
                        "#f6c23e",
                        "#e74a3b"
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom" // 👈 legend below
                    }
                }
            }
        });

    } catch (err) {
        console.error("ANALYTICS ERROR:", err);
    }
}

// ==========================================
// 🔥 RUN BOTH FUNCTIONS
// ==========================================
window.onload = function () {
    loadDashboard();
    loadAnalytics();
};