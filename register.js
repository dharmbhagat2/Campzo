function registerEvent() {
    let user = localStorage.getItem("loggedUser");

    if (!user) {
        showToast("Please login first", "error");
        window.location.href = "login.html";
        return;
    }

    let events = JSON.parse(localStorage.getItem("events")) || [];
    let index = localStorage.getItem("selectedEventIndex");
    let event = events[index];

    if (!event) {
        showToast("Event not found", "error");
        return;
    }

    let registrations = JSON.parse(localStorage.getItem("registrations")) || [];

    // ✅ CHECK DUPLICATE
    let already = registrations.find(r =>
        r.email === user && r.eventId === event.id
    );

    if (already) {
        showToast("Already Registered!", "warning");
        return;
    }

    // 💳 CHECK PRICE
    if (event.price && event.price !== "Free" && event.price !== "0") {
        // 👉 STORE EVENT FOR PAYMENT PAGE
        localStorage.setItem("paymentEvent", JSON.stringify(event));

        // 👉 REDIRECT TO PAYMENT PAGE
        window.location.href = "payment.html";
        return;
    }

    // ✅ FREE EVENT REGISTER DIRECTLY
    registrations.push({
        email: user,
        eventId: event.id,
        title: event.title,
        date: event.date
    });

    localStorage.setItem("registrations", JSON.stringify(registrations));

    showToast("Registered Successfully!", "success");
}