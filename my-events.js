const container =
document.getElementById("registeredEvents");

// =============================
// VIEW EVENT
// =============================
function viewEvent(eventId){

    localStorage.setItem(
        "selectedEventId",
        eventId
    );

    window.location.href =
    "event-details.html";

}

// =============================
// DE-REGISTER EVENT
// =============================
async function deregisterEvent(registrationId){

    const confirmDelete =
    confirm(
        "Are you sure you want to de-register from this event?"
    );

    if(!confirmDelete){
        return;
    }

    try{

        const response =
        await fetch(
            `http://localhost:3000/deregister/${registrationId}`,
            {
                method:"DELETE"
            }
        );

        const data =
        await response.json();

        if(data.success){

            showToast(
                "Event De-Registered Successfully",
                "success"
            );

            loadMyEvents();

        }else{

            showToast(
                data.message,
                "error"
            );

        }

    }
    catch(err){

        console.log(err);

        showToast(
            "Server Error",
            "error"
        );

    }

}

// =============================
// LOAD REGISTERED EVENTS
// =============================
async function loadMyEvents() {

    try {

        const userEmail =
        localStorage.getItem(
            "loggedUser"
        );

        if(!userEmail){

            container.innerHTML=`
            <h2>No user logged in</h2>
            `;

            return;
        }

        const res =
        await fetch(
            "http://localhost:3000/registrations"
        );

        const data =
        await res.json();

        const myEvents =
        data.filter(event =>
            event.email === userEmail
        );

        container.innerHTML="";

        if(myEvents.length===0){

            container.innerHTML=`
            <h2 style="
            color:white;
            text-align:center;
            margin-top:40px;
            ">
            No Registered Events Found
            </h2>
            `;

            return;
        }

        myEvents.forEach(event=>{

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

                <h2>
                ${event.title}
                </h2>

                <p>
                📅 ${formattedDate}
                </p>

                <p>
                💰 ₹${event.amount}
                </p>

                <p style="
                color:limegreen;
                font-weight:bold;
                ">
                ${event.paymentStatus}
                </p>

                <div style="
                display:flex;
                gap:10px;
                justify-content:center;
                margin-top:15px;
                ">

                    <button
                    class="btn btn-view"
                    onclick="viewEvent(${event.eventId})">

                        View

                    </button>

                    <button
                    class="btn btn-delete"
                    onclick="deregisterEvent(${event.id})">

                        De-Register

                    </button>

                </div>

            </div>

            `;

        });

    }

    catch(err){

        console.log(err);

        container.innerHTML=`
        <h2 style="color:red">
        Failed to load events
        </h2>
        `;

    }

}

loadMyEvents();