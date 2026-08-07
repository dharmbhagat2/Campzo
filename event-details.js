let currentEvent = null;

// 🔥 GET SELECTED EVENT ID
let eventId = localStorage.getItem("selectedEventId");

if (!eventId) {
    document.body.innerHTML = "<h2>No Event Selected</h2>";
}

// 🔥 LOAD EVENT DATA
fetch("https://campzo.onrender.com/events")
    .then(res => res.json())
    .then(events => {

        currentEvent = events.find(e => e.id == eventId);

        if (!currentEvent) {
            document.body.innerHTML = "<h2>Event Not Found</h2>";
            return;
        }

        // ✅ TITLE + DESCRIPTION
        document.getElementById("eventTitle").innerText = currentEvent.title;
        document.getElementById("eventDescription").innerText = currentEvent.description;

        // ==========================
        // 🔥 DATE + TIME FIX
        // ==========================
        let formattedDate = "";
        let formattedTime = "";

        if (currentEvent.date) {
            const d = new Date(currentEvent.date);

            formattedDate = d.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });

            // 🔥 If backend has NO time → use ISO time (fix your current issue)
            if (!currentEvent.time || currentEvent.time === "null") {
                formattedTime = d.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit"
                });
            }
        }

        // 🔥 If time exists → override
        if (currentEvent.time && currentEvent.time !== "null") {
            const [hour, minute] = currentEvent.time.split(":");

            const t = new Date();
            t.setHours(hour, minute);

            formattedTime = t.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit"
            });
        }

        document.getElementById("eventDate").innerText =
            formattedTime
                ? `${formattedDate} | ${formattedTime}`
                : formattedDate;

        // ==========================
        // 🔥 PRICE FIX (NO DOUBLE ₹)
        // ==========================
        const priceElement = document.getElementById("eventPrice");

        if (!currentEvent.price || currentEvent.price === "Free" || currentEvent.price === "0") {
            priceElement.innerText = "Free";
        } else {
            let cleanPrice = currentEvent.price.toString().replace("₹", "").trim();
            priceElement.innerText = "₹ " + cleanPrice;
        }

        // ==========================
        // 🔥 CONTACT
        // ==========================
        document.getElementById("eventMobile").innerText = currentEvent.mobile;
        document.getElementById("eventEmail").innerText = currentEvent.email;

        // ==========================
        // 🔥 IMAGE FIX (VERY IMPORTANT)
        // ==========================
        const img = document.getElementById("eventImage");

        if (currentEvent.image && currentEvent.image !== "null") {

            // if already full URL
            if (currentEvent.image.startsWith("http")) {
                img.src = currentEvent.image;
            } else {
                img.src = `https://campzo.onrender.com/uploads/${currentEvent.image}`;
            }

        } else {
            img.src = "https://via.placeholder.com/400";
        }

    })
    .catch(err => console.error("Error:", err));


// ==========================
// 🔥 REGISTER FUNCTION
// ==========================
async function registerEvent() {

    let userEmail = localStorage.getItem("loggedUser");
    let userName = localStorage.getItem("loggedUserName");

    if (!userEmail || !userName) {
        showToast("Please login first", "error");
        return;
    }

    if (!currentEvent) {
        showToast("Event not loaded", "error");
        return;
    }

    try {

        const response = await fetch("https://campzo.onrender.com/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: userName,
                email: userEmail,
                eventId: currentEvent.id,
                title: currentEvent.title,
                date: currentEvent.date,
                time: currentEvent.time,
                paymentStatus: "Success",
                amount: currentEvent.price
            })
        });

        const data = await response.json();

        console.log(data);

        if (data.success) {

            showToast(data.message, "success");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1800);

        } else {

            showToast(data.message, "error");

        }

    } catch (err) {

        console.error(err);
        showToast("Server Error", "error");

    }

}