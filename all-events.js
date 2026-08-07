window.onload = loadAllEvents;

async function loadAllEvents() {
    const res = await fetch("http://localhost:3000/events");
    const events = await res.json();

    const currentDiv = document.getElementById("currentEvents");
    const futureDiv = document.getElementById("futureEvents");
    const pastDiv = document.getElementById("pastEvents");

    currentDiv.innerHTML = "";
    futureDiv.innerHTML = "";
    pastDiv.innerHTML = "";

    const today = new Date();

    events.forEach(event => {
        const eventDate = new Date(event.date);

        let html = `
            <div class="event-item">
                <strong>${event.title}</strong> (${event.date})

                <div class="btn-group">
                    <button onclick="editEvent(${event.id})">✏️ Edit</button>
                    <button onclick="deleteEvent(${event.id})">🗑 Delete</button>
                </div>
            </div>
        `;

        if (eventDate.toDateString() === today.toDateString()) {
            currentDiv.innerHTML += html;
        } else if (eventDate > today) {
            futureDiv.innerHTML += html;
        } else {
            pastDiv.innerHTML += html;
        }
    });

    // Empty check
    if (!currentDiv.innerHTML) currentDiv.innerHTML = "No Current Events";
    if (!futureDiv.innerHTML) futureDiv.innerHTML = "No Future Events";
    if (!pastDiv.innerHTML) pastDiv.innerHTML = "No Past Events";
}

// 🗑 DELETE EVENT
async function deleteEvent(id) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    await fetch(`http://localhost:3000/events/${id}`, {
        method: "DELETE"
    });

    alert("Deleted Successfully");
    loadAllEvents();
}

// ✏️ EDIT EVENT
function editEvent(id) {
    localStorage.setItem("editEventId", id);
    window.location.href = "edit-event.html";
}