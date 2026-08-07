// 🔥 GET EVENT ID
const eventId = localStorage.getItem("editEventId");

let selectedImage = null;


// ======================================
// 🔥 LOAD EXISTING EVENT DATA
// ======================================

async function loadEvent() {

    try {

        const res =
        await fetch(
            "https://campzo.onrender.com/events"
        );

        const events =
        await res.json();

        const event =
        events.find(
            e => e.id == eventId
        );

        if (!event) {

            alert(
                "Event not found"
            );

            return;
        }

        // TITLE
        document.getElementById(
            "eventTitle"
        ).value =
        event.title || "";

        // DESCRIPTION
        document.getElementById(
            "eventDescription"
        ).value =
        event.description || "";

        // DATE
        if(event.date){

            document.getElementById(
                "eventDate"
            ).value =
            event.date.split("T")[0];
        }

        // TIME
        document.getElementById(
            "eventTime"
        ).value =
        event.time || "";

        // PRICE
        document.getElementById(
            "eventPrice"
        ).value =
        event.price || "";

        // IMAGE PREVIEW
        if(event.image){

            const preview =
            document.getElementById(
                "imagePreview"
            );

            preview.src =
            event.image;

            preview.style.display =
            "block";
        }

    }

    catch(error){

        console.log(
            "Load error:",
            error
        );

    }
}


// ======================================
// 🔥 IMAGE PREVIEW
// ======================================

document.getElementById(
"eventImage"
).addEventListener(
"change",

function(){

    const file =
    this.files[0];

    if(file){

        selectedImage =
        file;

        const reader =
        new FileReader();

        reader.onload =
        function(e){

            const preview =
            document.getElementById(
            "imagePreview"
            );

            preview.src =
            e.target.result;

            preview.style.display =
            "block";
        };

        reader.readAsDataURL(
        file
        );
    }

});


// ======================================
// 🔥 UPDATE EVENT
// ======================================

async function updateEvent(){

    try{

        let formData =
        new FormData();

        formData.append(
        "title",
        document.getElementById(
        "eventTitle"
        ).value
        );

        formData.append(
        "description",
        document.getElementById(
        "eventDescription"
        ).value
        );

        formData.append(
        "date",
        document.getElementById(
        "eventDate"
        ).value
        );

        formData.append(
        "time",
        document.getElementById(
        "eventTime"
        ).value
        );

        formData.append(
        "price",
        document.getElementById(
        "eventPrice"
        ).value
        );

        if(selectedImage){

            formData.append(
            "image",
            selectedImage
            );
        }


        await fetch(

        `https://campzo.onrender.com/events/${eventId}`,

        {
            method:"PUT",
            body:formData
        }

        );

        showToast(
        "Event Updated ✅"
        );

        setTimeout(()=>{

            window.location.href =
            "all-events.html";

        },1500);

    }

    catch(error){

        console.log(error);

        alert(
        "Update failed"
        );
    }

}


// ======================================
// 🔥 CANCEL
// ======================================

function goBack(){

    window.location.href =
    "all-events.html";
}


// ======================================
// 🔥 TOAST
// ======================================

function showToast(message){

    const toast =
    document.getElementById(
    "toast"
    );

    toast.innerText =
    message;

    toast.style.position =
    "fixed";

    toast.style.bottom =
    "20px";

    toast.style.right =
    "20px";

    toast.style.background =
    "#22c55e";

    toast.style.color =
    "#fff";

    toast.style.padding =
    "12px";

    toast.style.borderRadius =
    "10px";

    setTimeout(()=>{

        toast.innerText="";

    },2000);

}


// START
loadEvent();