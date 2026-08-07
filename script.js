window.onload = function () {

    loadHomeEvents();

    let user =
        localStorage.getItem("loggedUser");

    let name =
        localStorage.getItem("loggedUserName");

    let nav =
        document.querySelector(".nav-links");

    if (user && nav) {

        nav.innerHTML = `
        
        <a href="index.html">Home</a>

        <a href="events.html">Events</a>

        <span style="
        color:yellow;
        font-weight:bold;
        ">
        👋 Hello, ${name}
        </span>

        <a href="#"
        onclick="logout()">
        Logout
        </a>

        <a href="my-events.html">
        My Events
        </a>

        `;
    }
};


// ==========================================
// 🔥 LOAD HOME EVENTS
// ==========================================

async function loadHomeEvents() {

    const container =
        document.getElementById(
            "eventsContainer"
        );

    if (!container)
        return;

    try {

        const res =
            await fetch(
                "https://campzo.onrender.com/events"
            );

        let events =
            await res.json();

        container.innerHTML = "";

        // CURRENT DATE
        let today =
            new Date();

        today.setHours(
            0,0,0,0
        );

        // FILTER UPCOMING EVENTS
        let upcomingEvents =
            events.filter(event=>{

            if(!event.date)
                return false;

            let eventDate =
                new Date(
                    event.date
                );

            eventDate.setHours(
                0,0,0,0
            );

            return eventDate >= today;

        });

        // SORT BY NEAREST DATE
        upcomingEvents.sort(
            (a,b)=>

            new Date(a.date)
            -
            new Date(b.date)
        );


        // NO EVENTS
        if(upcomingEvents.length===0){

            container.innerHTML=`

            <h2 style="
            color:white;
            text-align:center;
            margin-top:50px;
            ">
            No Upcoming Events
            </h2>

            `;

            return;
        }


        // SHOW ALL EVENTS
        upcomingEvents.forEach(event=>{

            let formattedDate =
            new Date(event.date)
            .toLocaleDateString(
                "en-IN",
                {
                    day:"2-digit",
                    month:"short",
                    year:"numeric"
                }
            );

            container.innerHTML += `

            <div class="event-card">

                <img
                src="${event.image || 'https://via.placeholder.com/300'}"
                alt="${event.title}"
                class="event-image"
                >

                <h2>
                ${event.title}
                </h2>

                <p>
                📅 ${formattedDate}
                </p>

                <button
                onclick="viewEvent(${event.id})">

                Learn More

                </button>

            </div>

            `;

        });

    }

    catch(error){

        console.log(
            "Error:",
            error
        );

        container.innerHTML=`

        <h2 style="
        color:red;
        text-align:center;
        ">

        Failed to load events

        </h2>

        `;
    }

}


// ==========================================
// 🔥 VIEW EVENT
// ==========================================

function viewEvent(id){

    localStorage.setItem(
        "selectedEventId",
        id
    );

    window.location.href =
    "event-details.html";
}


// ==========================================
// 🔥 LOGOUT
// ==========================================

function logout(){

    localStorage.removeItem(
        "loggedUser"
    );

    localStorage.removeItem(
        "loggedUserName"
    );

    window.location.href =
    "login.html";
}