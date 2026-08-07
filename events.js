// =====================================
// GLOBAL
// =====================================

const container =
document.getElementById(
    "eventsContainer"
);

let events=[];


// =====================================
// LOAD EVENTS
// =====================================

async function loadEvents(){

    try{

        const res=
        await fetch(
            "https://campzo.onrender.com/events"
        );

        events=
        await res.json();

        renderEvents(events);

    }

    catch(err){

        console.log(
            err
        );
    }
}


// =====================================
// RENDER EVENTS
// =====================================

function renderEvents(data){

    container.innerHTML="";

    let today=
    new Date();

    today.setHours(
        0,0,0,0
    );

    // upcoming only
    let filtered=
    data.filter(event=>{

        if(!event.date)
        return false;

        let eventDate=
        new Date(
            event.date
        );

        eventDate.setHours(
            0,0,0,0
        );

        return eventDate>=today;

    });

    // nearest first
    filtered.sort(
        (a,b)=>
        new Date(a.date)-
        new Date(b.date)
    );

    if(filtered.length===0){

        container.innerHTML=
        `
        <h2 style="
        width:100%;
        color:white;
        text-align:center;
        ">
        No Upcoming Events
        </h2>
        `;

        return;
    }

    filtered.forEach(event=>{

        let formattedDate=
        new Date(
            event.date
        ).toLocaleDateString(
            "en-IN",
            {
                day:"2-digit",
                month:"short",
                year:"numeric"
            }
        );

        container.innerHTML+=`

        <div class="event-card">

            <img
            src="${
                event.image ||
                "https://via.placeholder.com/300"
            }"
            class="event-image"
            >

            <h2>
            ${event.title}
            </h2>

            <p>
            📅 ${formattedDate}
            </p>

            <button
            onclick=
            "viewEvent(${event.id})">

            Learn More

            </button>

        </div>

        `;
    });

}


// =====================================
// SEARCH
// =====================================

function searchEvents(){

    let input=
    document
    .getElementById(
        "searchBox"
    )
    .value
    .toLowerCase();

    // if empty → show all
    if(input===""){

        renderEvents(events);

        return;
    }

    let result=
    events.filter(event=>

        event.title
        .toLowerCase()
        .includes(input)

    );

    renderEvents(result);

}


// =====================================
// VIEW EVENT
// =====================================

function viewEvent(id){

    localStorage.setItem(
        "selectedEventId",
        id
    );

    window.location.href=
    "event-details.html";

}


// =====================================
// INITIAL LOAD
// =====================================

loadEvents();